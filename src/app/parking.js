const { BadDataError } = require("../errors");

const { ParkingLot } = require("../models/parking");
const { SlotStatus } = require("../models/slot");
const { SlotNotFoundError } = require("../errors");
const { isNumber } = require("../utils");

/**
 * TicketCounter is the app/service that manages a parking lot.
 * Assumptions:
 * One ticket counter can manage one parking lot
 * And one parking lot has only one ticket counter
 */
class ParkingApp {
  /**
   * Creates an empty reference for a parking lot
   */
  constructor() {
    this.parkingLot = null;
  }

  /**
   * Creates a new parking lot with `capacity`.
   * @param {integer} capacity
   * @returns {string} - success message
   * @throws {BadDataError} - when this function is invoked when a parking is already instantiated
   */
  createParkingLot(capacityArg) {
    if (!isNumber(capacityArg)) {
      throw new BadDataError(
        "Capacity must be a valid integer between 1 and N"
      );
    }

    const capacity = Number.parseInt(capacityArg);

    if (!capacity || capacity < 1) {
      throw new BadDataError(
        `Capacity value > 0, must be provided to create a parking lot`
      );
    }

    if (this.parkingLot) {
      throw new BadDataError(
        "A parking lot has already been created for this app. " +
          "Only one parking lot can be used at one time. " +
          "Call reset to reset this app"
      );
    }

    this.parkingLot = new ParkingLot(capacity);

    return `Created a parking lot with ${capacity} slots`;
  }

  /**
   * Assigns an empty slot, if available, to park a car
   * @param {string} registration
   * @param {string} colour
   * @returns {string} - success message
   * @throws {BadDataError | ParkingLotFullError}
   */
  park(registration, colour) {
    if (!registration || !colour) {
      throw new BadDataError(
        "Both registration & colour values are required to park a car"
      );
    }

    if (!this.parkingLot) {
      throw new BadDataError(
        "Parking lot has not been initialized. Call create_parking_lot command to initialize a parking lot"
      );
    }

    // ... assume that registration numbers are unique for every car
    // so, check if car with same registration was already parked
    // if there's a car with same registration, it's an edge case
    // that might have caused by same car trying to get a token more than once
    // or two cars have same registration but different colours

    // TODO: Implement uniqueness of registration id

    const slot = this.parkingLot.findNearestEmptySlot();

    slot.assign({ registration, colour });

    return `Allocated slot number: ${slot.id}`;
  }

  /**
   * Returns a formatted table with status of all slots in the parking lot
   * @returns {string} - status table
   */

  status() {
    if (!this.parkingLot) {
      throw new BadDataError(
        "Parking lot has not been initialized. Call create_parking_lot command to initialize a parking lot"
      );
    }

    let statusTable = "Slot No.    Registration No    Colour\n";

    try {
      const parkedSlots = this.parkingLot.findByStatus(SlotStatus.PARKED);

      // ... construct the columns of each row
      // no. of spaces is picked up from the functional specs code.
      parkedSlots.map((slot) => {
        statusTable += `${slot.id}${" ".repeat(11)}`;
        statusTable += `${slot.registration}${" ".repeat(6)}`;
        statusTable += `${slot.colour}\n`;
      });

      return statusTable.trim();
    } catch (err) {
      if (err instanceof SlotNotFoundError) {
        // ... catch the error and just return the header,
        // indicating no parked cars are available
        return statusTable;
      } else {
        // ... forward all other errors
        throw err;
      }
    }
  }

  /**
   * Resets the app by setting the parking lot to null
   */
  reset() {
    this.parkingLot = null;
  }
}

module.exports = {
  ParkingApp,
};
