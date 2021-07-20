"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTitle = exports.markAsDeleted = exports.publish = exports.create = void 0;
const create = (props) => ({
    id: props.id,
    title: props.title,
    content: props.content,
    state: 'DRAFT',
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0
});
exports.create = create;
const publish = (self) => ({
    ...self,
    state: 'PUBLISHED',
    publishedAt: new Date()
});
exports.publish = publish;
const markAsDeleted = (self) => ({
    ...self,
    state: 'DELETED'
});
exports.markAsDeleted = markAsDeleted;
const changeTitle = (self, title) => ({
    ...self,
    title
});
exports.changeTitle = changeTitle;
