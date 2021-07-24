"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFindArticles = void 0;
const makeFindArticles = ({ articleCollection }) => async () => {
    const articles = await articleCollection.find({
        status: 'PUBLISHED'
    }).sort('publishedAt').toArray();
    return articles.map(article => ({
        id: article._id.toString(),
        title: article.title,
        publishedAt: article.publishedAt
    }));
};
exports.makeFindArticles = makeFindArticles;
