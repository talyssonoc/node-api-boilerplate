"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePublishArticle = void 0;
const Article_1 = require("../domain/Article");
const makePublishArticle = ({ articleRepository }) => async (payload) => {
    let article = await articleRepository.findById(payload);
    article = Article_1.Article.publish(article);
    await articleRepository.store(article);
};
exports.makePublishArticle = makePublishArticle;
