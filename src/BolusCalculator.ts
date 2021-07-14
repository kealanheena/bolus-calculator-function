import { TimeBlocks } from "./interfaces/TimeBlock";
import { CalculationInfo } from './interfaces/CalculationInfo';

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolusCorrection(glucoseReading: number) :number {
    const currentTime: Date = new Date(),
          startTime: Date = new Date(currentTime.getTime()),
          endTime: Date = new Date(currentTime.getTime())
    
    let currentTimeBlock: string = '00:00-05:00'

    for (const timeBlock in this.timeBlocks) {
      const arrayOfTimes: Array<String> = timeBlock.split('-'),
            startHoursMinsArray: Array<String> = arrayOfTimes[0].split(":"),
            endHoursMinsArray: Array<String> = arrayOfTimes[1].split(":")
      
      startTime.setHours(Number(startHoursMinsArray[0]));
      startTime.setMinutes(Number(startHoursMinsArray[1]));
      startTime.setSeconds(0o0);

      endTime.setHours(Number(endHoursMinsArray[0]));
      endTime.setMinutes(Number(endHoursMinsArray[1]));
      endTime.setSeconds(0o0);

      console.log(startTime < currentTime, '&', endTime > currentTime)
      if (startTime < currentTime && endTime > currentTime) {
        currentTimeBlock = timeBlock
        break
      }
    }

    const activeTimeBlock: CalculationInfo = this.timeBlocks[currentTimeBlock]

    const { insulinSensitivity, targetRange } = activeTimeBlock
    const correctableGlucose: number = glucoseReading - targetRange[1]
    const roundedCorrection: number = Math.round(correctableGlucose/insulinSensitivity)

    return roundedCorrection
  }
}