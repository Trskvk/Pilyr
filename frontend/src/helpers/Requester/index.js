import Ajax from './ajax';
import Playlist from './models/playlist';
import Song from './models/song';
import User from './models/user';

class Requester {
    constructor(apiUrl, token = null) {
        this.ajax = new Ajax(apiUrl, token);

        this.playlist = new Playlist(this.ajax);
        this.song = new Song(this.ajax);
        this.user = new User(this.ajax);
    }
}

export default Requester;
