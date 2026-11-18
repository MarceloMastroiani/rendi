import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { Bot } from 'grammy';
import { envs } from '../../config/envs';
import type { BotContext } from './context';
import { TELEGRAM_BOT } from './telegram.constants';

@Module({
  providers: [
    {
      provide: TELEGRAM_BOT,
      useFactory: () => new Bot<BotContext>(envs.botToken),
    },
    TelegramService,
  ],
})
export class TelegramModule {}
