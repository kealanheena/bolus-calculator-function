import { CalculationInfo } from "./CalculationInfo";

export interface TimeBlocks {
  '00:00-05:00': CalculationInfo,
  '05:00-11:30': CalculationInfo,
  '11:30-16:00': CalculationInfo,
  '16:00-20:00': CalculationInfo,
  '20:00-00:00': CalculationInfo
}