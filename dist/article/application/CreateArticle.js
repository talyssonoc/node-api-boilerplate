"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateArticle = void 0;
const Article_1 = require("../domain/Article");
const makeCreateArticle = ({ articleRepository }) => async (payload) => {
    const id = await articleRepository.getNextId();
    const article = Article_1.Article.create({
        id,
        title: payload.title,
        content: payload.content,
    });
    await articleRepository.store(article);
    return id;
};
exports.makeCreateArticle = makeCreateArticle;
