import React from 'react'
import { Form } from 'react-bootstrap'
import { DeepMap, FieldError } from 'react-hook-form';
import { FormValues } from '../pages/register';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  errors: DeepMap<FormValues, FieldError>;
};

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {

  return (
    <Form.Group>
      <Form.Label htmlFor={props.name}>{props.label}</Form.Label>
      <Form.Control
        name={props.name}
        id={props.name}
        placeholder={props.placeholder}
        ref={ref}
        type={props.type}
      />
      {
        props.name == "username" ? 
          props.errors?.username && <p>{props.errors.username.message}</p>
        :
          props.errors?.password && <p>{props.errors.password.message}</p>
      }
    </Form.Group>
  )
});

export default Input;
