const assert = require("chai").assert;
const sinon = require("sinon");

const { dispatch } = require("./dispatcher");

describe("Dispatcher -> dispatch (only tests invocation and a result value/error)", () => {
  const app = {
    createParkingLot: sinon.fake.returns("Created test parking lot"),
    park: sinon.fake.returns("Allocated slot number: 4"),
    leave: sinon.fake.returns("Slot number 4 is free"),
    status: sinon.fake.returns("A table of all occupied slots"),
    registrationsWithColour: sinon.fake.returns(
      "KA-01-HH-1234, KA-01-HH-9999, KA-01-P-333"
    ),
    slotIdsWithColour: sinon.fake.returns("1, 2, 4"),
    slotIdForRegistration: sinon.fake.returns("1"),
  };

  describe("when command -> create_parking_lot", () => {
    it("expect to invoke createParkingLot in ParkingApp", () => {
      const input = "create_parking_lot 10";
      const { success, error } = dispatch(input, app);

      assert(app.createParkingLot.calledOnce);
      assert(app.createParkingLot.calledWith("10"));

      assert.exists(success);
      assert.notExists(error);
    });
  });

  describe("when command -> park", () => {
    it("expect to invoke park in ParkingApp", () => {
      const input = "park JH-01-AD-1234 Black";
      const { success, error } = dispatch(input, app);

      assert(app.park.calledOnce);
      assert(app.park.calledWith("JH-01-AD-1234", "Black"));

      assert.exists(success);
      assert.notExists(error);
    });
  });

  describe("when command -> status", () => {
    it("expect to invoke status in ParkingApp", () => {
      const input = "status";
      const { success, error } = dispatch(input, app);

      assert(app.status.calledOnce);

      assert.exists(success);
      assert.notExists(error);
    });
  });
});
