"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.updatePagesData = exports.getPagesContext = exports.setPagesContext = void 0;
var pagesContext;
var setPagesContext = function (context) {
    pagesContext = context;
};
exports.setPagesContext = setPagesContext;
var getPagesContext = function () { return pagesContext; };
exports.getPagesContext = getPagesContext;
var updatePagesData = function (data) {
    pagesContext.data = __assign(__assign({}, pagesContext.data), data);
};
exports.updatePagesData = updatePagesData;
