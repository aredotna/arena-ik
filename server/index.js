const express = require("express");
const sslRedirect = require("heroku-ssl-redirect");
const axios = require("axios");
const { print } = require("graphql");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const enforce = require("express-sslify");

const GET_VINTAGE_SHIRTS = require("./queries/vintageShirts");
const GET_PREORDER_SHIRT = require("./queries/preorderShirt");

const app = express();

const corsOptions = {
  origin: "https://chessclub.are.na",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  app.use(cors(corsOptions));
}

const { X_SHOPIFY_ACCESS_TOKEN } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));

if (process.env.NODE_ENV === "production") {
  app.use(sslRedirect());

  app.use(cors(corsOptions));

  app.use(
    enforce.HTTPS({ trustProtoHeader: true, trustXForwardedHostHeader: true })
  );

  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/api/vintage-shirts", (req, res) => {
  axios({
    url: "https://aredotna.myshopify.com/admin/api/2020-04/graphql.json",
    method: "post",
    headers: {
      "X-Shopify-Access-Token": X_SHOPIFY_ACCESS_TOKEN,
    },
    data: {
      query: print(GET_VINTAGE_SHIRTS),
    },
  })
    .then((result) => {
      res.json(result.data.data);
    })
    .catch((err) => {
      res.send(req.body);
    });
});

app.get("/api/preorder-shirt", (req, res) => {
  axios({
    url: "https://aredotna.myshopify.com/admin/api/2020-04/graphql.json",
    method: "post",
    headers: {
      "X-Shopify-Access-Token": X_SHOPIFY_ACCESS_TOKEN,
    },
    data: {
      query: print(GET_PREORDER_SHIRT),
    },
  })
    .then((result) => {
      res.json(result.data.data);
    })
    .catch((err) => {
      res.send(req.body);
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Express server is running on port:", port));
