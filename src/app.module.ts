import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.provider';
import { Book } from './book.entity';
import { Category } from './category.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';

@Module({
  imports: [
    // 환경 변수를 애플리케이션 전역에서 사용 가능하도록 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeORM DB 연결. .env 값을 읽어야 하므로 ConfigService를 주입받는 forRootAsync를 사용
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true, // forFeature로 등록한 엔티티를 자동으로 연결
        synchronize: false, // 이미 만든 테이블을 쓰므로 스키마 자동 변경 금지
        bigNumberStrings: false, // bigint PK를 문자열이 아닌 숫자로 받기
      }),
    }),
    // 이 모듈에서 Repository<Book>, Repository<Category>를 주입받을 수 있게 등록
    TypeOrmModule.forFeature([Book, Category]),
  ],
  controllers: [
    AppController,
    BookController,
    RentalController, 
  ],
  providers: [
    ...databaseProviders, // 1. DB 커넥션 풀을 부품으로 등록
    AppService,
    BookService,
    RentalService,
    RentalRepository,
  ],
    exports: [...databaseProviders], // 2. 다른 모듈/서비스에서도 쓸 수 있게 공개
})
export class AppModule {}