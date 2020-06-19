import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import styled from "styled-components";
import useAxios from "axios-hooks";

import client from "apollo/index";
import { ChannelThumb } from "components/ChannelThumb";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FixedLogo = styled.img.attrs({
  src: "ik-chess-camp-black.png",
})`
  position: fixed;
  left: 1.5em;
  width: 14vw;
  top: 1.75em;

  @media only screen and (max-width: 900px) {
    position: static;
    padding: 3em 1em;
    width: 80%;
    margin: 0 auto;
  }
`;

const Content = styled.div`
  width: 100vw;
  padding-left: 15vw;
  position: relative;

  @media only screen and (max-width: 900px) {
    padding-left: 0;
  }
`;

const TwoThirds = styled.div`
  width: 66%;
  padding: 0 1em;

  @media only screen and (max-width: 900px) {
    width: 100%;
    flex: 1;
  }
`;

const OneThird = styled.div`
  width: 33%;
  padding: 0 1em;

  @media only screen and (max-width: 900px) {
    width: 100%;
    flex: 1;
  }
`;

const Description = styled.div`
  font-size: 1.2em;
  line-height: 1.25em;
  display: flex;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const BigText = styled.div`
  font-size: 2.3rem;
  line-height: 1.17em;
`;

const Products = styled.div`
  flex: 1;
  margin-top: 7em;
  display: flex;
  width: 100%;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const ProductP = styled.p`
  height: 6em;

  @media only screen and (max-width: 900px) {
    padding: 3em 0;
  }
`;

const Product = styled.a<{ soldOut?: boolean }>`
  display: block;
  position: relative;

  img {
    max-width: 100%;
  }

  div {
    display: none;
  }

  ${(props) => {
    if (props.soldOut) {
      return `
        &:hover div {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.1);
          color: white;
          font-size: 22px;
          font-weight: bold;
        }
      `;
    }
  }}
`;

const PreorderProduct = styled(Product)`
  img:last-child {
    display: none;
  }

  &:hover img:first-child {
    display: none;
  }

  &:hover img:last-child {
    display: block;
  }
`;

const Main: React.FC = () => {
  const [{ data, loading, error }] = useAxios("/api/vintage-shirts");

  const products =
    !loading &&
    !error &&
    data.products &&
    (data.products.edges as Array<any>).length > 0 &&
    (data.products.edges as Array<any>);

  const [
    { data: shirtData, loading: shirtLoading, error: shirtError },
  ] = useAxios("/api/preorder-shirt");

  const shirtProducts =
    !shirtLoading &&
    !shirtError &&
    shirtData.products &&
    (shirtData.products.edges as Array<any>).length > 0 &&
    (shirtData.products.edges as Array<any>);

  return (
    <ApolloProvider client={client}>
      <Container>
        <FixedLogo />
        <Content>
          <Description>
            <TwoThirds>
              <p>
                Juneteenth (also known as Jubilee Day) is the oldest known
                celebration honoring the end of slavery in the United States. It
                commemorates June 19th, 1865 when Union General Gordon Granger
                traveled to Galveston, Texas to bring the news that the Civil
                War had ended, and all enslaved people were free.
              </p>

              <p>
                While the 13th Amendment formally abolished slavery in the
                United States in January of 1865, June 19th marked the date that
                the news of freedom arrived, nearly seven months later.
              </p>

              <p>
                <BigText>
                  Juneteenth asks us to consider the promises of freedom not yet
                  fully realized.
                </BigText>
              </p>
            </TwoThirds>
            <OneThird>
              <p>
                For Juneteeth 2020,{" "}
                <a href="https://intrnlknwldg.com">Internal Knowledge</a> and{" "}
                <a href="https://www.are.na">Are.na</a> present Chess Camp – a
                partnership exploring <strong>strategy</strong>,{" "}
                <strong>empathy</strong>, <strong>psychological freedom</strong>{" "}
                and <strong>Black history</strong>.
              </p>
              <p>
                100% of the proceeds will be donated to the{" "}
                <a href="https://www.naacpldf.org">NAACP legal defense fund</a>{" "}
                and <a href="https://www.beam.community">BEAM</a>, an
                organization dedicated to the emotional/mental health and
                healing of Black communities.
              </p>
            </OneThird>
          </Description>
          <Products>
            <OneThird>
              <ProductP>
                Twelve vintage shirts with custom embroidery are for sale. Each
                shirt comes with a wooden chess USB drive, containing an{" "}
                <a href="https://www.are.na/internal-knowledge-are-na">
                  archive
                </a>{" "}
                of resources, ephemera, videos, images, links and essays.
              </ProductP>
              {products &&
                products.map((product: any) => {
                  const soldOut = product.node.totalInventory < 1;
                  return (
                    <Product
                      soldOut={soldOut}
                      href={product.node.onlineStoreUrl}
                    >
                      <img src={product.node.featuredImage.transformedSrc} />
                      <div>Sold Out</div>
                    </Product>
                  );
                })}
            </OneThird>
            <OneThird>
              <ProductP>
                In addition to the limited edition vintage shirts, a
                silkscreened commemorative t-shirt is also available for
                pre-order.
              </ProductP>
              {shirtProducts &&
                shirtProducts.map((product: any) => {
                  const imgOne =
                    product.node.images.edges[0].node.transformedSrc;
                  const imgTwo =
                    product.node.images.edges[1].node.transformedSrc;
                  return (
                    <PreorderProduct href={product.node.onlineStoreUrl}>
                      <img src={imgOne} />
                      <img src={imgTwo} />
                    </PreorderProduct>
                  );
                })}
            </OneThird>
            <OneThird>
              <ProductP>
                These{" "}
                <a href="https://www.are.na/internal-knowledge-are-na">
                  archives
                </a>{" "}
                are also available here for free, in four separate volumes.
              </ProductP>
              <Product>
                <ChannelThumb id="chess-camp-vol-1" />
                <ChannelThumb id="chess-camp-vol-2" />
                <ChannelThumb id="chess-camp-vol-3" direction="DESC" />
                <ChannelThumb id="chess-camp-vol-4" />
              </Product>
            </OneThird>
          </Products>
        </Content>
      </Container>
    </ApolloProvider>
  );
};

export default Main;
