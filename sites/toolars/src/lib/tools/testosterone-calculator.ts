export type TestosteroneSex = "male" | "female";
export type TestosteroneTotalUnit = "ngdl" | "nmoll";
export type TestosteroneShbgUnit = "nmoll" | "ngdl";
export type TestosteroneAlbuminUnit = "gdl" | "gl";

export interface TestosteroneInput {
  totalTestosterone: number;
  totalUnit: TestosteroneTotalUnit;
  shbg: number;
  shbgUnit: TestosteroneShbgUnit;
  albumin: number;
  albuminUnit: TestosteroneAlbuminUnit;
  sex: TestosteroneSex;
}

export interface TestosteroneResult {
  totalTestosteroneNgDl: number;
  shbgNmolL: number;
  albuminGDl: number;
  freeTestosteroneNgDl: number;
  bioavailableTestosteroneNgDl: number;
  freePercent: number;
  formattedFreeTestosterone: string;
  formattedBioavailableTestosterone: string;
  formattedFreePercent: string;
  status: string;
  referenceRange: string;
  summary: string;
  recommendation: string;
}

export const defaultTestosteroneScenario: TestosteroneInput = {
  totalTestosterone: 500,
  totalUnit: "ngdl",
  shbg: 35,
  shbgUnit: "nmoll",
  albumin: 4.5,
  albuminUnit: "gdl",
  sex: "male"
};

export function calculateTestosterone(input: TestosteroneInput): TestosteroneResult {
  const totalTestosteroneNgDl = input.totalUnit === "nmoll" ? cleanPositive(input.totalTestosterone) * 28.84 : cleanPositive(input.totalTestosterone);
  const shbgNmolL = input.shbgUnit === "ngdl" ? cleanPositive(input.shbg) / 28.84 : cleanPositive(input.shbg);
  const albuminGDl = input.albuminUnit === "gl" ? cleanPositive(input.albumin) / 10 : cleanPositive(input.albumin);
  const safeShbg = shbgNmolL || 35;
  const totalNmolL = totalTestosteroneNgDl / 28.84;
  const sourceBindingRatio = (totalNmolL / safeShbg) * 100;
  const sourceFreeEstimate = (totalTestosteroneNgDl * (-0.0066 * sourceBindingRatio + 0.0094)) / 0.0347;
  const freeTestosteroneNgDl = Math.max(0, sourceFreeEstimate);
  const bioavailableTestosteroneNgDl = freeTestosteroneNgDl + (totalTestosteroneNgDl - freeTestosteroneNgDl) * 0.3;
  const freePercent = totalTestosteroneNgDl > 0 ? (freeTestosteroneNgDl / totalTestosteroneNgDl) * 100 : 0;
  const reference = getReference(input.sex, freeTestosteroneNgDl);

  return {
    totalTestosteroneNgDl,
    shbgNmolL: safeShbg,
    albuminGDl,
    freeTestosteroneNgDl,
    bioavailableTestosteroneNgDl,
    freePercent,
    formattedFreeTestosterone: `${freeTestosteroneNgDl.toFixed(1)} ng/dL`,
    formattedBioavailableTestosterone: `${bioavailableTestosteroneNgDl.toFixed(1)} ng/dL`,
    formattedFreePercent: `${freePercent.toFixed(2)}%`,
    status: reference.status,
    referenceRange: reference.range,
    summary: `${totalTestosteroneNgDl.toFixed(1)} ng/dL total T, ${safeShbg.toFixed(1)} nmol/L SHBG`,
    recommendation: reference.recommendation
  };
}

function getReference(sex: TestosteroneSex, freeTestosteroneNgDl: number) {
  if (sex === "female") {
    if (freeTestosteroneNgDl < 0.3) {
      return {
        status: "Low",
        range: "0.3 - 1.9 ng/dL",
        recommendation: "Below the female reference range; use lab context and clinician review."
      };
    }
    if (freeTestosteroneNgDl <= 1.9) {
      return {
        status: "Normal",
        range: "0.3 - 1.9 ng/dL",
        recommendation: "Within the female reference range in the VitalCalc source copy."
      };
    }
    return {
      status: "High",
      range: "0.3 - 1.9 ng/dL",
      recommendation: "Above the female reference range; review symptoms, timing, and lab method with a clinician."
    };
  }

  if (freeTestosteroneNgDl < 5.6) {
    return {
      status: "Low",
      range: "5.6 - 22.4 ng/dL",
      recommendation: "Below the male reference range; symptoms and morning lab timing matter."
    };
  }
  if (freeTestosteroneNgDl <= 22.4) {
    return {
      status: "Normal",
      range: "5.6 - 22.4 ng/dL",
      recommendation: "Within the male reference range in the VitalCalc source copy."
    };
  }
  return {
    status: "High",
    range: "5.6 - 22.4 ng/dL",
    recommendation: "Above the male reference range; do not interpret without clinical context."
  };
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
