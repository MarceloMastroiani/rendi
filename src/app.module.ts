import { Module } from '@nestjs/common';
import { TelegramModule } from './channels/telegram/telegram.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TelegramModule, PrismaModule],
})
export class AppModule {}
