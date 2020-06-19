import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 5em;
  a {
    color: black;
    text-decoration: none;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  vertical-align: middle;
  line-height: 18px;
  padding-bottom: 0.5em;
`;

const Blocks = styled.div`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
`;

const BlockContainer = styled.div`
  flex: 0 0 33%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 0.5rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    display: table;
    padding-top: 100%;
  }
`;

const Block = styled.div<{ img?: string }>`
  flex-grow: 1;
  border: 1px solid #eee;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.img &&
    `
    background-image: url(${props.img});
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    align-items: center;
    justify-content: center;
  `}
`;

const BlockContent = styled.div`
  font-size: 0.75vw;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  padding: 0.5em;

  p:first-child {
    margin-top: 0;
  }

  blockquote {
    margin: 0;
    padding: 0;
  }
`;

const CHANNEL_QUERY = gql`
  query ChannelThumbQuery($id: ID!, $direction: Directions) {
    channel(id: $id) {
      href(absolute: true)
      title
      blokks(per: 9, sort_by: POSITION, direction: $direction) {
        __typename
        ... on Model {
          id
        }
        ... on Text {
          content(format: HTML, no_links: true)
        }

        ... on Image {
          image_url
        }

        ... on Link {
          image_url
        }

        ... on Embed {
          image_url
        }

        ... on Attachment {
          image_url
        }
      }
    }
  }
`;

interface ChannelThumbProps {
  id: number | string;
  direction?: "ASC" | "DESC";
}

export const ChannelThumb: React.FC<ChannelThumbProps> = ({
  id,
  direction = "ASC",
}) => {
  const { loading, error, data } = useQuery(CHANNEL_QUERY, {
    variables: { id, direction },
  });

  if (loading || error || !data) {
    return null;
  }

  const {
    channel,
    channel: { blokks },
  } = data;

  return (
    <Container>
      <a href={channel.href} target="_blank" rel="noopener noreferrer">
        <Title>{channel.title}</Title>
        <Blocks>
          {(blokks as Array<any>).map((block) => {
            return (
              <BlockContainer>
                <Block img={block.image_url}>
                  <BlockContent
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </Block>
              </BlockContainer>
            );
          })}
        </Blocks>
      </a>
    </Container>
  );
};
