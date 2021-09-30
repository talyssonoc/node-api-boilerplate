import { AppModulesMessages } from '@/_boot/appModules';
import { makeMessegeBundle } from '@/_lib/message/MessageBundle';

type Messages = AppModulesMessages;

const messageBundle = makeMessegeBundle<Messages>();

const { getMessage, updateBundle, useBundle } = messageBundle;

type MessageBundle = typeof messageBundle;

export { messageBundle, getMessage, updateBundle, useBundle };
export type { Messages, MessageBundle };
