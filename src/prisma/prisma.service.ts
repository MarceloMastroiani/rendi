import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { envs } from '../config/envs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: envs.dataBase });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('DataBase connect');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('DataBase disconnect');
  }
}
