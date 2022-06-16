import DefaultModel from './_default.js';

class Playlist extends DefaultModel {
    constructor(ajax) {
        super(ajax);
        this.path = '/playlist';
    }

    addSong(playlistId, songId) {
        return this.ajax.request('POST', `${this.path}/addSong`, {
            songId,
            playlistId,
        });
    }

    removeSong(playlistId, songId) {
        return this.ajax.request('DELETE', `${this.path}/removeSong`, {
            songId,
            playlistId,
        });
    }
}

export default Playlist;
