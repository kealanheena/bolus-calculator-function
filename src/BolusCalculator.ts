import { TimeBlocks } from "./interfaces/TimeBlock";

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolusCorrection(glucoseReading: number) {
    const insulinSensitivity: number = this.timeBlocks["00:00-05:00"].insulinSensitivity
    const highTargetRange: number = this.timeBlocks["00:00-05:00"].targetRange[1]
    const correctableGlucose: number = glucoseReading - highTargetRange
    
    return correctableGlucose/insulinSensitivity
  }
}