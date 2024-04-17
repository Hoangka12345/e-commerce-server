"use strict";

const { default: mongoose } = require("mongoose");
const { mongodb_uri } = require("../configs/config.mongodb");

class Database {
    constructor() {
        this.connect();
    }

    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(mongodb_uri)
            .then(() => console.log("connected to Mongodb successfully!"))
            .catch((err) => console.log("connected to db fail!"));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
