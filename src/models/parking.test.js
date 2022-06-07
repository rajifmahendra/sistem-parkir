const assert = require("chai").assert;

const { ParkingLot } = require("./parking");
const { SlotStatus } = require("./slot");

const { ParkingLotFullError, SlotNotFoundError } = require("../../src/errors");

/**
 * Test utility methods to pick a random value from an array
 * @param {object[]} array - array of objects
 * @returns {object} - randomly picked
 */
const randomArrayChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

describe("Models -> Parking Lot -> New", () => {
  describe("creating a new lot:", () => {
    const testCapacity = 10;
    const lot = new ParkingLot(testCapacity);

    it("must create a NON empty lot", () => {
      assert.isNotEmpty(lot);
    });

    it("must have all empty slots", () => {
      assert.isNotEmpty(lot.slots);
      assert.lengthOf(Object.values(lot.slots), testCapacity);
    });

    it(`must have capacity greater than 0 and equal to ${testCapacity}`, () => {
      assert.isAbove(lot.capacity, 0);
      assert.equal(lot.capacity, testCapacity);
    });
  });
});

describe("models -> ParkingLot -> findNearestEmptySlot", () => {
  describe("when all slots are VACANT", () => {
    const testCapacity = 13;
    const lot = new ParkingLot(testCapacity);

    const emptySlot = lot.findNearestEmptySlot();

    it("expect to get first slot", () => {
      assert.equal(emptySlot.id, 1);
    });

    it("expect slot to be VACANT", () => {
      assert.equal(emptySlot.status, SlotStatus.VACANT);
    });
  });

  describe("when some slots are VACANT", () => {
    const testCapacity = 29;
    const lot = new ParkingLot(testCapacity);

    // randomly mark slots in the lot as parked
    // assume nearest to be the last slot, the loop
    // keeps this value updated whenever it assigns a random empty slot
    let nearest = testCapacity;
    for (let i = 0; i < lot.slots.length; i++) {
      if (Math.random() > 0.3) {
        lot.slots[i].status = SlotStatus.PARKED;
      } else {
        nearest = Math.min(nearest, lot.slots[i].id);
      }
    }

    // now find an empty slot
    const emptySlot = lot.findNearestEmptySlot();

    it("expect to get NEAREST slot", () => {
      assert.equal(nearest, emptySlot.id);
    });

    it("expect slot to be VACANT", () => {
      assert.equal(emptySlot.status, SlotStatus.VACANT);
    });
  });

  describe("when all slots are PARKED", () => {
    const testCapacity = 913;
    const lot = new ParkingLot(testCapacity);

    // mark all slots in the lot as parked

    for (let i = 0; i < lot.slots.length; i++) {
      lot.slots[i].status = SlotStatus.PARKED;
    }

    it("expect to throw a parking lot is full error ", () => {
      assert.throws(() => {
        lot.findNearestEmptySlot();
      }, ParkingLotFullError);
    });
  });
});

describe("models -> ParkingLot -> findSlotById", () => {
  const testCapacity = 86;
  const lot = new ParkingLot(testCapacity);

  describe("when slot id is in the parking lot", () => {
    it("expect to return slot", () => {
      const slot = lot.findSlotById(45);
      assert.exists(slot);
    });
  });

  describe("when slot id is NOT in the parking lot", () => {
    it("expect to return slot", () => {
      assert.throws(() => {
        lot.findSlotById(145);
      }, SlotNotFoundError);
    });
  });
});

describe("models -> ParkingLot -> findByStatus", () => {
  const testCapacity = 32;
  const lot = new ParkingLot(testCapacity);

  // randomly mark slots in the lot as parked
  // assume nearest to be the last slot, the loop
  // keeps this value updated whenever it assigns a random empty slot
  const parkedSlots = [];
  for (let i = 0; i < lot.slots.length; i++) {
    if (Math.random() > 0.3) {
      lot.slots[i].status = SlotStatus.PARKED;
      parkedSlots.push(lot.slots[i].clone());
    }
  }

  describe('when status="parked" is queried', () => {
    it("expect to return all parked slots", () => {
      const results = lot.findByStatus(SlotStatus.PARKED);
      assert.deepEqual(parkedSlots, results);
    });
  });

  describe('when status="random_status" is queried', () => {
    it("expect to throw not found error", () => {
      assert.throws(() => {
        lot.findByStatus("random_status");
      }, SlotNotFoundError);
    });
  });
});
