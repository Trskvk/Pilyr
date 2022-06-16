import DefaultModel from './_default.js';

class Song extends DefaultModel {
    constructor(ajax) {
        super(ajax);
        this.path = '/song';
    }
}

export default Song;
