import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { IssueResolver } from './resolvers/issue';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import connectPg from 'connect-pg-simple'
import { psswd } from './psswd';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  
  const app = express();

  const PgStore = connectPg(session);

  const conObject = {
    user: 'postgres',
    password: psswd,
    host: 'localhost',// or whatever it may be
    port: 5432,
    database: 'issuetracker'
  };

  app.use(session({
    name: 'cid',
    store: new (PgStore)({
      conObject: conObject
    }),
    secret: 'qwertyuiop',
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      httpOnly: true,
      sameSite: 'lax',
      secure: __prod__
    },
    saveUninitialized: false
  }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, IssueResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res })
  });

  apolloServer.applyMiddleware({ app });

  
  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  })
  
}

main().catch(err => {
  console.error(err);
});