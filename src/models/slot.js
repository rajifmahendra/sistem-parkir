const { SlotNotVacantError } = require("../errors");

const SlotStatus = {
  VACANT: "vacant",
  PARKED: "parked",
};

class Slot {
  /**
   * Slot represents a physical parking space for a car.
   * @param {integer} id - Unique ID of the slot.
   */
  constructor(id) {
    this.id = id;
    this.status = SlotStatus.VACANT;
    this.registration = null;
    this.colour = null;
  }

  /**
   * Assigns the slot to car, by saving the registration & colour of the car.
   * This function does not validate the values of registration & colour parameters
   * @param {string} registration
   * @param {string} colour
   * @throws {SlotNotVacantError} - when someone tries to assign an occupied slot
   * @returns {integer} ID of this slot
   */
  assign({ registration, colour }) {
    // check and raise an error, if the slot is already occupied
    if (this.status != SlotStatus.VACANT) {
      throw new SlotNotVacantError(
        this.id,
        "This slot has parked car. It cannot be assigned to new car"
      );
    }

    //  ... save the data to the slot
    this.registration = registration;
    this.colour = colour;

    // ... and mark the slot as parked
    this.status = SlotStatus.PARKED;

    return this.id;
  }

  /**
   * Deletes the data of the parked car and sets the status to VACANT.
   * This slot will then be available to be assigned to someone else.
   * Calling leave on an existing empty slot will have no affect on slot data.
   * @returns {integer} ID of this slot
   */
  leave() {
    // set the fields to null, to clear data
    this.registration = null;
    this.colour = null;

    // ... update the status to VACANT
    this.status = SlotStatus.VACANT;

    return this.id;
  }

  /**
   * Instantiates a new slot and copies the data in this slot.
   * Mostly, used in tests
   * @returns {Slot}
   */
  clone() {
    const newSlot = new Slot(this.id);
    newSlot.registration = this.registration;
    newSlot.colour = this.colour;
    newSlot.status = this.status;
    return newSlot;
  }
}

module.exports = { Slot, SlotStatus };
