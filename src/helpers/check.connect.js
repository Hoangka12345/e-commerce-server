"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;

// coount number of database connections
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections::${numConnections}`);
};

// check overload database
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // illustrate maximum number of connections in the device is 5
        const maxConnections = numCores * 5;

        console.log(`Active connections:: ${numConnections}`);
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

        // check overload connection to database (should minus maxConnections to generate time for handle)
        if (numConnections > maxConnections) {
            console.log("connection overload detected!");
        }
    }, _SECONDS);
};

module.exports = {
    countConnect,
    checkOverload,
};
