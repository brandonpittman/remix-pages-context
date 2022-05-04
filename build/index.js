"use strict";
exports.__esModule = true;
exports.getPagesContext = exports.setPagesContext = void 0;
var pagesContext;
var setPagesContext = function (context) {
    pagesContext = context;
};
exports.setPagesContext = setPagesContext;
var getPagesContext = function () { return pagesContext; };
exports.getPagesContext = getPagesContext;
