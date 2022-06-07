const fs = require("fs");
const path = require("path");

class EndpointCore{
    constructor({app, db}){
        this.app = app;
    }

    async loadEndpoints(endpoints_path = "./list") {
        let endpoints = await fs.promises.readdir(path.join(__dirname, endpoints_path));
        endpoints = endpoints.filter(endpoint => !endpoint.startsWith('_'));

        for (let endpoint_name of endpoints) {
            let endpoint = require(`${endpoints_path}/${endpoint_name}`);
            console.log(`\nLoading endpoint ${endpoint_name}`);
            let endpoint_instance = new endpoint({app: this.app});
            endpoint_instance.apply()
        }
    }
}

module.exports = { EndpointCore }