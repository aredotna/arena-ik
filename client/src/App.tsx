import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "apollo/index";
import styled from "styled-components";
import { useForm } from "react-hook-form";

const Container = styled.div`
  width: 40em;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Textarea = styled.div`
  display: block;
`;

type FormData = {
  firstName: string;
  lastName: string;
};

const App: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <ApolloProvider client={client}>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            name="firstName"
            ref={register({ required: true, maxLength: 20 })}
          />
          <input name="lastName" ref={register({ pattern: /^[A-Za-z]+$/i })} />
          <input type="submit" />
        </Form>
      </Container>
    </ApolloProvider>
  );
};

export default App;
