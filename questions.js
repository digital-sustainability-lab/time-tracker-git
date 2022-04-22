const readline = require("readline");
const { logTime } = require("./openproject-client");
run();

async function run() {
  const log = {
    project: __dirname.split("/").pop(),
  };
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  async function askForTimeSpend() {
    // Ask for the time
    return new Promise((resolve) =>
      rl.question(
        "How many time did you spend on this commit.\n Please enter in format: \n hours minutes: ",
        (answer) => {
          try {
            const [hourString, minuteString] = answer.split(" ");
            const hour = Number.parseFloat(hourString);
            const minutes = Number.parseFloat(minuteString);
            // Do some validation
            if (Number.isNaN(hour) || Number.isNaN(minutes))
              throw new Error("Invalid Format for hour or minute");
            console.log(
              `You have spend ${hour} hours and ${minutes} minutes on this commit`
            );
            log["hours"] = hour;
            log["minutes"] = minutes;
          } catch (error) {
            console.log(
              "Please enter a hours and minutes in numbers Ex: 2 30 -> For 2 hours and 30 minutes"
            );
          }
          resolve();
        }
      )
    );
  }
  async function askForDescription() {
    return new Promise((resolve) => {
      rl.question(
        "Please describe what you have done in a few words (unrelated to commit msg)",
        (answer) => {
          log["description"] = answer;
          resolve();
        }
      );
    });
  }
  // If valid finish, Otherwise ask again
  let i = 0;
  while (log.hours === undefined || log.minutes === undefined) {
    if (i >= 5) throw new Error("Exceeded tries");
    await askForTimeSpend();
    i++;
  }
  await askForDescription();
  rl.close();
  await submitData(log);
  console.log(JSON.stringify(log));
  console.log("\nThank you for your informations");
  async function createWpList() {
    // Get all Work packages for this projekt
    // List the work packages
  }

  async function submitData() {
    // Submit Data to Openproject
    const timelog = await logTime(log);
    console.log(timelog);
    return;
  }
}
module.exports = run;
