import { BolusCalculator } from "../src/BolusCalculator";
import { TimeBlocks } from "../src/interfaces/TimeBlock";
import { CalculationInfo } from "../src/interfaces/CalculationInfo";

const  ClassName:String = `Bolus Calculator`

describe(`#${ClassName}`, () => {
  let TestBolusCalculator: BolusCalculator, testTimeBlocks: TimeBlocks, calculationInfo: CalculationInfo

  beforeEach(() => {
    calculationInfo = {
      targetRange: [5.0, 8.0],
      carbRatio: 6,
      insulinSensitivity: 3.0
    }
    testTimeBlocks = {
    '00:00-05:00': calculationInfo,
    '05:00-11:30': calculationInfo,
    '11:30-16:00': calculationInfo,
    '16:00-20:00': calculationInfo,
    '20:00-00:00': calculationInfo
    }
    TestBolusCalculator = new BolusCalculator(testTimeBlocks)
  })

  it(`should create an instance of ${ClassName} when TestBolusCalculator is declared`, () => {
    expect(TestBolusCalculator).toBeInstanceOf(BolusCalculator)
  })

  it(`should have a time blocks property`, () => {
    expect(TestBolusCalculator.timeBlocks).toBeInstanceOf(Object)
  })

  it(`should have 5 time blocks starting at '00:00' and ending at '00:00'`, () => {
    const timeBlocks: TimeBlocks = TestBolusCalculator.timeBlocks

    expect(timeBlocks['00:00-05:00']).toBeInstanceOf(Object)
    expect(timeBlocks['05:00-11:30']).toBeInstanceOf(Object)
    expect(timeBlocks['11:30-16:00']).toBeInstanceOf(Object)
    expect(timeBlocks['16:00-20:00']).toBeInstanceOf(Object)
    expect(timeBlocks['20:00-00:00']).toBeInstanceOf(Object)
  })

  it(`a time blocks should have the following keys Target Range, Carb Ratio, Insulin Sensitivity`, () => {
    const timeBlock: CalculationInfo = TestBolusCalculator.timeBlocks['00:00-05:00']

    expect(timeBlock.targetRange).toBeInstanceOf(Array)
    expect(timeBlock.targetRange).toBe(calculationInfo.targetRange)
    expect(timeBlock.carbRatio).toBe(calculationInfo.carbRatio)
    expect(timeBlock.insulinSensitivity).toBe(calculationInfo.insulinSensitivity)
  })

  describe(`#getBolusCorrection`, () => {
    let insulinSensitivity: number

    beforeEach(() => {
      insulinSensitivity = TestBolusCalculator.timeBlocks['00:00-05:00'].insulinSensitivity
    })

    it(`should be a function`, () => {
      expect(TestBolusCalculator.getBolusCorrection).toBeInstanceOf(Function)
    })

    describe(`When the insulin sensitivity is 3.0`, () => {
      it(`should return 1 when 11.0 is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(11.0)).toBe(1)
      })
  
      it(`should return 2 when 14.0 is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(14.0)).toBe(2)
      })
  
      it(`should round up to 3 when 15.7 is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(15.7)).toBe(3)
      })
    })

    describe(`When the insulin sensitivity is 4.0`, () => {
      it(`should return 1 when 12.0 is passed and insulin sensitivity is equal to 4.0`, () => {
        insulinSensitivity = 4.0
  
        expect(TestBolusCalculator.getBolusCorrection(12.0)).toBe(1)
      })

      it(`should round up to 2 when 14.7 is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(14.7)).toBe(2)
      })
  
      it(`should round up to 3 when 15.7 is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(19.7)).toBe(4)
      })
    })
  })
})