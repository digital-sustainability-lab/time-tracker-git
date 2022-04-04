require("dotenv").config();
const axios = require("axios").default;
console.log(process.env);
axios
  .get("https://openproject.fdn-tools.inf.unibe.ch/api/v3/work_packages", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`apikey:${process.env.OPENPROJECTAPI}`)}`,
    },
  })
  .then((response) => {
    console.log("Got a response"), console.log(response.data);
  })
  .catch((error) => {
    console.log("Got an error"), console.log(error);
  });
