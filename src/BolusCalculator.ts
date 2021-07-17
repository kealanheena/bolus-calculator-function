import { TimeBlocks } from "./interfaces/TimeBlock";
import { CalculationInfo } from './interfaces/CalculationInfo';

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolusCorrection(glucoseReading: number) :number {
    const currentTimeBlock: string = this.getCurrentTimeBlock(),
          activeTimeBlock: CalculationInfo = this.timeBlocks[currentTimeBlock],
          { insulinSensitivity, targetRange } = activeTimeBlock

    if (activeTimeBlock.targetRange[1] > glucoseReading) return 0

    const correctableGlucose: number = this.getCorrectableGlucose(glucoseReading, targetRange[1]),
          floatCorrection: number = this.getFloatCorrection(correctableGlucose, insulinSensitivity),
          roundedCorrection: number = Math.round(floatCorrection)

    return roundedCorrection
  }

  private getCurrentTimeBlock() :string {
    const currentTime: Date = new Date(),
          startTime: Date = new Date(currentTime.getTime()),
          endTime: Date = new Date(currentTime.getTime())
    
    let currentTimeBlock: string = '00:00-05:00'

    for (const timeBlock in this.timeBlocks) {
      const startHoursMinsArray: Array<string> = timeBlock.split('-')[0].split(':'),
            endHoursMinsArray: Array<string> = timeBlock.split('-')[1].split(':')
      
      this.setTime(startTime, startHoursMinsArray)
      this.setTime(endTime, endHoursMinsArray)

      if (startTime <= currentTime && endTime > currentTime) {
        currentTimeBlock = timeBlock
        break
      }
    }

    return currentTimeBlock
  }

  private setTime(time: Date, hoursMinsArray: Array<string>) :void {
    time.setHours(Number(hoursMinsArray[0]));
    time.setMinutes(Number(hoursMinsArray[1]));
    time.setSeconds(0o0);
  }

  private getCorrectableGlucose(glucoseReading: number, highTargetRange: number) :number {
    return glucoseReading - highTargetRange
  }

  private getFloatCorrection(correctableGlucose: number, insulinSensitivity: number) :number {
    return correctableGlucose / insulinSensitivity
  }
}