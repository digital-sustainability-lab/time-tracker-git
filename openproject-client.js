require("dotenv").config();
const axios = require("axios").default;

if (
  process.env.OPENPROJECTAPI === undefined ||
  process.env.OPENPROJECTAPI === ""
)
  throw new Error(
    "MISSING OPENPROJECT API" +
      "\n Please provide your Openproject API Key in your env file or your .bashrc" +
      "\n See further information here: " +
      "https://gitlab.ti.bfh.ch/digital-sustainability-lab/devs-no-code/-/blob/master/devs/getting-started/einrichtung-arbeitsplatz.md"
  );

const OPEN_PROJECT_URL = "https://openproject.fdn-tools.inf.unibe.ch/api/v3/";
const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`apikey:${process.env.OPENPROJECTAPI}`)}`,
  },
};

//run();
async function run() {
  await logTime(12, 30);
}

async function logTime(timelog) {
  const project = await getProjectId(timelog.project);
  const firstWp = project.workPackages[0];
  const timeLog = createTimeLog(
    timelog.hours,
    timelog.minutes,
    timelog.description,
    firstWp.id
  );
  return postTimeLog(timeLog);
}

module.exports = {
  logTime,
};

function createTimeLog(hours, minutes, description, id) {
  console.log(id);
  const timeLog = {
    _links: {
      activity: {
        href: "/api/v3/time_entries/activities/1",
        title: "Management",
      },
      self: { href: null },
      workPackage: {
        href: `/api/v3/work_packages/${id}`,
        title: "Time Tracking",
      },
    },
    comment: { raw: description },
    hours: `PT${hours}H${minutes}M`,
    spentOn: "2022-04-05",
  };
  return timeLog;
}

async function getProjectId(identifier) {
  const filters = [
    {
      name_and_identifier: {
        operator: "=",
        values: identifier,
      },
    },
  ];
  const body = (
    await axios.get(
      `${OPEN_PROJECT_URL}projects?filters=${JSON.stringify(filters)}`,
      headers
    )
  ).data;
  // verify that you have exactly one result
  if (body.total !== 1)
    throw new Error(`Expected 1 Project, got ${data.total}`);
  const project = body._embedded.elements[0];
  if (project.identifier !== identifier)
    throw new Error(`Expected ${identifier} got ${project.identifier}`);
  const workPackages = (
    await axios.get(
      `${OPEN_PROJECT_URL}/projects/${project.id}/work_packages`,
      headers
    )
  ).data._embedded.elements;
  project["workPackages"] = workPackages;
  return project;
}

async function postTimeLog(timelog) {
  return axios.post(`${OPEN_PROJECT_URL}time_entries`, timelog, headers);
}
