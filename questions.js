const readline = require("readline");

run();

async function run() {
  const log = {};
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
          const [hour, minutes] = answer.split(" ");
          console.log(
            `You have spend ${hour} hours and ${minutes} minutes on this commit`
          );
          log["hours"] = hour;
          log["minutes"] = minutes;
          resolve();
        }
      )
    );
    // Do some validation
    // If valid finish, Otherwise ask again
  }

  await askForTimeSpend();
  rl.close();
  console.log(JSON.stringify(log));
  async function createWpList() {
    // Get all Work packages for this projekt
    // List the work packages
  }

  async function submitData() {
    // Submit Data to Openproject
  }
}
