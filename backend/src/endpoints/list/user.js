const {ApiEndpoint} = require('./__default');
const md5 = require("md5");

class UserEndpoint extends ApiEndpoint {
    constructor({app}) {
        super({
            model: 'User',
            app
        });


        this._addMapping({
            // create new item
            name: 'create',
            method: 'post',
            handler: this.create,
            params: {
                username: {
                    required: true,
                },
                password: {
                    required: true,
                },
                role: {
                    required: true,
                }
            }
        }, 'create')._addMapping({
            name: 'login',
            method: 'post',
            params: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            handler: this.login
        });
    }

    async list(data) {
        // return await super.list(data);
        return {
            error: 'Not allowed!'
        }
    }

    async create({username, password, role}) {
        username = (username || '').trim();

        if (username.length < 3) {
            return Promise.reject({
                code: 400,
                message: 'Username must be at least 3 characters long'
            });
        }

        if (username.length > 20) {
            return Promise.reject({
                code: 400,
                message: 'Username must be at most 20 characters long'
            });
        }

        if (!/^[a-zA-Z0-9_\-\.]+$/.test(username)) {
            return Promise.reject({
                code: 400,
                message: 'Username must contain only letters, numbers and underscores'
            });
        }

        if (password.length < 6) {
            return Promise.reject({
                code: 400,
                message: 'Password must be at least 6 characters long'
            });
        }

        let users_count = await this.db.countDocuments({ username });

        if (users_count > 0) {
            return Promise.reject({
                code: 400,
                message: 'Username already exists'
            });
        }

        if (password.length < 6) {
            return Promise.reject({
                code: 400,
                message: 'Password must be at least 6 characters long'
            });
        }

        if(!['admin', 'user'].includes(role)) {
            return Promise.reject({
                code: 400,
                message: 'Invalid role. Role must be "admin" or "user"'
            });
        }

        password = md5(password + process.env.PASSWORD_SALT)

        let user = await super.create({
            data: {
                username,
                password,
                role
            }
        }).catch(err => {
            return Promise.reject({
                code: 400,
                message: err.message
            });
        });

        if (user) {
            return Promise.resolve({
                message: 'User created successfully',
                user:{
                    _id: user._id,
                    username: user.username,
                    accessToken: user.accessToken,
                    role: user.role
                }
            });
        }
    }

    async login({username, password}) {
        let user = await this.db.findOne({
            username: username,
            password: md5(password + process.env.PASSWORD_SALT)
        })

        if (user) {
            return {
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    accessToken: user.accessToken,
                    role: user.role
                }
            }
        } else {
            return {
                success: false,
                message: 'Invalid username or/and password'
            }
        }
    }
}

module.exports = UserEndpoint;