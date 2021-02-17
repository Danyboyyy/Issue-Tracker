import { __prod__ } from './constants';
import { Issue } from './entities/Issue';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { psswd } from './psswd';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/
  },
  entities: [Issue],
  dbName: 'issuetracker',
  type: 'postgresql',
  password: psswd,
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];