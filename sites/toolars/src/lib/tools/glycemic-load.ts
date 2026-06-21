export type GlycemicFoodId =
  | "white-rice"
  | "brown-rice"
  | "oatmeal"
  | "white-bread"
  | "whole-bread"
  | "apple"
  | "watermelon"
  | "potato"
  | "sweet-potato"
  | "cola"
  | "milk"
  | "ice-cream"
  | "pasta"
  | "noodles"
  | "custom";

export interface GlycemicFoodReference {
  id: GlycemicFoodId;
  label: string;
  glycemicIndex: number;
  carbsPer100g: number;
  defaultServingGrams: number;
}

export interface GlycemicLoadInput {
  foodId: GlycemicFoodId;
  servingGrams: number;
  glycemicIndex: number;
  carbsPer100g: number;
}

export interface GlycemicLoadResult {
  totalCarbs: number;
  glycemicLoad: number;
  category: string;
  impact: string;
  markerPercent: number;
  formattedGlycemicLoad: string;
  formattedTotalCarbs: string;
  summary: string;
}

export const glycemicFoods: GlycemicFoodReference[] = [
  { id: "white-rice", label: "White rice (1 bowl 150g)", glycemicIndex: 73, carbsPer100g: 28, defaultServingGrams: 150 },
  { id: "brown-rice", label: "Brown rice (1 bowl 150g)", glycemicIndex: 68, carbsPer100g: 23, defaultServingGrams: 150 },
  { id: "oatmeal", label: "Oatmeal (1 bowl 250g)", glycemicIndex: 55, carbsPer100g: 12, defaultServingGrams: 250 },
  { id: "white-bread", label: "White bread (1 slice 30g)", glycemicIndex: 75, carbsPer100g: 49, defaultServingGrams: 30 },
  { id: "whole-bread", label: "Whole wheat bread (1 slice 30g)", glycemicIndex: 69, carbsPer100g: 41, defaultServingGrams: 30 },
  { id: "apple", label: "Apple (1 pc 180g)", glycemicIndex: 36, carbsPer100g: 14, defaultServingGrams: 180 },
  { id: "watermelon", label: "Watermelon (1 serving 200g)", glycemicIndex: 72, carbsPer100g: 8, defaultServingGrams: 200 },
  { id: "potato", label: "Potato (1 pc 150g)", glycemicIndex: 78, carbsPer100g: 17, defaultServingGrams: 150 },
  { id: "sweet-potato", label: "Sweet potato (1 pc 150g)", glycemicIndex: 63, carbsPer100g: 20, defaultServingGrams: 150 },
  { id: "cola", label: "Cola (330ml)", glycemicIndex: 63, carbsPer100g: 10.6, defaultServingGrams: 330 },
  { id: "milk", label: "Milk (250ml)", glycemicIndex: 31, carbsPer100g: 4.8, defaultServingGrams: 250 },
  { id: "ice-cream", label: "Ice cream (1 serving 100g)", glycemicIndex: 51, carbsPer100g: 24, defaultServingGrams: 100 },
  { id: "pasta", label: "Pasta (1 serving 180g)", glycemicIndex: 49, carbsPer100g: 25, defaultServingGrams: 180 },
  { id: "noodles", label: "Instant noodles (1 pack 100g)", glycemicIndex: 47, carbsPer100g: 50, defaultServingGrams: 100 },
  { id: "custom", label: "Custom", glycemicIndex: 55, carbsPer100g: 25, defaultServingGrams: 100 }
];

export const defaultGlycemicLoadScenario: GlycemicLoadInput = {
  foodId: "white-rice",
  servingGrams: 150,
  glycemicIndex: 73,
  carbsPer100g: 28
};

export function calculateGlycemicLoad(input: GlycemicLoadInput): GlycemicLoadResult {
  const servingGrams = cleanNumber(input.servingGrams);
  const glycemicIndex = cleanNumber(input.glycemicIndex);
  const carbsPer100g = cleanNumber(input.carbsPer100g);
  const totalCarbs = (carbsPer100g * servingGrams) / 100;
  const glycemicLoad = (glycemicIndex * totalCarbs) / 100;
  const { category, impact } = getGlycemicCategory(glycemicLoad);
  const formattedGlycemicLoad = glycemicLoad.toFixed(1);

  return {
    totalCarbs,
    glycemicLoad,
    category,
    impact,
    markerPercent: Math.min(100, (glycemicLoad / 30) * 100),
    formattedGlycemicLoad,
    formattedTotalCarbs: `${totalCarbs.toFixed(1)} g`,
    summary: `${formattedGlycemicLoad} GL from ${totalCarbs.toFixed(1)}g carbs`
  };
}

export function getGlycemicFood(foodId: GlycemicFoodId): GlycemicFoodReference {
  return glycemicFoods.find((food) => food.id === foodId) ?? glycemicFoods[0];
}

function getGlycemicCategory(glycemicLoad: number) {
  if (glycemicLoad <= 10) return { category: "Low GL (Recommended)", impact: "Minimal blood sugar impact" };
  if (glycemicLoad <= 19) return { category: "Medium GL (Moderate)", impact: "Moderate blood sugar impact" };
  return { category: "High GL (Limit)", impact: "High blood sugar impact" };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
