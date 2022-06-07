const fs = require("fs");
const path = require("path");
const readline = require("readline");

const { dispatch } = require("./src/app/dispatcher");
const { ParkingApp } = require("./src/app/parking");

/**
 * Runs the script in file mode when a filepath  passed as first argument
 * Runs the scriot in interactive mode when no arguments are passed
 * @param {string[]} args - list of command line arguments passed to this script
 */
const run = (args) => {
  // execute in file mode
  if (args.length > 0) {
    // resolve to an absolute path
    const filepath = path.resolve(args[0]);

    // check if the filepath is not a null value
    if (!filepath) {
      process.stdout.write(
        "File path must be a path to a valid commands file.\n"
      );
      return;
    }

    // ... check if the file is readable by this process
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
    } catch (accesErr) {
      process.stdout.write(
        `File path: ${filepath} must be readable by the current user & process\n`
      );
      return;
    }

    // ... instantiate a ParkingApp that will execute the commands from the file
    const app = new ParkingApp();

    // ... read lines from the line and execute them via ParkingApp
    const reader = readline.createInterface({
      input: fs.createReadStream(filepath),
    });

    reader.on("line", (line) => {
      const { success, error } = dispatch(line, app);
      process.stdout.write(success || error);
      process.stdout.write("\n");
    });
  } else {
    // execute in interactive shell model

    // ... instantiate a ParkingApp that will execute the commands from the file
    const app = new ParkingApp();

    // ... read lines from the line and execute them via ParkingApp
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    process.stdout.write("\n$ ");

    reader.on("line", (line) => {
      if (line && line === "exit") {
        process.exit();
      }
      const { success, error } = dispatch(line, app);
      process.stdout.write(success || error);
      process.stdout.write("\n$ ");
    });
  }
};

// get the arguments passed to app.
// ignore the first two. first is path to node binary,
// second is the path to this file
const [, , ...args] = process.argv;

// start the script
run(args);
