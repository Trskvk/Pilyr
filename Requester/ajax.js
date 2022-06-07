class Ajax{
    constructor(api_url, token=null) {
        if(!api_url || !api_url.match(/^(http|https):\/\/[^ "]+$/)){
            throw new Error('Invalid api_url');
        }

        this.api_url = api_url;
        this.token = token;
    }

    _build_url_params(params = {}){
        if(typeof(params) !== 'object')
            throw new Error(`Invalid url query param type: ${typeof(params)}. Expected: Object`);

        if(this.token)
            params.token = this.token;

        return Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    async request(method, path, params) {
        let url = `${this.api_url}${path}`;
        let body = null;

        if(method === 'GET'){
            let _ = this._build_url_params(params);
            if(_) url += `?${_}`;
        }else{
            body = JSON.stringify(this.token ? {...params, token: this.token} : params);
        }

        let query = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body
        }).catch(err => {
            throw new Error(`Failed to fetch ${url}: ${err.message}`);
        });

        return await query.json()
            .catch(err => {
                throw new Error(`Error while parsing response: ${err.message}`);
            });
    }
}

export default Ajax;