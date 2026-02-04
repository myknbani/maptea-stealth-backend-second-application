import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver, type Options } from '@mikro-orm/postgresql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppConfigModule } from './app-config/app-config.module';
import { EnvConfig } from './app-config/env-config';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from './database/orm/mikro-orm.config';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [EnvConfig],
      useFactory: (config: EnvConfig): Options => ({
        driver: PostgreSqlDriver,
        ...mikroOrmConfig,
        clientUrl: config.databaseUrl,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: true,
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
      introspection: true, // expose even in production for exercise demo purposes
    }),
    AuthModule,
    LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
