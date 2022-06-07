import Ajax from './ajax';
import Playlist from './models/playlist'
import Song from './models/song'
import User from './models/user'

let models = ['user', 'playlist', 'song'];

class Requester{
    constructor(api_url, token=null){
        this.ajax = new Ajax(api_url, token);

        this.playlist = new Playlist(this.ajax);
        this.song = new Song(this.ajax);
        this.user = new User(this.ajax);
    }
}

export default Requester;