const assert = require("chai").assert;

const { SlotStatus } = require("../models/slot");
const { ParkingApp } = require("./parking");
const {
  BadDataError,
  ParkingLotFullError,
  SlotNotFoundError,
} = require("../errors");

describe("ParkingApp", () => {
  describe("create a new app", () => {
    const app = new ParkingApp();
    it("expect to NOT have a parking lot", () => {
      assert.isNull(app.parkingLot);
    });

    it("when lot is not created, expect to throw parking lot not created error", () => {
      assert.throws(() => {
        app.park("PL01CV2132", "Red");
      }, BadDataError);
      assert.throws(() => {
        app.status();
      }, BadDataError);
    });
  });
});

describe("ParkingApp -> createParkingLot", () => {
  describe("when no parking lot was previously created for this app", () => {
    const testCapacity = 123;

    const app = new ParkingApp();
    const message = app.createParkingLot(testCapacity);

    it("expect to create a new parking lot", () => {
      assert.isNotNull(app.parkingLot);
      assert.deepEqual(testCapacity, app.parkingLot.capacity);
      assert.deepEqual(
        `Created a parking lot with ${testCapacity} slots`,
        message
      );
    });
  });

  describe("when a parking lot was previously created", () => {
    const testCapacity = 3215;

    const app = new ParkingApp();
    app.createParkingLot(testCapacity);

    it("expect to throw an error", () => {
      assert.throws(() => {
        const testCapacity = 123;
        app.createParkingLot(testCapacity);
      }, BadDataError);
    });
  });

  describe("when capacity is a valid number as a string", () => {
    const testCapacity = "765";

    const app = new ParkingApp();
    app.createParkingLot(testCapacity);

    it("expect to create a new parking lot", () => {
      assert.deepEqual(765, app.parkingLot.capacity);
    });
  });

  describe("when capacity is an invalid string", () => {
    const testCapacity = "76adfasdf5";
    const app = new ParkingApp();

    it("expect to throw error", () => {
      assert.throws(() => {
        app.createParkingLot(testCapacity);
      }, BadDataError);
    });
  });
});

describe("ParkingApp -> park", () => {
  describe("when parking lot has empty slots", () => {
    const app = new ParkingApp();
    app.createParkingLot(123);

    it("expect to assign a slot", () => {
      const message = app.park("JK98VB7134", "White");
      assert.deepEqual("Allocated slot number: 1", message);
    });
  });

  describe("when parking lot is full", () => {
    const app = new ParkingApp();
    app.createParkingLot(45);

    for (let i = 0; i < app.parkingLot.slots.length; i++) {
      app.parkingLot.slots[i].status = SlotStatus.PARKED;
    }

    it("expect to return an error", () => {
      assert.throws(() => {
        app.park("LO7XC1343", "Purple");
      }, ParkingLotFullError);
    });
  });

  describe("when a car with same regisration & colour requests to park more than once", () => {
    const app = new ParkingApp();
    app.createParkingLot(123);

    const testRegistration = "UP12OP1341";
    const testColour = "Yellow";

    const slot1 = app.park(testRegistration, testColour);

    it("expect to get same slot number", () => {
      const slot2 = app.park(testRegistration, testColour);
      assert.deepEqual(slot1, slot2);
    });
  });

  describe("when a car with same regisration & different colour requests to park more than once", () => {
    const app = new ParkingApp();
    app.createParkingLot(123);

    const testRegistration = "UP12OP1341";
    const testColour = "Yellow";

    app.park(testRegistration, testColour);

    it("expect to throw a bad data error", () => {
      const testColour2 = "Red";
      assert.throws(() => {
        app.park(testRegistration, testColour2);
      }, BadDataError);
    });
  });
});

describe("ParkingApp -> status", () => {
  describe("when all slots are empty", () => {
    const app = new ParkingApp();
    app.createParkingLot(35);

    it("expect to get empty table", () => {
      const statusTable = app.status();

      assert.deepEqual(`Slot No.    Registration No    Colour\n`, statusTable);
    });
  });

  describe("when some slots have parked cars", () => {
    const app = new ParkingApp();
    app.createParkingLot(31);

    // park a car
    const testSlotId = 21;
    app.parkingLot.slots[testSlotId - 1].status = SlotStatus.PARKED;
    app.parkingLot.slots[testSlotId - 1].registration = "KJ33KL133";
    app.parkingLot.slots[testSlotId - 1].colour = "White";

    it("expect to one row in table", () => {
      const statusTable = app.status();

      assert.deepEqual(
        `Slot No.    Registration No    Colour\n21           KJ33KL133      White`,
        statusTable
      );
    });
  });
});
