import { TimeBlocks } from "./interfaces/TimeBlock";

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolusCorrection(glucoseReading: Number) {
    return 1
  }
}