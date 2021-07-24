"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateArticleHandler = void 0;
const makeCreateArticleHandler = ({ createArticle }) => async (req, res) => {
    const { body } = req;
    const id = await createArticle({ title: body.title, content: body.content });
    res.json({ id });
};
exports.makeCreateArticleHandler = makeCreateArticleHandler;
