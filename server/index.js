const express = require("express");
const sslRedirect = require("heroku-ssl-redirect");
const axios = require("axios");
const { print } = require("graphql");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const enforce = require("express-sslify");

const GET_POLICY = require("./queries/policy");
const CREATE_BLOCK = require("./mutations/createBlock");

const app = express();

const corsOptions = {
  origin: "https://wsfg.are.na",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  app.use(cors(corsOptions));
}

const { X_AUTH_TOKEN, X_APP_TOKEN, CHANNEL_ID } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "../client/build")));

if (process.env.NODE_ENV === "production") {
  app.use(sslRedirect());

  app.use(
    enforce.HTTPS({ trustProtoHeader: true, trustXForwardedHostHeader: true })
  );

  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

app.get("/api/policy", (req, res) => {
  axios({
    url: "https://api.are.na/graphql",
    method: "post",
    headers: {
      "X-AUTH-TOKEN": X_AUTH_TOKEN,
      "X-APP-TOKEN": X_APP_TOKEN,
    },
    data: {
      query: print(GET_POLICY),
    },
  })
    .then((result) => {
      res.json(result.data.data.me.policy);
    })
    .catch((err) => {
      res.send(req.body);
    });
});

app.post("/api/create", (req, res) => {
  axios({
    url: "https://api.are.na/graphql",
    method: "post",
    headers: {
      "X-AUTH-TOKEN": X_AUTH_TOKEN,
      "X-APP-TOKEN": X_APP_TOKEN,
    },
    data: {
      query: print(CREATE_BLOCK),
      variables: {
        input: {
          title: `${new Date().toLocaleDateString()}`,
          channel_ids: [CHANNEL_ID],
          value: req.body.url,
          description: req.body.description,
        },
      },
    },
  })
    .then((result) => {
      res.json(result.data);
    })
    .catch((err) => {
      res.send(req.body);
    });
});

app.get("/exhibition", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Express server is running on port:", port));
