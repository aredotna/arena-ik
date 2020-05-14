import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  padding: 1em 1em;
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

  img {
    margin-right: 0.5em;
  }
`;

const ArenaLogo = styled.img.attrs({
  src: "arena-logo.png",
  height: "45px",
})``;

const PWLogo = styled.img.attrs({
  src: "PW_Logo.png",
  height: "15px",
})``;

const TCILogo = styled.img.attrs({
  src: "logo-spiral.png",
  height: "35px",
})`
  margin-right: 0px !important;
`;

export const Footer: React.FC = () => {
  return (
    <Container>
      <Logos>
        <a href="https://pioneerworks.org">
          <PWLogo />
        </a>
        <a href="https://thecreativeindependent.com">
          <TCILogo />
        </a>
        <a href="https://are.na">
          <ArenaLogo />
        </a>
      </Logos>
    </Container>
  );
};
