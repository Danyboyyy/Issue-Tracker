import 'reflect-metadata'
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { IssueResolver } from './resolvers/issue';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import connectPg from 'connect-pg-simple'
import { psswd } from './psswd';
import { MyContext } from './types';
import cors from 'cors';
import { createConnection } from 'typeorm'
import { User } from './entities/User';
import { Issue } from './entities/Issue';

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'issuetracker2',
    username: 'postgres',
    password: psswd,
    logging: true,
    synchronize: true,
    entities: [User, Issue]
  });
  
  const app = express();

  const PgStore = connectPg(session);

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

  const conObject = {
    user: 'postgres',
    password: psswd,
    host: 'localhost',// or whatever it may be
    port: 5432,
    database: 'issuetracker'
  };

  app.use(session({
    name: COOKIE_NAME,
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
    context: ({ req, res }): MyContext => ({ req, res })
  });

  apolloServer.applyMiddleware({
    app,
    cors: false
  });

  
  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  })
  
}

main().catch(err => {
  console.error(err);
});