const { ApiEndpointSecured } = require('./__default_secured');

class SongEndpoint extends ApiEndpointSecured{
    constructor({app}) {
        super({
            model: 'Song',
            app,
            access: {
                get: '*',
                list: '*',
                create: '*'
            }
        });

        this._addMapping({
            // create new item
            name: 'create',
            method: 'post',
            handler: this.create,
            allowed_to: ['admin'],
            params: {
                title: {
                    required: true
                },
                image: {
                    required: true
                },
                artist: {
                    required: true
                },
                duration: {
                    required: true
                }
            }
        }, 'create')
    }

    async create({title, image, artist, duration}, ...args){
        title = title.trim();
        image = image.trim();
        artist = artist.trim();

        if(!title || !image || !artist || !duration){
            throw new Error('Missing required fields');
        }

        duration = parseInt(duration);

        if(!duration || isNaN(duration) || duration <= 0){
            throw new Error('Duration must be a integer positive number');
        }

        return await super.create({
            data: {
                title, image, artist, duration
            }
        }, ...args);
    }

}

module.exports = SongEndpoint;