import EventEmitter from "events";
import { makeContext } from '@/_lib/Context';
import { container } from '@/container';
import { config } from '@/config';

const { context, initFunction, initializer } = makeContext({ app: new EventEmitter(), config, container });

export { context, initFunction, initializer };