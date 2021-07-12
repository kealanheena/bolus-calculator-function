import { BolusCalculator } from "../BolusCalculator";

const ClassName = `Bolus Calculator`

describe(`#${ClassName}`, () => {
  it(`should create an instance of the ${ClassName}`, () => {
    const MyBolusCalculator = new BolusCalculator

    expect(MyBolusCalculator).toBeInstanceOf(BolusCalculator);
  });
});
