import { UserInput } from "../resolvers/userInput";

export const validateRegister = (options: UserInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Invalid email'
      }
    ]
  }

  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'Username msut be over 2 characters'
      }
    ]
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'Username cannot include an @'
      }
    ]
  }

  if (options.password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'Password msut be over 3 characters'
      }
    ]
  }

  return null;
};