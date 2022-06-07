/**
 * Generic not found error for slot based search queries
 */
class SlotNotFoundError extends Error {}

/**
 * Raise when an occupied slot is attempted to be assigned to another car
 */
class SlotNotVacantError extends Error {
  constructor(id, message) {
    super(message);

    this.slot_id = id;
    this.message = message;
  }
}

/**
 * Raised when parking lot is full and more cars cannot be parked
 */
class ParkingLotFullError extends Error {}

/**
 * Raised when an function gets invalid/bad data
 */
class BadDataError extends Error {}

module.exports = {
  SlotNotFoundError,
  SlotNotVacantError,
  ParkingLotFullError,
  BadDataError,
};
