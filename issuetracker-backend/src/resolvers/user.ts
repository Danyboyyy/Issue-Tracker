import { User } from '../entities/User';
import { MyContext } from '../types';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'; 
import argon2 from 'argon2';
import { COOKIE_NAME } from '../constants';
import { validateRegister } from '../utils/validateRegister';
import { UserInput } from './userInput';
import { getConnection } from 'typeorm'

@ObjectType()
class FieldError {
  @Field()
  field: string;
  
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId)
      return null;

    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserInput,
    @Ctx() { req } : MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors)
      return { errors };

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword
        })
        .returning('*')
        .execute();
        user = result.raw[0];
    }
    catch(err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'Username is already taken'
            }
          ]
        }
      }
    }

    req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req } : MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@') 
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'Username or password are incorrect'
          }
        ]
      }
    }


    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field:'password',
            message: 'Username or password are incorrect'
          }
        ]
      }
    }

    req.session.userId = user.id;
 
    return {
      user
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => req.session.destroy(err => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }

      res.clearCookie(COOKIE_NAME);
      resolve(true);
    }))
  }
}