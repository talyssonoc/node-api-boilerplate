import { ArticleMessages } from "@/article/messages";
import { makeMessegeBundle } from "@/_lib/message/MessageBundle";

type Messages = ArticleMessages;

const messageBundle = makeMessegeBundle<Messages>();

const { getMessage, updateBundle, useBundle } = messageBundle;

type MessageBundle = typeof messageBundle;

export { messageBundle, getMessage, updateBundle, useBundle };
export type { Messages, MessageBundle };
