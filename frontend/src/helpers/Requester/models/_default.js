import Ajax from '../ajax.js';

class DefaultModel {
    constructor(ajax) {
        if (Object.getPrototypeOf(ajax) !== Ajax.prototype) throw new Error('Ajax object is required');
        this.ajax = ajax;
        this.path = null;
    }

    async list(params = {}) {
        return this.ajax.request('GET', `${this.path}/list`, params);
    }

    async get(id, params = {}) {
        return this.ajax.request('GET', this.path, {
            id,
            ...params,
        });
    }

    async create(params = {}) {
        return this.ajax.request('POST', this.path, params);
    }

    async update(id, key, value) {
        return this.ajax.request('PUT', this.path, {
            id,
            key,
            value,
        });
    }

    async delete(id) {
        return this.ajax.request('DELETE', this.path, {
            id,
        });
    }
}

export default DefaultModel;
