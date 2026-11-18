import type { Context } from 'grammy';
import type { ConversationFlavor } from '@grammyjs/conversations';

export type BotContext = ConversationFlavor<Context>;

export type ConversationContext = Context;
