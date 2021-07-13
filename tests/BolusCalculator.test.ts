import { BolusCalculator } from "../src/BolusCalculator";

const  ClassName:String = `Bolus Calculator`

describe(`#${ClassName}`, () => {
  it(`should create an instance of ${ClassName} when TestBolusCalculator is declared`, () => {
    const TestBolusCalculator = new  BolusCalculator

    expect(TestBolusCalculator).toBeInstanceOf(BolusCalculator)
  })
})