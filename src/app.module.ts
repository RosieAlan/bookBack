import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Book } from './user/entities/book.entity';
import { UserBook } from './user/entities/user-book.entity';
import { BookModule } from './book/book.module';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123456",
      database: "book_management_system_backend",
      synchronize: true,
      logging: true,
      entities: [User,Book,UserBook],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
    UserModule,
    BookModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
