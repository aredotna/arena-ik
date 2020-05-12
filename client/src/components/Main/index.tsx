import React, { useState } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import useAxios from "axios-hooks";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import client from "apollo/index";
import { Footer } from "components/Footer";
import { useCallback } from "react";

const Container = styled.div`
  padding: 1em;
  min-height: 100vh;
  position: relative;
`;

const Info = styled.div`
  width: 20em;
  margin
`;

const Title = styled.div`
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: bold;
  margin: 0 0 0.5em;
`;

const Description = styled.div`
  font-size: 0.75rem;
  strong {
    font-weight: bold;
  }
  a {
    font-weight: bold;
  }
`;

const Skeletal = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 500px;
  height: 500px;
  border: 1px solid #aaa;

  &:after,
  &:before {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    content: "";
    width: 150%;
    height: 1px;
    background-color: #aaa;
    transform-origin: 0 0;
  }

  &:after {
    transform: rotate(45deg) translate(-50%, -50%);
  }

  &:before {
    transform: rotate(-45deg) translate(-50%, -50%);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div``;

const Input = styled.textarea`
  width: 500px;
  height: 500px;
  border: 1px solid #aaa;
  margin-left: 5em;
  resize: none;
`;

const Button = styled.button.attrs({ type: "submit" })`
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  right: 0;

  border: 0;
  padding: 0.5em 2em;
  flex: 0 0 auto;
  background-color: white;
  border-top: 2px solid black;
  width: 100%;
  font-size: 2em;
  cursor: pointer;
  transition: background-color 0.5s ease, border-color 0.5s ease;
`;

type FormData = {
  content: string;
};

interface MainProps {
  isExhibition?: boolean;
}

const Main: React.FC<MainProps> = ({ isExhibition }) => {
  const [mode, setMode] = useState<"resting" | "saving" | "saved" | "error">(
    "resting"
  );

  const [, addBlock] = useAxios(
    {
      url: "/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { manual: true }
  );

  const [image, setImage] = useState<null | string>(null);

  const onFileChange = useCallback(
    (e) => {
      console.log(
        "e.target.files",
        e.target.files,
        e.target.files[0].secure_url
      );
      setImage(URL.createObjectURL(e.target.files[0]));
    },
    [setImage]
  );

  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    const { content } = data;
    setMode("saving");
    addBlock({
      data: {
        content,
      },
    })
      .then(() => {
        setMode("saved");
      })
      .catch(() => {
        setMode("error");
      });
  };

  const buttonCopy = {
    resting: "Submit",
    saving: "Submitting...",
    error: "Error!",
    saved: "Submitted!",
  }[mode];

  return (
    <ApolloProvider client={client}>
      <Container>
        <Info>
          <Title>Digital Diary</Title>
          <Description>
            <p>
              After weeks in isolation, virtual interactions and disembodied
              relationships have normalized, pushing pre-pandemic technologies
              to their limits. <a href="">The Creative Independent</a>,{" "}
              <a href="">Pioneer Works</a>, and <a href="">Are.na</a> are now
              collaborating to document the tensions of this new [virtual]
              reality through a collective time capsule of sorts, called the
              Digital Self-Help Diary.
            </p>
            <p>
              <strong>
                You are invited to add a diary entry—including one image and one
                accompanying text—documenting your digital life in quarantine.
              </strong>
            </p>
          </Description>
        </Info>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {image && <img src={image} />}
            {!image && <Skeletal />}

            <input type="file" onChange={onFileChange} />
          </div>

          <Inner>
            <Input
              name="content"
              ref={register({ required: true, maxLength: 20 })}
              autoComplete="no"
              value={mode === "saved" ? "" : undefined}
              placeholder={
                {
                  resting: "What are your thoughts?",
                  saving: "Saving...",
                  error: "Error!",
                  saved: "Submitted!",
                }[mode]
              }
            />
          </Inner>

          <Button disabled={mode !== "resting"} type="submit">
            {buttonCopy}
          </Button>
        </Form>
      </Container>
      {!isExhibition && <Footer />}
    </ApolloProvider>
  );
};

export default Main;
