import React, { useState } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import useAxios from "axios-hooks";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import wsfgImg from "./assets/WSFG_Title.png";

import client from "apollo/index";

const Container = styled.div`
  max-width: 60em;
  margin: 0 auto;
  text-align: center;
  padding: 0 1em;
`;

const Header = styled.div`
  font-size: 2em;
  margin-bottom: 3em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Textarea = styled.input.attrs({ type: "text", autocomplete: "no" })`
  display: block;
  margin-bottom: 0.5em;
  border: 0;
  font-size: 6em;
`;

const Button = styled.input.attrs({ type: "submit" })`
  font-size: 3em;
  border: 0;
  padding: 0.25em;
`;

type FormData = {
  content: string;
};

const possiblePrompts = [
  "Write one word to describe the feeling that you get when someone whispers in your ear.",
  "Write one word to describe the feeling that you get when someone taps their fingers on a table.",
  "Write one word to describe the feeling that you get when an optician shines a light in your eye.",
  "Write one word to describe the feeling that you get when someone turns the page of a book in a library.",
  "Write one word to describe the feeling that you get when someone applies make-up to their face.",
  "Write one word to describe the feeling that you get when someone concentrates intensely.",
  "Write one word to describe the feeling that you get when someone is wrapping a gift."
];

const prompt =
  possiblePrompts[Math.floor(Math.random() * possiblePrompts.length)];

const App: React.FC = () => {
  const [mode, setMode] = useState<
    "resting" | "details" | "saving" | "saved" | "error"
  >("resting");

  const [, addBlock] = useAxios(
    {
      url: "/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    },
    { manual: true }
  );

  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    const { content } = data;
    setMode("saving");
    addBlock({
      data: {
        content
      }
    })
      .then(() => {
        setMode("saved");
      })
      .catch(() => {
        setMode("error");
      });
  };

  return (
    <ApolloProvider client={client}>
      <Container>
        <img src={wsfgImg} alt="Weird Sensation Feels Good" width="200px" />
        <Header>{prompt}</Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Textarea
            name="content"
            ref={register({ required: true, maxLength: 20 })}
            autoComplete="no"
          />
          <Button
            disabled={mode !== "resting"}
            value={
              {
                resting: "Submit",
                details: "Submit",
                saving: "Submitting...",
                error: "Error!",
                saved: "Submitted!"
              }[mode]
            }
          />
        </Form>
      </Container>
    </ApolloProvider>
  );
};

export default App;
