import DefaultModel from './_default';

class Song extends DefaultModel {
    constructor(ajax) {
        super(ajax);
        this.path = '/song';
    }
}

export default Song;