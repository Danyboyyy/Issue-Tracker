import { User } from '../entities/User';
import { MyContext } from '../types';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'; 
import argon2 from 'argon2';
import { COOKIE_NAME } from '../constants';
import { validateRegister } from '../utils/validateRegister';
import { UserInput } from './userInput';

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
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User,{ id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserInput,
    @Ctx() { req, em } : MyContext
  ): Promise<UserResponse> {
    
    const errors = validateRegister(options);
    
    if (errors)
      return { errors };

    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, { 
      username: options.username,
      password: hashedPassword,
      email: options.email
    });
    try {
      await em.persistAndFlush(user)
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
    @Ctx() { em, req } : MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes('@') 
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
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