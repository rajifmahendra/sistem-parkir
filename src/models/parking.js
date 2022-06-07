const { SlotNotFoundError, ParkingLotFullError } = require("../errors");

const { SlotStatus, Slot } = require("./slot");

class ParkingLot {
  /**
   * ParkingLot is a collection of empty parking slots with a maximum `capacity`.
   * @param {integer} capacity - maximum capacity of the parking lot
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.slots = [];
    this.index = {};

    // instantiate empty slots upto `capacity`
    for (let id = 1; id <= this.capacity; id++) {
      // ... create a slot
      const slot = new Slot(id);

      // ... and add it to this parking lot
      this.slots.push(slot);

      // ... and index the slot by ID for faster fetch by ID
      this.index[id] = slot;
    }
  }

  /**
   * Finds a slot with `slotId` in the parking lot
   * @param {integer} slotId
   * @returns {Slot}
   * @throws { SlotNotFoundError } - when no slots with `slotId` is found in the parking lot
   */
  findSlotById(slotId) {
    if (!this.index[slotId]) {
      throw new SlotNotFoundError("Not Found");
    }
    return this.index[slotId];
  }

  /**
   * Finds slots with matching `status`
   * @param {string} string
   * @returns {Slot[]}
   * @throws { SlotNotFoundError } - when no slots with `status` are found in the parking lot
   */
  findByStatus(status) {
    const resultSlots = this.slots.filter((slot) => slot.status === status);

    if (resultSlots.length === 0) {
      throw new SlotNotFoundError("Not Found");
    }

    return resultSlots;
  }

  /**
   * Finds an empty slot, nearest to the entrance.
   * Distance of a slot from entrance is directly proportional/co-related to it's `id`
   * @throws {ParkingLotFullError} - when no vacant slot is found
   * @return {Slot}
   */
  findNearestEmptySlot() {
    // ... #fornow, finding an empty slot is just simply a table scan operation
    // where we loop through all the slots in the parking lot in ascending order
    // of slot id and return the first VACANT slot we find
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];

      // ... return on first vacant slot
      if (slot.status === SlotStatus.VACANT) {
        return slot;
      }
    }

    // ... raise an exception, because no empty slot was found
    throw new ParkingLotFullError("Sorry, parking lot is full");
  }
}

module.exports = {
  ParkingLot,
};
