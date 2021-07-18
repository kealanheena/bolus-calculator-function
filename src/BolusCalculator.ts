import { TimeBlocks } from "./interfaces/TimeBlock"
import { CalculationInfo } from './interfaces/CalculationInfo'

export class BolusCalculator {
  timeBlocks: TimeBlocks

  constructor(timeBlocks: TimeBlocks) {
    this.timeBlocks = timeBlocks
  }

  getBolus(glucoseReading: number, carbsInGrams: number) :number {
    const currentTimeBlock: string = this.getCurrentTimeBlock(),
          activeTimeBlock: CalculationInfo = this.timeBlocks[currentTimeBlock],
          { carbRatio, targetRange } = activeTimeBlock

    let correction: number = 0

    if(!this.isCorrectionZero(glucoseReading, targetRange[1])) correction = this.getBolusCorrection(glucoseReading)

    const floatBolus: number = this.getFloatBolus(carbsInGrams, carbRatio),
          roundedBolus: number = Math.round(floatBolus),
          bolus = roundedBolus + correction

    return bolus
  }

  getBolusCorrection(glucoseReading: number) :number {
    const currentTimeBlock: string = this.getCurrentTimeBlock(),
          activeTimeBlock: CalculationInfo = this.timeBlocks[currentTimeBlock],
          { insulinSensitivity, targetRange } = activeTimeBlock

    if (this.isCorrectionZero(glucoseReading, targetRange[1])) return 0

    const correctableGlucose: number = this.getCorrectableGlucose(glucoseReading, targetRange[1]),
          floatCorrection: number = this.getFloatBolusCorrection(correctableGlucose, insulinSensitivity),
          roundedCorrection: number = Math.round(floatCorrection)

    return roundedCorrection
  }

  // =================
  // private functions
  // =================

  private getCurrentTimeBlock() :string {
    const currentTime: Date = new Date(),
          startTime: Date = new Date(currentTime.getTime()),
          endTime: Date = new Date(currentTime.getTime())
    
    let currentTimeBlock: string = '20:00-00:00'

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
    time.setHours(Number(hoursMinsArray[0]))
    time.setMinutes(Number(hoursMinsArray[1]))
    time.setSeconds(0o0)
  }

  private isCorrectionZero(glucoseReading: number, highTargetRange: number) :boolean {
    return glucoseReading < highTargetRange
  }

  private getCorrectableGlucose(glucoseReading: number, highTargetRange: number) :number {
    return glucoseReading - highTargetRange
  }

  private getFloatBolus(carbsInGrams: number, carbRatio: number) :number {
    return carbsInGrams / carbRatio
  }

  private getFloatBolusCorrection(correctableGlucose: number, insulinSensitivity: number) :number {
    return correctableGlucose / insulinSensitivity
  }
}