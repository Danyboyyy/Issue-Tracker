import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Issue } from './entities/Issue';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
    })
  });

  apolloServer.applyMiddleware({ app });

  
  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  })
  
}

main().catch(err => {
  console.error(err);
});