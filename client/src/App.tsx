import React, { useState } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import useAxios from "axios-hooks";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import client from "apollo/index";
import { FeelingArchive } from "components/FeelingArchive";

const Container = styled.div`
  max-width: 60em;
  margin: 0 auto;
  text-align: center;
  padding: 0 1em;
`;

const Title = styled.div`
  font-family: "SometimesTimes";
  font-size: 4em;
  color: white;
  margin: 1em 0;
  text-transform: uppercase;
  font-weight: bold;
`;

const DefinitionContainer = styled.div`
  display: flex;
`;

const Definition = styled.div`
  font-size: 1.5em;
  padding: 0 1em;
  text-align: left;
`;

const Question = styled.div`
  font-size: 2em;
  font-weight: bold;
  padding: 1em 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Textarea = styled.input.attrs({ type: "text", autocomplete: "no" })`
  display: block;
  margin: 0.5em 0 1.5em;
  border: 0;
  font-size: 4em;
  background: transparent;
  text-align: center;
  outline: none;
  padding: 1em 0;
  flex: 1 1 auto;
  width: 100%;

  border: 2px solid black;
  border-radius: 40em;
  border-top-color: transparent;
  border-bottom-color: transparent;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.input.attrs({ type: "submit" })`
  font-size: 2.5em;
  border: 0;
  padding: 0.5em 2em;
  flex: 0 0 auto;
  border-radius: 20em;
  background-color: transparent;
  border: 2px solid black;
  cursor: pointer;
  transition: background-color 0.5s ease, border-color 0.5s ease;

  &:hover {
    background-color: white;
    border: 2px solid white;
  }
`;

type FormData = {
  content: string;
};

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
        <Title>Weird Sensation Feels Good</Title>
        <DefinitionContainer>
          <Definition>
            <p>
              <strong>Trigger</strong>
            </p>

            <p>
              A sound or action that instils in you an Autonomous Sensory
              Meridian Response (ASMR).
            </p>

            <p>
              Everything has the potential to be a trigger, but there is no such
              thing as an objective trigger.
            </p>
          </Definition>
          <Definition>
            <p>
              <strong>Trigger</strong>
            </p>

            <p>
              Ett ljud eller en handling som inger en ASMR-känsla hos någon
              annan.
            </p>

            <p>
              Allt har potential att vara en trigger, men det finns samtidigt
              inga objektiva triggers.
            </p>
          </Definition>
        </DefinitionContainer>
        <Question>
          Describe an experience that has triggered an ASMR response.
        </Question>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Textarea
            name="content"
            ref={register({ required: true, maxLength: 20 })}
            autoComplete="no"
            placeholder="Type something..."
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
        <FeelingArchive />
      </Container>
    </ApolloProvider>
  );
};

export default App;
