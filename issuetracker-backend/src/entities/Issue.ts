import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Issue extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date;

  @Field()
  @Column()
  title!: string;
}