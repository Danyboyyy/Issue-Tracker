import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Issue {

  @PrimaryKey()
  id!: number;

  @Property({ type: "date", default:"NOW()" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: "text" })
  title!: string;
}