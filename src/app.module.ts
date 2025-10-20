import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeesModule } from './modules/employees/employees.module';
import { AreasModule } from './modules/areas/areas.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FlowsModule } from './modules/flows/flows.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [RolesModule, 
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService : ConfigService) => ({
      type: 'oracle',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      serviceName: configService.get<string>('SERVICE_NAME'),
      schema: configService.get<string>('DB_SCHEMA'),
      timezone: 'local',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: false,
    })
  }),
    EmployeesModule,
    AreasModule,
    CategoriesModule,
    FlowsModule,
    CustomersModule,
    OrdersModule,
    ProductModule,
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
