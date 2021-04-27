import { Issue } from '../entities/Issue';
import { Arg, Mutation, Query, Resolver } from 'type-graphql'; 

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
  async createIssue( 
    @Arg('title') title: string
  ): Promise<Issue> {
    return Issue.create({ title }).save();
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