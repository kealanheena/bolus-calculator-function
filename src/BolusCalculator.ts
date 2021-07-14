import { TimeBlocks } from "./interfaces/TimeBlock";
import { CalculationInfo } from './interfaces/CalculationInfo';

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolusCorrection(glucoseReading: number) :number {
    const currentTimeBlock: string = this.getCurrentTimeBlock()

    const activeTimeBlock: CalculationInfo = this.timeBlocks[currentTimeBlock]

    const { insulinSensitivity, targetRange } = activeTimeBlock
    const correctableGlucose: number = glucoseReading - targetRange[1]
    const roundedCorrection: number = Math.round(correctableGlucose/insulinSensitivity)

    return roundedCorrection
  }

  private getCurrentTimeBlock() :string {
    const currentTime: Date = new Date(),
          startTime: Date = new Date(currentTime.getTime()),
          endTime: Date = new Date(currentTime.getTime())
    
    let currentTimeBlock: string = '00:00-05:00'

    for (const timeBlock in this.timeBlocks) {
      const arrayOfTimes: Array<string> = timeBlock.split('-')
      
      this.setStartTime(startTime, arrayOfTimes)
      this.setEndTime(endTime, arrayOfTimes)

      if (startTime <= currentTime && endTime > currentTime) {
        currentTimeBlock = timeBlock
        break
      }
    }

    return currentTimeBlock
  }

  private setStartTime(startTime: Date, arrayOfTimes: Array<string>) {
    const startHoursMinsArray: Array<string> = arrayOfTimes[0].split(":")

    startTime.setHours(Number(startHoursMinsArray[0]));
    startTime.setMinutes(Number(startHoursMinsArray[1]));
    startTime.setSeconds(0o0);
  }

  private setEndTime(endTime: Date, arrayOfTimes: Array<string>) {
    const endHoursMinsArray: Array<string> = arrayOfTimes[1].split(":")

    endTime.setHours(Number(endHoursMinsArray[0]));
    endTime.setMinutes(Number(endHoursMinsArray[1]));
    endTime.setSeconds(0o0);
  }
}