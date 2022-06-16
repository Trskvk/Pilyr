import DefaultModel from './_default.js';

class User extends DefaultModel {
    constructor(ajax) {
        super(ajax);
        this.path = '/user';
    }

    async login(username, password) {
        if (!username || !password) throw new Error('Username or/and password are required');

        const response = await this.ajax.request('POST', `${this.path}/login`, {
            username,
            password,
        });

        if (this.success) {
            this.ajax.token = response.user.accessToken;
        }

        return response;
    }

    async register(username, password, role) {
        if (!username || !password) throw new Error('Username or/and password are required');

        const response = await this.ajax.request('POST', `${this.path}`, {
            username,
            password,
            role,
        });

        if (response.user && response.user.accessToken) {
            this.ajax.token = response.user.accessToken;
        }

        return response;
    }

    // async logout() {
    //     if (!this.token)
    //         throw new Error('You are not logged in');
    //
    //     let response = await this.ajax
    //         .request('GET', `${this.path}/logout`, {
    //             token: this.ajax.token
    //         });
    //
    //     // TODO: check response
    //     this.ajax.token = null;
    // }
}

export default User;
