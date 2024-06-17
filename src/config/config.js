const Cookies = require("js-cookie");

let envConfig;

if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line global-require
  envConfig = require("./env/production");
} else {
  // eslint-disable-next-line global-require
  envConfig = require("./env/development");
}

const config = {
  ...envConfig,
  isInMockMode: process.env.REACT_APP_IN_MOCK_MODE || Cookies.get("e2eTest"),
  pactBroker: "https://docker-sandbox.server.cluster:9292/",
};

module.exports = config;
