const mongoose = require('mongoose');

class ApiEndpoint {
    constructor({model, app}) {
        this.db = mongoose.model(model);
        this.app = app;
        this.path = '/' + model.toLowerCase();
        this.method_mapping = [];

        this._addMapping({
            // get item by id
            name: 'get',
            method: 'get',
            handler: this.get,
            params: {
                id: {
                    required: true
                }
            }

        })._addMapping({
            // get list by given params
            name: 'list',
            method: 'get',
            handler: this.list,
            params: {
                search_params: {
                    required: false,
                    default: {}
                }
            }
        })._addMapping({
            // create new item
            name: 'create',
            method: 'post',
            handler: this.create,
            params: {
                data: {
                    required: true
                }
            }
        })._addMapping({
            // set item <key> to <value> by <id>
            name: 'update',
            method: 'put',
            handler: this.update,
            params: {
                id: {
                    required: true
                },
                key: {
                    required: true
                },
                value: {
                    required: true
                }
            }
        })._addMapping({
            // delete item by id
            name: 'delete',
            method: 'delete',
            handler: this.delete,
            params: {
                id: {
                    required: true
                }
            }
        })
    }

    _addMapping(data = {}, override = null) {

        if (override) {
            let item_index = this.method_mapping.findIndex(e => e.name === override);
            if (item_index !== -1) {
                this.method_mapping[item_index] = data;
                return this;
            }
        }

        this.method_mapping.push(data);
        return this;
    }

    get({id}, mapping, populate = []) {
        if (!id || id.length !== 24) throw new Error('Invalid id');

        let query = this.db.findById(id);
        for (const item of populate) {
            query.populate(item);
        }
        return query.lean().exec();
    }

    async list(data, mapping, populate = []) {
        let search_params = data.search_params || {};
        let query = this.db.find(search_params);
        for (const item of populate) {
            query.populate(item);
        }

        let list = await query
            .catch(err => {
                console.log(err)
            });

        return {
            data: list || [],
            params: search_params
        }
    }

    create({data}) {
        return (new this.db(data)).save();
    }

    async update(data) {
        if (!data.id || data.id.length !== 24) throw new Error('Invalid id');

        return await this.db.findOneAndUpdate({_id: data.id}, {$set: {[data.key]: data.value}}).exec();
    }

    async delete(data) {
        return this.db.findByIdAndDelete(data.id);
    }

    apply() {
        let default_routes = ['get', 'create', 'update', 'delete'];
        this.method_mapping.forEach(mapping => {

            let path = default_routes.includes(mapping.name) ? this.path : this.path + '/' + mapping.name;

            this.app.route(path)[mapping.method]((req, res) => {
                const params = {};
                let has_error = false;
                Object.keys(mapping.params).forEach(param => {
                    if (has_error) return;

                    if (req.params[param]) {
                        params[param] = req.params[param];
                    } else if (req.query[param]) {
                        params[param] = req.query[param];
                    } else if (req.body[param]) {
                        params[param] = req.body[param];
                    } else if (mapping.params[param].required) {
                        res.status(400).send({
                            error: `Missing required parameter: ${param}`
                        });
                        has_error = true;
                    }
                });

                if (has_error) return;

                try {
                    let result = mapping.handler.bind(this)(params, mapping);
                    if (result instanceof Promise) {
                        result.then(data => {
                            res.send(data);
                        }).catch(err => {
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

module.exports = {
    ApiEndpoint
}