const assert = require("chai").assert;

const { Slot, SlotStatus } = require("./slot");
const { SlotNotVacantError } = require("../errors");

describe("models -> Slot", () => {
  describe("creating new slot:", () => {
    const testId = 1;
    const slot = new Slot(testId);

    assert.exists(slot);

    it("must have given id", () => {
      assert.equal(testId, slot.id);
    });

    it("must have default status as VACANT", () => {
      assert.strictEqual(slot.status, SlotStatus.VACANT);
    });

    it("must have empty registration & colour fields ", () => {
      assert.notExists(slot.registration);
      assert.notExists(slot.colour);
    });
  });

  describe("assigning a slot:", () => {
    const testId = 12;
    const testRegistration = "MH01XX1234";
    const testColour = "red";
    const slot = new Slot(testId);

    slot.assign({ registration: testRegistration, colour: testColour });

    it("when slot is empty, expect to save registration & colour", () => {
      assert.equal(slot.registration, testRegistration);
      assert.equal(slot.colour, testColour);
    });
    it("when slot is NOT empty, expect to raise an error", () => {
      assert.throws(() => {
        slot.assign({ registration: "KA01YY9876", colour: "white" });
      }, SlotNotVacantError);
    });
  });

  describe("leaving a parked slot:", () => {
    const testId = 342;

    const slot = new Slot(testId);
    slot.registration = "AP01JJ345";
    slot.colour = "purple";

    slot.leave();

    it("when slot is NOT empty, expect to clear registration & colour data", () => {
      assert.notExists(slot.registration);
      assert.notExists(slot.colour);
    });

    it("when slot is NOT empty, expect to set status to VACANT", () => {
      assert.equal(SlotStatus.VACANT, slot.status);
    });
  });

  describe("leaving an empty slot", () => {
    const testId = 342;
    const slot = new Slot(testId);

    slot.leave();

    it("when slot is empty, expect status to be VACANT", () => {
      assert.equal(SlotStatus.VACANT, slot.status);
    });

    it("when slot is empty, expect fields to stay empty", () => {
      assert.notExists(slot.registration);
      assert.notExists(slot.colour);
    });
  });

  describe("cloning a slot should create a new object with same attributes", () => {
    const slot = new Slot(131);
    slot.status = SlotStatus.PARKED;
    slot.registration = "PB01XX1234";
    slot.colour = "red";

    const clone = slot.clone();

    assert.deepEqual(slot, clone);
    // ensure clone is not same instance of slot
    // this is same as slot == clone
    assert.notEqual(slot, clone);
  });
});
