import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Issue } from './entities/Issue';
import mikroOrmConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  //const post = orm.em.create(Issue, { title: "my first post" });
  //await orm.em.persistAndFlush(post);

  const issues = await orm.em.find(Issue, {});
  console.log(issues);
  
}

main().catch(err => {
  console.error(err);
});