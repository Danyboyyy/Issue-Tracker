import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { Form, Button } from 'react-bootstrap';
import { useForm, Resolver } from 'react-hook-form';
import Layout from '../components/Layout';
import { useCreateIssueMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsLoggedIn } from '../utils/useIsLoggedIn';

export type FormValues = {
  title: string;
  description: string;
  category: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: !values.title || !values.description || !values.category ? {} : values,
    errors: 
      !values.title ?
        {
          title: {
            type: 'required',
            message: "This is required"
          }
        }
      : 
      !values.description ?
        {
          description: {
            type: 'required',
            message: "This is required"
          }
        }
      :
      !values.category ?
        {
          category: {
            type: 'required',
            message: "This is required"
          }
        }
      :
        {}
  };
};  

const CreatePost = () => {
  const router = useRouter();

  useIsLoggedIn();

  const [,createIssue] = useCreateIssueMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: resolver,
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const { error } = await createIssue({input: data});
    if (error?.message.includes("need to be logged in"))
      router.replace('/login');
    else
      router.push('/');
  }, (err) => {console.log(err)});

  return(
    <Layout>
      <h3>Create Issue</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control id="title" name="title" placeholder="Title" ref={register} />
          {errors?.title && <p>{errors.title.message}</p>}
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control id="description" name="description" placeholder="Description" ref={register} as="textarea" rows={3} />
          {errors?.description && <p>{errors.description.message}</p>}
        </Form.Group>

        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control id="category" name="category" placeholder="Category" ref={register} />
          {errors?.category && <p>{errors.category.message}</p>}
        </Form.Group>
    
        <Button variant="primary" type="submit" className="btn btn-dark btn-lg btn-block">
          Create Issue
        </Button>
      </Form>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost);