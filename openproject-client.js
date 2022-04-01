const axios = require("axios").default;

axios
  .get("google.ch")
  .then((response) => console.log)
  .catch((error) => console.log);
