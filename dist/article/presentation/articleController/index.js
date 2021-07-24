"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeArticleController = void 0;
const CreateArticleHandler_1 = require("./CreateArticleHandler");
const express_1 = require("express");
const makeArticleController = ({ inject }) => {
    const router = express_1.Router();
    router.post('/', inject(CreateArticleHandler_1.makeCreateArticleHandler));
    return router;
};
exports.makeArticleController = makeArticleController;
