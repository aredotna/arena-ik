import React, { useState, useCallback, ChangeEvent } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import useAxios from "axios-hooks";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import client from "apollo/index";
import { Footer } from "components/Footer";
import { uploadFile } from "lib/uploader";

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

const Container = styled.div`
  padding: 1em;
  min-height: 100vh;
  position: relative;

  @media only screen and (max-width: 900px) {
    padding: 0;
  }
`;

const Info = styled.div`
  width: 20em;
  @media only screen and (max-width: 900px) {
    padding: 1em;
  }
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

const BOX_WIDTH = "48vh";
const MOBILE_BOX_WIDTH = "80vw";

const Skeletal = styled.div<{ hasImage: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: ${BOX_WIDTH};
  height: ${BOX_WIDTH};
  border: 1px solid #aaa;

  @media only screen and (max-width: 900px) {
    width: ${MOBILE_BOX_WIDTH};
    height: ${MOBILE_BOX_WIDTH};
  }

  ${(props) =>
    props.hasImage &&
    `
    border: none;
    background-color: white;
  `}

  > img {
    max-width: ${BOX_WIDTH};
    max-height: ${BOX_WIDTH};
    transform-origin: 0 0;
    z-index: 100;

    @media only screen and (max-width: 900px) {
      max-width: ${MOBILE_BOX_WIDTH};
      max-height: ${MOBILE_BOX_WIDTH};
    }
  }

  ${(props) =>
    !props.hasImage &&
    `
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
  `}
`;

const FileInput = styled.input.attrs({ type: "file", accept: "image/*" })`
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
    position: relative;

    height: auto;
    padding-bottom: 10em;
  }
`;

const Left = styled.div`
  margin-top: 3em;
  display: flex;
  flex-direction: column-reverse;
`;

const Right = styled(Left)`
  margin-left: 5em;

  @media only screen and (max-width: 900px) {
    margin-left: 0;
  }
`;

const Input = styled.textarea`
  width: ${BOX_WIDTH};
  height: ${BOX_WIDTH};

  @media only screen and (max-width: 900px) {
    width: ${MOBILE_BOX_WIDTH};
    height: ${MOBILE_BOX_WIDTH};
  }

  border: 1px solid #aaa;

  resize: none;
  padding: 1em;
  font-size: 14px;
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

  ${(props) =>
    props.disabled &&
    `
      border-top: 2px solid #ddd;
      color: #ddd;
  `}
`;

type FormData = {
  description: string;
};

interface MainProps {
  isExhibition?: boolean;
}

const Main: React.FC<MainProps> = ({ isExhibition }) => {
  const [mode, setMode] = useState<"resting" | "saving" | "saved" | "error">(
    "resting"
  );

  const [{ data: policy, loading, error }] = useAxios("/api/policy");
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

  const [image, setImage] = useState<null | { url: string; file: File }>(null);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event && event.target && event.target.files) {
        const file = event.target.files[0];
        setImage({ url: URL.createObjectURL(file), file: file });
      }
    },
    [setImage]
  );

  const { register, handleSubmit } = useForm<FormData>();
  const uploadAndSave = (data: FormData) => {
    console.log("policy");
    if (!policy || !image) {
      console.log("image", image, policy);
      return;
    }

    const { description } = data;

    setMode("saving");

    uploadFile({
      blob: image.file,
      policy,
      onDone: (url?: string | null | undefined) => {
        console.log("onDone", { url, description });
        addBlock({
          data: {
            url,
            description,
          },
        }).then(() => {
          setMode("saved");
        });
      },
      onFileProgress: () => {
        console.log("onFileProgress");
      },
    });
  };

  const buttonCopy = {
    resting: "Submit",
    saving: "Submitting...",
    error: "Error!",
    saved: "Submitted!",
  }[mode];

  if (loading) {
    return (
      <Container>
        <h2>Loading...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h2>Error: {error.message}</h2>
      </Container>
    );
  }

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
        <Form onSubmit={handleSubmit(uploadAndSave)}>
          <Left>
            <Skeletal hasImage={!!image}>
              {image && <img src={image.url} />}
              <FileInput onChange={onFileChange} />
            </Skeletal>

            <h3>Upload your image</h3>
          </Left>

          <Right>
            <Input
              name="description"
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

            <h3>Type your entry</h3>
          </Right>

          <Button disabled={mode !== "resting" || !image} type="submit">
            {buttonCopy}
          </Button>
        </Form>
      </Container>
      {!isExhibition && <Footer />}
    </ApolloProvider>
  );
};

export default Main;
