import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import Input from '../components/Input';
import Wrapper from '../components/Wrapper';

export type FormValues = {
  username: string;
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: !values.username ? {} : values,
    errors: !values.username
      ? {
          username: {
            type: 'required',
            message: 'This is required.'
          }
        }
      : {},
  };
};

export default function App() {
  const { register, handleSubmit, errors } = useForm<FormValues>({
    resolver: resolver,
  });
  const onSubmit = handleSubmit((data) => alert(JSON.stringify(data)));

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        {/*}
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control id="username" name="username" placeholder="Username" ref={register} />
          {errors?.username && <p>{errors.username.message}</p>}
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" name="password" placeholder="Password" ref={register} />
        </Form.Group>
        */}

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
        />  

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Wrapper>
  );
}
