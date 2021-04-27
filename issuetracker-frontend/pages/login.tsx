import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

export type FormValues = {
  username: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: !values.username || !values.password ? {} : values,
    errors: 
      !values.username ?
        {
          username: {
            type: 'required'
          }
        }
      : 
      !values.password ?
        {
          password: {
            type: 'required'
          }
        }
      :
        {}
  };
};

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit, setError, errors } = useForm<FormValues>({
    resolver: resolver,
  });

  const [, login] = useLoginMutation();

  const onSubmit = handleSubmit(async (data) => {
    const response = await login(data);
    if (response.data?.login.errors) {
      const err = response.data.login.errors[0];
      if (err.field == "username")
        setError("username", { message: err.message });
      else
        setError("password", { message: err.message })
    }
    else if (response.data?.login.user) {
      router.push("/");
    }
  }, (err) => {console.log(err)});

  return (
    <Wrapper>
      <h3>Login</h3>
      <Form onSubmit={onSubmit}>
       {errors?.username && <p>{errors.username.message}</p>}
       {errors?.password && <p>{errors.password.message}</p>}
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control id="username" name="username" placeholder="Username" ref={register} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" name="password" placeholder="Password" ref={register} />
        </Form.Group>
    
        <Button variant="primary" type="submit" className="btn btn-dark btn-lg btn-block">
          Submit
        </Button>
      </Form>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login);