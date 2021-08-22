import { ArticleMessages } from "@/article/messages";
import { makeMessegeBundle } from "@/_lib/message/MessageBundle";

type Messages = ArticleMessages;

const messageBundle = makeMessegeBundle<Messages>();

const { useBundle } = messageBundle;

export { messageBundle, useBundle };
export type { Messages };
