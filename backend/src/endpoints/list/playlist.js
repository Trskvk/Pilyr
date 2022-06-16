const {ApiEndpointSecured} = require('./__default_secured');

class PlaylistEndpoint extends ApiEndpointSecured {
    constructor({app}) {
        super({
            model: 'Playlist',
            app
        });

        this._setAccess({
            get: [],
            create: [],
            update: [],
            delete: [],
        })

        this._addMapping({
            // create new item
            name: 'create',
            method: 'post',
            handler: this.create,
            allowed_to: [],
            params: {
                title: {
                    required: true,
                },
                image: {
                    required: true,
                },
                type: {
                    required: true,
                }
            }
        }, 'create')._addMapping({
            // create new item
            name: 'addSong',
            method: 'post',
            handler: this.addSong,
            allowed_to: [],
            params: {
                playlistId: {
                    required: true,
                },
                songId: {
                    required: true,
                }
            }
        })._addMapping({
            // create new item
            name: 'removeSong',
            method: 'delete',
            handler: this.removeSong,
            allowed_to: [],
            params: {
                playlistId: {
                    required: true,
                },
                songId: {
                    required: true,
                }
            }
        })._addMapping({
            // create new item
            name: 'list',
            method: 'get',
            handler: this.list,
            allowed_to: [],
            params: {
                type: {
                    default: 'public'
                }
            }
        }, 'list');
    }

    async get({id, user}, mapping){
        let playlist = await super.get({id}, mapping, ['songs', 'creator']);
        if(!playlist) throw new Error('Playlist not found');

        let type = playlist.type;
        let is_authed = !!user;
        let is_admin = user && user.role === 'admin';
        let is_own = user && playlist.creator._id.toString() === user._id.toString();

        playlist.can_edit = type === 'public' ? is_authed : (is_admin || is_own);
        return playlist
    }

    async create({title, image, type, user}, ...args) {
        title = title.trim();
        image = image.trim();

        if (image.length < 10) {
            return {
                error: 'Image is required'
            }
        }

        if (!['public', 'private'].includes(type)) {
            return {
                error: 'Invalid type. Allowed: public, private'
            }
        }

        if (title.length < 3) {
            return {
                error: 'Title must be at least 3 characters long'
            }
        }

        return await super.create({
            data: {
                title,
                image,
                type,
                creator: user._id
            }
        }, ...args);
    }

    async list({type, user}, mapping) {
        type = type || 'public'; // public/own/all/private
        let is_authed = user && user._id;
        let is_admin = user && user.role === 'admin';

        let populate = ['songs', 'creator']

        if (type === 'public') return await super.list({
            search_params: {
                type: 'public'
            }
        }, mapping, populate);

        if (!is_authed && type !== 'public') {
            throw new Error('You must be logged in to view not public playlists')
        } else if (!is_admin && type !== 'own') {
            throw new Error('You must be admin to view private playlists')
        }

        if (type === 'own') {
            return await super.list({
                search_params: {
                    creator: user._id
                }
            }, mapping, populate);
        } else if (type === 'all') {
            return await super.list({}, mapping, populate);
        } else {
            return await super.list({
                search_params: {
                    type: 'private'
                }
            }, mapping, populate);
        }
    }

    async update({id, key, value, user}) {
        let item = await this.db.findById(id).populate('creator').exec();
        let is_authed = user && user._id;
        let is_admin = user && user.role === 'admin';
        let is_own = user && item.creator._id.toString() === user._id.toString();

        if (!item) throw new Error('Item not found');

        if (!is_admin && !is_own && !(key === 'title' && item.type === 'public')) throw new Error('You are not allowed to edit this playlist');

        return await super.update({id, key, value});
    }

    async addSong({playlistId, songId, user}, ...args) {
        let is_authed = user && user._id;
        let is_admin = user && user.role === 'admin';

        let item = await this.db.findById(playlistId).populate('creator').exec();

        if (!item) throw new Error('Item not found');

        if (item.type === "private" && !is_admin && item.creator._id.toString() !== user._id.toString()) throw new Error('You are not allowed to edit this playlist');

        await this.db.findOneAndUpdate({
            _id: playlistId
        }, {
            $addToSet: {
                songs: {
                    _id: songId
                }
            }
        }).exec()

        return await this.get({id: playlistId, user}, ...args);
    }

    async removeSong({playlistId, songId, user}) {
        let is_authed = user && user._id;
        let is_admin = user && user.role === 'admin';

        let item = await this.db.findById(playlistId).populate('creator').exec();

        if (!item) throw new Error('Item not found');

        if (item.type === "private" && !is_admin && item.creator._id.toString() !== user._id.toString()) throw new Error('You are not allowed to edit this playlist');

        return await this.db.findOneAndUpdate({
            _id: playlistId
        }, {
            $pullAll: {
                songs: [{
                    _id: songId
                }]
            }
        }).populate('songs').exec()
    }
}

module.exports = PlaylistEndpoint;