import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

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
            type: 'required',
            message: 'This is required.'
          }
        }
      : 
      !values.password ?
        {
          password: {
            type: 'required',
            message: 'This is required.'
          }
        }
      :
        {}
  };
};

const Register = () => {
  const router = useRouter();
  const { register, handleSubmit, setError, errors } = useForm<FormValues>({
    resolver: resolver,
  });

  const [, reg] = useRegisterMutation();

  const onSubmit = handleSubmit(async (data) => {
    const response = await reg(data);
    if (response.data?.register.errors) {
      const err = response.data.register.errors[0];
      if (err.field == "username")
        setError("username", { message: err.message });
      else
        setError("password", { message: err.message })
    }
    else if (response.data?.register.user) {
      router.push("/");
    }
  }, (err) => {console.log(err)});

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
    
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control id="username" name="username" placeholder="Username" ref={register} />
          {errors?.username && <p>{errors.username.message}</p>}
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" name="password" placeholder="Password" ref={register} />
          {errors?.password && <p>{errors.password.message}</p>}
        </Form.Group>
      
        {/*
        <Input
          name="username"
          placeholder="Username"
          label="Username"
          ref={register}
          errors={errors}
        />

        <Input
          name="password"
          placeholder="Password"
          label="Password"
          ref={register}
          errors={errors}
          type="password"
        />  */}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Wrapper>
  );
}

export default Register;