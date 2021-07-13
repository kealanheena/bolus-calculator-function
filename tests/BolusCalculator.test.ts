import { BolusCalculator } from "../src/BolusCalculator";
import { TimeBlocks } from "../src/interfaces/TimeBlock";

const  ClassName:String = `Bolus Calculator`

describe(`#${ClassName}`, () => {
  let TestBolusCalculator: BolusCalculator, timeBlocks: TimeBlocks

  beforeEach(() => {
    timeBlocks = {
    '00:00-05:00': {},
    '05:00-11:30': {},
    '11:30-16:00': {},
    '16:00-20:00': {},
    '20:00-00:00': {}
    }
    TestBolusCalculator = new BolusCalculator(timeBlocks)
  })

  it(`should create an instance of ${ClassName} when TestBolusCalculator is declared`, () => {
    expect(TestBolusCalculator).toBeInstanceOf(BolusCalculator)
  })

  it(`should have a time blocks property`, () => {
    expect(TestBolusCalculator.timeBlocks).toBeInstanceOf(Object)
  })
})