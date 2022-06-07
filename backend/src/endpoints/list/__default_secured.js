const {ApiEndpoint} = require('./__default');
const mongoose = require('mongoose');

class ApiEndpointSecured extends ApiEndpoint {
    constructor(props) {
        super(props);
        this._setAccess({
                get: 'admin',
                list: 'admin',
                create: 'admin',
                update: 'admin',
                delete: 'admin'
        })

        this._setAccess(props.access);
    }

    _setAccess(access = {}){
        this.method_mapping = this.method_mapping.map(e => {
            let name = e.name?.toLowerCase();
            let _ = access[name] || e.allowed_to || 'admin';

            if (typeof (_) === 'string') {
                if (_ === '*') {
                    _ = [];
                } else if (['user', 'admin'].includes(_)) {
                    _ = [_];
                } else {
                    throw new Error(`Invalid access role: ${_}`);
                }
            } else if (Array.isArray(_)) {

            }else{
                throw new Error(`Invalid access role: ${_}`);
            }

            e.allowed_to = _
            return e;
        });
    }

    async _tryToGetUser({token}){
        if (!token) {
            return {}
        }

        let user = await mongoose.model('User').findOne({
            accessToken: token
        })

        if (user) return { user }
        return {};
    }

    async _validateRequest({token}, mapping) {
        let { user } = await this._tryToGetUser({token}, mapping);
        if(!user) return {
            ok: false,
            error: 'You are not allowed to perform this action'
        };

        if (!mapping.allowed_to.includes(user.role)) {
            return {
                ok: false,
                error: 'You are not permitted to perform this action'
            };
        }

        return {
            ok: true,
            user: user
        }
    }

    apply() {
        let default_routes = ['get', 'create', 'update', 'delete'];
        this.method_mapping.forEach(mapping => {
            if(Array.isArray(mapping)) return;

            let path = default_routes.includes(mapping.name) ? this.path : this.path + '/' + mapping.name;

            this.app.route(path)[mapping.method](async (req, res) => {
                const params = {};
                let has_error = false;
                Object.keys(mapping.params).concat(['token']).forEach(param => {
                    if (has_error) return;


                    if (req.params[param]) {
                        params[param] = req.params[param];
                    } else if (req.query[param]) {
                        params[param] = req.query[param];
                    } else if (req.body[param]) {
                        params[param] = req.body[param];
                    } else if(param === 'token'){

                    } else if (mapping.params[param].required) {
                        res.status(400).send({
                            error: `Missing required parameter: ${param}`
                        });
                        has_error = true;
                    }
                });
                if (has_error) return;

                let { user } = await this._tryToGetUser({token: params.token}, mapping);
                params.user = user;

                if (mapping.allowed_to.length) {
                    let {ok, error, user} = await this._validateRequest({token: params.token}, mapping);

                    if (!ok) {
                        return res.status(401).send({
                            error: error
                        });
                    }
                }

                try {
                    let result = mapping.handler.bind(this)(params, mapping);
                    if (result instanceof Promise) {
                        result.then(data => {
                            res.send(data);
                        }).catch(err => {
                            console.error(err)
                            res.status(500).send({
                                error: err.message
                            });
                        });
                    } else {

                        res.send(result);
                    }
                } catch (error) {
                    res.status(500).send({
                        error: error.message
                    });
                }
            });
        });
    }

}

module.exports = {ApiEndpointSecured}