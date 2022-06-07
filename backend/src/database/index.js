require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require("path");
const md5 = require("md5");

class Database {
    async connect() {
        return new Promise((resolve, reject) => {
            mongoose.connection.on('error', (...args) => {
                console.error("Database connection error:", ...args);
                reject();
            });
            mongoose.connection.once('open', function () {
                console.log('[info] Connected to database!');
                resolve()
            });


            mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
        })
    }

    async loadModels(models_path = "./models") {

        let models = await fs.promises.readdir(path.join(__dirname, models_path));

        for (let model of models) {
            await require(`${models_path}/${model}`);
        }
        console.log('[info] Models loaded!');
    }

    get model() {
        return mongoose.models;
    }
}

module.exports = {
    Database
};