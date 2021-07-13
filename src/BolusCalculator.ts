import { TimeBlocks } from "./interfaces/TimeBlock";

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolusCorrection(glucoseReading: number) :number {
    const timeBlock = this.timeBlocks["00:00-05:00"]
    const { insulinSensitivity, targetRange } = timeBlock
    const correctableGlucose: number = glucoseReading - targetRange[1]
    const roundedCorrection: number = Math.round(correctableGlucose/insulinSensitivity)

    return roundedCorrection
  }
}