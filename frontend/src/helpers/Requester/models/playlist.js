import DefaultModel from './_default';

class Playlist extends DefaultModel {
    constructor(ajax) {
        super(ajax);
        this.path = '/playlist';
    }

    addSong(playlist_id, song_id) {
        return this.ajax.request('POST', `${this.path}/addSong`, {
            song_id,
            playlist_id,
        });
    }

    removeSong(playlist_id, song_id) {
        return this.ajax.request('DELETE', `${this.path}/removeSong`, {
            song_id,
            playlist_id,
        });
    }

}

export default Playlist;