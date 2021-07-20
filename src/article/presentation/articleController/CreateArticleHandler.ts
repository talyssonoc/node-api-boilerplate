import { CreateArticle } from '@/article/application/CreateArticle';
import { Request, Response } from 'express';

type Dependencies = {
  createArticle: CreateArticle;
}
const makeCreateArticleHandler = ({ createArticle }: Dependencies) =>
  async (req: Request, res: Response) => {
    const {body} = req;

    const id = await createArticle({ title: body.title, content: body.content });

    res.json({ id });
  }

export { makeCreateArticleHandler }