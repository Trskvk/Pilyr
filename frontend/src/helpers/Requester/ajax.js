class Ajax {
    constructor(apiUrl, token = null) {
        if (!apiUrl || !apiUrl.match(/^(http|https):\/\/[^ "]+$/)) {
            throw new Error('Invalid apiUrl');
        }

        this.api_url = apiUrl;
        this.token = token;
    }

    buildUrlParams(_ = {}) {
        const params = { ..._ };
        if (typeof (params) !== 'object') throw new Error(`Invalid url query param type: ${typeof (params)}. Expected: Object`);

        if (this.token) params.token = this.token;

        return Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    async request(method, path, params) {
        let url = `${this.api_url}${path}`;
        let body = null;

        if (method === 'GET') {
            const _ = this.buildUrlParams(params);
            if (_) url += `?${_}`;
        } else {
            body = JSON.stringify(this.token ? { ...params, token: this.token } : params);
        }

        const query = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body,
        }).catch((err) => {
            throw new Error(`Failed to fetch ${url}: ${err.message}`);
        });

        return query.json()
            .catch((err) => {
                throw new Error(`Error while parsing response: ${err.message}`);
            });
    }
}

export default Ajax;
