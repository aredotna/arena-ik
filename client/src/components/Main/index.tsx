import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import styled from "styled-components";
import useAxios from "axios-hooks";

import client from "apollo/index";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FixedLogo = styled.img.attrs({
  src: "ik-chess-camp-black.png",
})`
  position: fixed;
  top: 1em;
  left: 1em;
  width: 20vw;

  @media only screen and (max-width: 900px) {
    position: static;
    padding: 3em 1em;
    width: 80%;
    margin: 0 auto;
  }
`;

const Content = styled.div`
  width: 100vw;
  padding-left: 22vw;
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
  font-size: 1.25em;
  line-height: 1.25em;
  display: flex;

  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const Products = styled.div`
  flex: 1;
  margin-top: 4em;
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

const Product = styled.div`
  img {
    max-width: 100%;
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
                <strong>
                  Juneteenth asks us to consider the promises of freedom not yet
                  fully realized.
                </strong>
              </p>
            </TwoThirds>
            <OneThird>
              <p>
                For Juneteeth 2020, <a href="">Internal Knowledge</a> and{" "}
                <a href="">Are.na</a> present Chess Camp – a partnership
                exploring <strong>strategy</strong>, <strong>empathy</strong>,{" "}
                <strong>psychological freedom</strong> and{" "}
                <strong>Black history</strong>.
              </p>
              <p>
                100% of the proceeds will be donated to the{" "}
                <a href="">NAACP legal defense fund</a> and <a href="">BEAM</a>,
                an organization dedicated to the emotional/mental health and
                healing of Black communities.
              </p>
            </OneThird>
          </Description>
          <Products>
            <OneThird>
              <ProductP>
                Twelve vintage shirts with custom embroidery are for sale. Each
                shirt comes with a wooden chess USB drive, containing resources,
                ephemera, videos, images, links and essays.
              </ProductP>
              {products &&
                products.map((product: any) => {
                  return (
                    <Product>
                      <img src={product.node.featuredImage.transformedSrc} />
                    </Product>
                  );
                })}
            </OneThird>
            <OneThird>
              <ProductP>
                In addition to the limited edition vintage shirts, a
                silkscreened commemorative t-shirt is also available.
              </ProductP>
            </OneThird>
            <OneThird>
              <ProductP>
                These archives are also available on this page for free, in four
                separate volumes.
              </ProductP>
              <Product>
                <img src="https://d2w9rnfcy7mm78.cloudfront.net/7693658/original_ddf3923c0b6524c57eb37ca1fcd40e66.png?1592350125?bc=0" />
              </Product>
            </OneThird>
          </Products>
        </Content>
      </Container>
    </ApolloProvider>
  );
};

export default Main;
