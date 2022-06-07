// Hard code commands mapping, #fornow
// In future ParkingApp can be refactored to register it's functions to a registry
// Each command has name of the function in ParkingApp class
// and a regex to extract arguments from input
const COMMANDS_REGISTRY = {
  create_parking_lot: {
    name: "createParkingLot",
    argsRegex: /^([0-9]+)$/,
  },
  leave: {
    name: "leave"
  },
  park: {
    name: "park",
    argsRegex: /^(.+[^\s])\s+([\w]+)$/,
  },
  status: {
    name: "status",
  },
};

/**
 * dispatch is a bridge between user input string and the functions in the app
 * This function parses the input to get command and args.
 * It then invokes the function mapped to the command by passing the args
 * @param {ParkingApp} app - Instance of the ParkingApp
 * @param {string} input - User input
 * @returns {{string, string}} - { success, error } Returns response from function invocation or converts any errors to strings
 */
const dispatch = (input, app) => {
  // separate command and arguments
  const [name, ...args] = input.split(" ");

  // put back args as string for args regex
  const argStr = args.join(" ");

  const command = COMMANDS_REGISTRY[name];

  // ... if an app method is not available for a command, return an error
  if (!command) {
    return { error: `${name} is not a supported command.` };
  }

  try {
    // ... return error if the method with name is not implemented in the app
    if (!app[command.name]) {
      return { error: `${command.name} is not implemented in the app.` };
    }

    // ... extract the args using regex
    // ignore first, because its same as the input
    const [, ...args] = command.argsRegex ? command.argsRegex.exec(argStr) : [];

    // ... execute the function by passing args as separate arguments to the function
    const result = app[command.name](...args);

    // ... return result as success
    return { success: result };
  } catch (err) {
    // ... when ParkingApp throws an error, return the error.message
    return {
      error:
        err.message ||
        `The command: ${command} raised an error ${err.toString()}`,
    };
  }
};

module.exports = {
  dispatch,
};
