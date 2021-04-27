import { Migration } from '@mikro-orm/migrations';

export class Migration20210427023155 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_created_at_check";');
    this.addSql('alter table "user" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "user" drop constraint "user_email_unique";');
    this.addSql('alter table "user" drop column "email";');

    this.addSql('alter table "issue" drop constraint if exists "issue_created_at_check";');
    this.addSql('alter table "issue" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "issue" alter column "created_at" set default \'NOW()\';');

    this.addSql('drop table if exists "session" cascade;');
  }

}
