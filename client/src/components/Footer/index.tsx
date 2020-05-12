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
        Note: Submissions may be anonymous, or credited—choose your preference
        before submitting. Also note that excerpts from select submissions may
        be included in an upcoming collaborative book project, and may be
        edited.
      </Disclaimer>
      <Logos>
        <a href="https://are.na">
          <ArenaLogo />
        </a>
      </Logos>
    </Container>
  );
};
