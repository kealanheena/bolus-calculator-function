import { jest } from '@jest/globals'
import { BolusCalculator } from "../src/BolusCalculator"
import { TimeBlocks } from "../src/interfaces/TimeBlock"
import { CalculationInfo } from "../src/interfaces/CalculationInfo"

const  ClassName:String = `Bolus Calculator`

describe(`#${ClassName}`, () => {
  let TestBolusCalculator: BolusCalculator, testTimeBlocks: TimeBlocks, testCalculationInfo: CalculationInfo

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('1 Jan 2000 00:00:00 GMT').getTime())

    testCalculationInfo = {
      targetRange: [5.0, 8.0],
      carbRatio: 6,
      insulinSensitivity: 3.0
    }

    testTimeBlocks = {
    '00:00-05:00': testCalculationInfo,
    '05:00-11:30': testCalculationInfo,
    '11:30-16:00': testCalculationInfo,
    '16:00-20:00': testCalculationInfo,
    '20:00-00:00': testCalculationInfo
    }

    TestBolusCalculator = new BolusCalculator(testTimeBlocks)
  })

  afterAll(() => {
    jest.useRealTimers()
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
    expect(timeBlock.targetRange).toBe(testCalculationInfo.targetRange)
    expect(timeBlock.carbRatio).toBe(testCalculationInfo.carbRatio)
    expect(timeBlock.insulinSensitivity).toBe(testCalculationInfo.insulinSensitivity)
  })

  describe(`#getBolus`, () => {
    it(`should be a function`, () => {
      expect(TestBolusCalculator.getBolus).toBeInstanceOf(Function)
    })

    describe(`when the carb ratio is 6 and glucose reading is in the target range`, () => {
      it(`should return 2 when 5.0 (glucoseReading) and 12 (carbsInGrams) are passed`, () => {
        expect(TestBolusCalculator.getBolus(5.0, 12)).toBe(2)
      })

      it(`should return 3 when 5.0 (glucoseReading) and 18 (carbsInGrams) are passed`, () => {
        expect(TestBolusCalculator.getBolus(5.0, 18)).toBe(3)
      })

      describe(`rounding up`, () => {
        it(`should return 3 when 5.0 (glucoseReading) and 16 (carbsInGrams) are passed`, () => {
          expect(TestBolusCalculator.getBolus(5.0, 16)).toBe(3)
        })
      })
      
    })
  })

  describe(`#getBolusCorrection`, () => {

    it(`should be a function`, () => {
      expect(TestBolusCalculator.getBolusCorrection).toBeInstanceOf(Function)
    })

    describe(`when the insulin sensitivity is 3.0`, () => {
      it(`should return 1 when 11.0 (glucoseReading) is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(11.0)).toBe(1)
      })
  
      it(`should return 2 when 14.0 (glucoseReading) is passed and insulin sensitivity is equal to 3.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(14.0)).toBe(2)
      })
      describe(`rounding up`, () => {
        it(`should round up to 3 when 15.7 (glucoseReading) is passed and insulin sensitivity is equal to 3.0`, () => {
          expect(TestBolusCalculator.getBolusCorrection(15.7)).toBe(3)
        })
      })

      describe(`rounding down`, () => {
        it(`should round down to 3 when 17.7 (glucoseReading) is passed and insulin sensitivity is equal to 3.0`, () => {
          expect(TestBolusCalculator.getBolusCorrection(17.7)).toBe(3)
        })
      })
    })

    describe(`when the insulin sensitivity is 4.0`, () => {

      beforeAll(() => {
        TestBolusCalculator.timeBlocks['00:00-05:00'].insulinSensitivity = 4.0
      })

      afterAll(() => {
        TestBolusCalculator.timeBlocks['00:00-05:00'].insulinSensitivity = 3.0
      })
      
      it(`should return 1 when 12.0 (glucoseReading) is passed and insulin sensitivity is equal to 4.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(12.0)).toBe(1)
      })

      it(`should return 2 when 16.0 (glucoseReading) is passed and insulin sensitivity is equal to 4.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(16.0)).toBe(2)
      })

      it(`should return 0 when the number passed is less than the high number in the target range`, () => {
        expect(TestBolusCalculator.getBolusCorrection(7.0)).toBe(0)
      })

      describe(`rounding up`, ()=> {
        it(`should round up to 2 when 14.7 (glucoseReading) is passed and insulin sensitivity is equal to 4.0`, () => {
          expect(TestBolusCalculator.getBolusCorrection(14.7)).toBe(2)
        })
    
        it(`should round up to 3 when 15.7 (glucoseReading) is passed and insulin sensitivity is equal to 3.0`, () => {
          expect(TestBolusCalculator.getBolusCorrection(19.7)).toBe(3)
        })
      })

      describe(`rounding down`, ()=> {
        it(`should round down to 1 when 13.1 (glucoseReading) is passed and insulin sensitivity is equal to 4.0`, () => {
          expect(TestBolusCalculator.getBolusCorrection(13.1)).toBe(1)
        })
  
        it(`should round down to 2 when 17.1 (glucoseReading) is passed and insulin sensitivity is equal to 4.0`, () => {
          expect(TestBolusCalculator.getBolusCorrection(17.1)).toBe(2)
        })
      })
    })

    describe(`when calculating bolus correction at certain times`, () => {

      beforeAll(() => {
        testTimeBlocks = {
          '00:00-05:00': {
            targetRange: [5.0, 8.0], carbRatio: 6, insulinSensitivity: 1.0
          },
          '05:00-11:30': {
            targetRange: [5.0, 8.0], carbRatio: 6, insulinSensitivity: 2.0
          },
          '11:30-16:00': {
            targetRange: [5.0, 8.0], carbRatio: 6, insulinSensitivity: 4.0
          },
          '16:00-20:00': {
            targetRange: [5.0, 8.0], carbRatio: 6, insulinSensitivity: 8.0
          },
          '20:00-00:00': {
            targetRange: [5.0, 8.0], carbRatio: 6, insulinSensitivity: 16.0
          }
        }

        TestBolusCalculator.timeBlocks = testTimeBlocks
      })

      it(`should return 16 when 24.0 (glucoseReading) is passed between "00:00-05:00" where insulin sensitivity is equal to 1.0`, () => {
        expect(TestBolusCalculator.getBolusCorrection(24.0)).toBe(16)
      })

      it(`should return 8 when 24.0 (glucoseReading) is passed between "05:00-11:30" where insulin sensitivity is equal to 2.0`, () => {
        jest.setSystemTime(new Date('31 Dec 1999 05:00:00 GMT').getTime())

        expect(TestBolusCalculator.getBolusCorrection(24.0)).toBe(8)
      })

      it(`should return 4 when 24.0 (glucoseReading) is passed between "11:30-16:00" where insulin sensitivity is equal to 4.0`, () => {
        jest.setSystemTime(new Date('31 Dec 1999 11:30:00 GMT').getTime())
        
        expect(TestBolusCalculator.getBolusCorrection(24.0)).toBe(4)
      })

      it(`should return 2 when 24.0 (glucoseReading) is passed between "16:00-20:00" where insulin sensitivity is equal to 8.0`, () => {
        jest.setSystemTime(new Date('31 Dec 1999 16:00:00 GMT').getTime())

        expect(TestBolusCalculator.getBolusCorrection(24.0)).toBe(2)
      })

      it(`should return 1 when 24.0 (glucoseReading) is passed between "20:00-00:00" where insulin sensitivity is equal to 16.0`, () => {
        jest.setSystemTime(new Date('31 Dec 1999 20:00:00 GMT').getTime())

        expect(TestBolusCalculator.getBolusCorrection(24.0)).toBe(1)
      })
      
    })
  })
})