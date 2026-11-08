import { MemberWriteService } from './member-write.service';
import { MemberWriteController } from './member-write.controller';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Rating } from './rating.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [Member, Rating],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Member, Rating]),
  ],
  controllers: [MovieController, MemberWriteController],
  providers: [MovieService, MemberWriteService],
})
export class AppModule {}
