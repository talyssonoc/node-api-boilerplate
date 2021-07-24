"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMongoArticleRepository = void 0;
const mongodb_1 = require("mongodb");
const makeMongoArticleRepository = ({ articleCollection }) => ({
    async getNextId() {
        return Promise.resolve(mongodb_1.ObjectId.generate().toString());
    },
    async findById(id) {
        const article = await articleCollection.findOne({ _id: id });
        if (!article) {
            throw new Error("Article not found");
        }
        return {
            id: article._id.toString(),
            title: article.title,
            content: article.content,
            state: article.status,
            publishedAt: article.publishedAt,
            createdAt: article.createdAt,
            updatedAt: article.createdAt,
            version: article.version,
        };
    },
    async store(entity) {
        const count = await articleCollection.countDocuments({ _id: entity.id });
        if (count) {
            await articleCollection.updateOne({ _id: entity.id }, {
                $set: {
                    title: entity.title,
                    content: entity.content,
                    status: entity.state,
                    publishedAt: entity.publishedAt,
                    createdAt: entity.createdAt,
                    updatedAt: entity.createdAt,
                    version: entity.version,
                },
            });
        }
        await articleCollection.insertOne({
            _id: entity.id,
            title: entity.title,
            content: entity.content,
            status: entity.state,
            publishedAt: entity.publishedAt,
            createdAt: entity.createdAt,
            updatedAt: entity.createdAt,
            version: entity.version,
        });
    },
});
exports.makeMongoArticleRepository = makeMongoArticleRepository;
