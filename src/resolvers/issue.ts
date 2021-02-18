import { Issue } from '../entities/Issue';
import { MyContext } from '../types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'; 

@Resolver()
export class IssueResolver {
  @Query(() => [Issue])
  issues(
    @Ctx() { em }: MyContext
  ): Promise<Issue[]> {
    return em.find(Issue, {});
  }

  @Query(() => Issue, { nullable: true })
  issue( 
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Issue | null> {
    return em.findOne(Issue, { id });
  }

  @Mutation(() => Issue)
  async createIssue( 
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Issue> {
    const issue = em.create(Issue, { title })
    await em.persistAndFlush(issue);
    return issue;
  }

  @Mutation(() => Issue)
  async updateIssue( 
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Issue | null> {
    const issue = await em.findOne(Issue, { id });
    if (!issue) {
      return null;
    }
    if (typeof title !== undefined) {
      issue.title = title;
      await em.persistAndFlush(issue)
    }
    return issue;
  }

  @Mutation(() => Boolean)
  async deleteIssue( 
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Issue, { id });
    return true;
  }
}