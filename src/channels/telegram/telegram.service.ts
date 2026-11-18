import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { TELEGRAM_BOT } from './telegram.constants';
import { Bot } from 'grammy';
import { BotContext } from './context';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);

  constructor(@Inject(TELEGRAM_BOT) private readonly bot: Bot<BotContext>) {}

  async onModuleInit() {
    this.bot.command('start', (ctx) => ctx.reply('Mandame una factura en PDF'));
    this.bot.catch((err) => {
      this.logger.error(
        `Error en update ${err.ctx.update.update_id}`,
        err.error instanceof Error ? err.error.stack : String(err.error),
      );
    });
    void this.bot
      .start({
        onStart: (me) => this.logger.log(`Bot @${me.username} is running...`),
      })
      .catch((err) => this.logger.error('Bot failed to start', err));
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }
}
