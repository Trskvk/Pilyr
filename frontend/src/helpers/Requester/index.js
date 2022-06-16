import Ajax from './ajax.js';
import Playlist from './models/playlist.js';
import Song from './models/song.js';
import User from './models/user.js';

class Requester {
    constructor(apiUrl, token = null) {
        this.ajax = new Ajax(apiUrl, token);

        this.playlist = new Playlist(this.ajax);
        this.song = new Song(this.ajax);
        this.user = new User(this.ajax);
    }
}

export default Requester;
