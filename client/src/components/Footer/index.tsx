import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  padding: 1em 2em;
  box-shadow: inset 0 10px 15px -10px #777;
  display: flex;
  align-items: center;
`;

const Logos = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  line-height: 1;
`;

const ArkdesLogo = styled.img.attrs({
  src: "arkdes-logo.png",
  height: "15px",
})`
  margin-right: 0.75em;
`;

const ArenaLogo = styled.img.attrs({
  src: "arena-logo.png",
  height: "45px",
})``;

const Disclaimer = styled.div`
  flex: 1;
  font-size: 1em;
  font-style: italic;
`;

export const Footer: React.FC = () => {
  return (
    <Container>
      <Disclaimer>
        All responses collected are anonymous. Responses will be made public on
        this page and{" "}
        <a href="https://www.are.na/arkdes-stockholm/archive-of-feelings">
          this
        </a>{" "}
        Are.na channel.
      </Disclaimer>
      <Logos>
        <a href="https://arkdes.se/">
          <ArkdesLogo />
        </a>
        <a href="https://are.na">
          <ArenaLogo />
        </a>
      </Logos>
    </Container>
  );
};
