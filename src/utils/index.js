"use strict";

const _ = require("lodash");

const getDataInfo = (fields = [], object = {}) => {
    return _.pick(object, fields);
};

const getSelectData = (select) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const unSelectData = (select) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefiedFromObject = (obj) => {
    Object.keys(obj).forEach((i) => {
        if (obj[i] === null || obj[i] === undefined) {
            delete obj[i];
        }
    });
    return obj;
};

const removeUndefiedFromNestedObject = (obj) => {
    const finalObj = {};
    // clear nested obj
    const convertedObj = removeUndefiedFromObject(obj);
    // loop and clear if it is child obj
    Object.keys(convertedObj).forEach((i) => {
        if (typeof convertedObj[i] === "object" && !Array.isArray(convertedObj[i])) {
            const res = removeUndefiedFromObject(convertedObj[i]);
            Object.keys(res).forEach((k) => {
                finalObj[`${i}.${k}`] = res[k];
            });
        } else {
            finalObj[i] = convertedObj[i];
        }
    });

    return finalObj;
};

module.exports = {
    getDataInfo,
    getSelectData,
    unSelectData,
    removeUndefiedFromObject,
    removeUndefiedFromNestedObject,
};
