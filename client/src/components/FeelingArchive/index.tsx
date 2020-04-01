import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { gql } from "apollo-boost";

const Container = styled.div`
  margin: 8em 0;
`;

const Header = styled.div`
  font-family: "SometimesTimes";
  font-size: 4em;
  color: white;
  margin: 1em 0;
  text-transform: uppercase;
  font-weight: bold;
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

export const FeelingArchive: React.FC = () => {
  const { loading, error, data } = useQuery(FEELING_QUERY);
  return (
    <Container>
      <Header>Weird Sensation Feels Good</Header>
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
