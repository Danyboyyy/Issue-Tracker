import { Issue } from '../entities/Issue';
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'; 
import { MyContext } from 'src/types';
import { getConnection } from 'typeorm';
import { isAuth } from '../middleware/isAuth';

@InputType()
class IssueInput {
  @Field()
  title: string;
  
  @Field()
  description: string;

  @Field()
  category: string;
}

@Resolver()
export class IssueResolver {
  @Query(() => [Issue])
  issues(): Promise<Issue[]> {
    return Issue.find();
  }

  @Query(() => Issue, { nullable: true })
  issue( 
    @Arg('id') id: number
  ): Promise<Issue | undefined> {
    return Issue.findOne(id);
  }

  @Mutation(() => Issue)
  @UseMiddleware(isAuth)
  async createIssue( 
    @Arg('input') input: IssueInput,
    @Ctx() { req }: MyContext
  ): Promise<Issue> {
    let issue;
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Issue)
      .values({
        ...input,
        creatorId: req.session.userId
      })
      .returning('*')
      .execute();
      issue = result.raw[0];

    return issue;
  }

  @Mutation(() => Issue)
  async updateIssue( 
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
  ): Promise<Issue | null> {
    const issue = await Issue.findOne(id);

    if (!issue) {
      return null;
    }
    if (typeof title !== undefined) {
      await Issue.update({ id }, { title });
    }
    return issue;
  }

  @Mutation(() => Boolean)
  async deleteIssue( 
    @Arg('id') id: number,
  ): Promise<boolean> {
    await Issue.delete(id);
    return true;
  }
}