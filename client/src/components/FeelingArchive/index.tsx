import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { gql } from "apollo-boost";

const Container = styled.div`
  margin: 8em 0;
`;

const HeaderContainer = styled.div`
  margin: 1em 0;
`;

const Header = styled.div`
  font-family: "SometimesTimes";
  font-size: 4em;
  color: white;

  text-transform: uppercase;
  font-weight: bold;

  a {
    text-decoration: none !important;
    color: inherit;
  }
`;

const FEELING_QUERY = gql`
  {
    channel(id: "archive-of-feelings") {
      blokks(type: TEXT) {
        __typename
        ... on Text {
          id
          content(format: MARKDOWN)
        }
      }
    }
  }
`;

interface FeelingArchiveProps {
  isExhibition?: boolean;
}

export const FeelingArchive: React.FC<FeelingArchiveProps> = ({
  isExhibition,
}) => {
  const { loading, error, data } = useQuery(FEELING_QUERY);
  return (
    <Container>
      <HeaderContainer>
        {!isExhibition && (
          <>
            <Header>
              <a href="https://arkdes.se/en/utstallning/asmr-weird-sensation-feels-good/">
                Weird Sensation
                <br />
                Feels Good
              </a>
            </Header>
            <a href="https://arkdes.se/en/utstallning/asmr-weird-sensation-feels-good/">
              <br />
              Find out more about the exhibition
            </a>
          </>
        )}
        {isExhibition && (
          <Header>
            Weird Sensation
            <br />
            Feels Good
          </Header>
        )}
      </HeaderContainer>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{error}</h1>}
      {data &&
        data.channel &&
        data.channel.blokks.map((block: any) => {
          return <h1>{block.content}</h1>;
        })}
    </Container>
  );
};
