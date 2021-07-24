"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
var Article;
(function (Article) {
    Article.create = (props) => ({
        id: props.id,
        title: props.title,
        content: props.content,
        state: "DRAFT",
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
    });
    Article.publish = (self) => ({
        ...self,
        state: "PUBLISHED",
        publishedAt: new Date(),
    });
    Article.markAsDeleted = (self) => ({
        ...self,
        state: "DELETED",
    });
    Article.changeTitle = (self, title) => ({
        ...self,
        title,
    });
})(Article || (Article = {}));
exports.Article = Article;
