import Ajax from '../ajax';

class DefaultModel{
    constructor(ajax) {
        if(Object.getPrototypeOf(ajax) !== Ajax.prototype)
            throw new Error('Ajax object is required');
        this.ajax = ajax;
        this.path = null;
    }

    async list(params = {}){
        return await this.ajax.request('GET', this.path+'/list', params);
    }

    async get(id, params = {}){
        return await this.ajax.request('GET', this.path, {
            id,
            ...params
        });
    }

    async create(params= {}){
        return await this.ajax.request('POST', this.path, params);
    }

    async update(id, key, value){
        return await this.ajax.request('PUT', this.path, {
            id,
            key,
            value
        });
    }

    async delete(id){
        return await this.ajax.request('DELETE', this.path, {
            id
        });
    }
}

export default DefaultModel;