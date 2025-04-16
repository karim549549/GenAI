import { z, ZodError, ZodIssue } from "zod";

// Recipe Schema
export const RecipeSchema = z.object({
  name: z.string().min(1, { message: "INVALID_NAME" }),
  description: z.string().optional(),
  ingredients: z.array(z.string().min(1, { message: "INVALID_INGREDIENTS" }), {
    required_error: "INVALID_INGREDIENTS",
  }),
  instructions: z.array(
    z.string().min(1, { message: "INVALID_INSTRUCTIONS" }),
    { required_error: "INVALID_INSTRUCTIONS" }
  ),
  cuisine: z.enum(
    [
      "ITALIAN",
      "MEXICAN",
      "INDIAN",
      "CHINESE",
      "JAPANESE",
      "MEDITERRANEAN",
      "AMERICAN",
      "ARABIC",
      "FRENCH",
      "GREEK",
    ],
    { errorMap: () => ({ message: "INVALID_CUISINE" }) }
  ),
  mealType: z.enum(
    [
      "BREAKFAST",
      "LUNCH",
      "DINNER",
      "SNACK",
      "DESSERT",
      "APPETIZER",
      "SIDE_DISH",
      "MAIN_COURSE",
      "SALAD",
      "SOUP",
    ],
    { errorMap: () => ({ message: "INVALID_MEAL_TYPE" }) }
  ),
  prepTime: z.number().int().nonnegative({ message: "INVALID_PREP_TIME" }),
  cookTime: z.number().int().nonnegative({ message: "INVALID_COOK_TIME" }),
  totalTime: z.number().int().nonnegative({ message: "INVALID_TOTAL_TIME" }),
  calories: z.number().nonnegative({ message: "INVALID_CALORIES" }),
  protein: z.number().nonnegative({ message: "INVALID_PROTEIN" }),
  fat: z.number().nonnegative({ message: "INVALID_FAT" }),
  carbs: z.number().nonnegative({ message: "INVALID_CARBS" }),
  servings: z.number().int().positive({ message: "INVALID_SERVINGS" }),
  tags: z.array(
    z.enum(
      [
        "VEGETARIAN",
        "VEGAN",
        "GLUTEN_FREE",
        "DAIRY_FREE",
        "LOW_CARB",
        "HIGH_PROTEIN",
        "KETO",
        "PALEO",
        "MEAL_PREP",
      ],
      { errorMap: () => ({ message: "INVALID_TAGS" }) }
    )
  ),
  source: z.literal("OFFICIAL", {
    errorMap: () => ({ message: "INVALID_SOURCE" }),
  }),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export enum RecipeValidationError {
  INVALID_NAME = "INVALID_NAME",
  INVALID_DESCRIPTION = "INVALID_DESCRIPTION",
  INVALID_INGREDIENTS = "INVALID_INGREDIENTS",
  INVALID_INSTRUCTIONS = "INVALID_INSTRUCTIONS",
  INVALID_CUISINE = "INVALID_CUISINE",
  INVALID_MEAL_TYPE = "INVALID_MEAL_TYPE",
  INVALID_PREP_TIME = "INVALID_PREP_TIME",
  INVALID_COOK_TIME = "INVALID_COOK_TIME",
  INVALID_TOTAL_TIME = "INVALID_TOTAL_TIME",
  INVALID_CALORIES = "INVALID_CALORIES",
  INVALID_PROTEIN = "INVALID_PROTEIN",
  INVALID_FAT = "INVALID_FAT",
  INVALID_CARBS = "INVALID_CARBS",
  INVALID_SERVINGS = "INVALID_SERVINGS",
  INVALID_TAGS = "INVALID_TAGS",
  INVALID_SOURCE = "INVALID_SOURCE",
}

// Utility to extract error codes from a Zod error
export const extractValidationErrors = (
  error: ZodError
): RecipeValidationError[] => {
  const issues: ZodIssue[] = error.issues;
  const errorCodes = new Set<RecipeValidationError>();

  for (const issue of issues) {
    const code = issue.message as keyof typeof RecipeValidationError;
    if (RecipeValidationError[code]) {
      errorCodes.add(RecipeValidationError[code]);
    }
  }

  return Array.from(errorCodes);
};
