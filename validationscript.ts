import fs from "fs/promises";
import {
  RecipeSchema,
  extractValidationErrors,
} from "./RecipeValidationSchema";

(async () => {
  const data = await fs.readFile("prerecipes.json", "utf-8");
  const recipes = JSON.parse(data);

  const BASE_PROMPT = `
  You are generating structured JSON for a recipe dataset.
  
  Each recipe must match this schema:
  
  {
    name: string,
    description?: string,
    ingredients: string[],
    instructions: string[],
    cuisine: one of ["ITALIAN", "MEXICAN", "INDIAN", "CHINESE", "JAPANESE", "MEDITERRANEAN", "AMERICAN", "ARABIC", "FRENCH", "GREEK"],
    mealType: one of ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "DESSERT", "APPETIZER", "SIDE_DISH", "MAIN_COURSE", "SALAD", "SOUP"],
    prepTime: number,
    cookTime: number,
    totalTime: number,
    calories: number,
    protein: number,
    fat: number,
    carbs: number,
    servings: number,
    tags: string[] (from: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE", "DAIRY_FREE", "LOW_CARB", "HIGH_PROTEIN", "KETO", "PALEO", "MEAL_PREP"]),
    source: always "OFFICIAL"
  }
  
  Rules:
  - Output ONLY a valid JSON array of 10 unique recipes
  - Do NOT include any commentary or extra text
  - Ensure enum values match casing and spelling exactly
  
  Diversity Requirements:
  - Include a balanced mix of:
    - Healthy/diet recipes (e.g., vegan, paleo, low carb)
    - Indulgent/junk food recipes (e.g., cheesy, fried, sweet)
  - Include recipes from at least 6 different cuisines from the list
  - Ensure different prep and cook time ranges (fast snacks and long meals)
  - Include both simple 3-step recipes and complex 6+ step ones
  - Avoid repeating dish types or very similar ingredients in one batch
  
  `;

  let valid = 0;
  let invalid = 0;
  const errorStats: Record<string, number> = {};
  const uniqueValidRecipes = new Set<string>();
  const validatedRecipes: any[] = [];

  for (const recipe of recipes) {
    const parsed = RecipeSchema.safeParse(recipe);

    if (parsed.success) {
      valid++;
      const nameKey = parsed.data.name.toLowerCase().trim();
      if (!uniqueValidRecipes.has(nameKey)) {
        uniqueValidRecipes.add(nameKey);
        validatedRecipes.push(parsed.data);
      }
    } else {
      invalid++;
      const errors = extractValidationErrors(parsed.error);
      errors.forEach((err: string) => {
        errorStats[err] = (errorStats[err] || 0) + 1;
      });
    }
  }

  console.log("📦 Total recipes:", recipes.length);
  console.log("✅ Valid recipes:", valid);
  console.log("❌ Invalid recipes:", invalid);
  console.log("🔐 Unique valid recipes:", uniqueValidRecipes.size);
  console.log("🧯 Error breakdown:", errorStats);

  await fs.writeFile(
    "PostRecipes.json",
    JSON.stringify(validatedRecipes, null, 2),
    "utf-8"
  );
  console.log(
    `💾 Saved ${validatedRecipes.length} recipes to PostRecipes.json`
  );

  // 🧠 Write new prompt excluding current recipes
  const excludedNames = [...uniqueValidRecipes]
    .map((name) => `- "${name}"`)
    .join("\n");

  const fullPrompt = `${BASE_PROMPT}

Additionally:
- Do not generate any of the following recipe names (already used):
${excludedNames}
`;

  await fs.writeFile("enhancedPrompt.txt", fullPrompt.trim(), "utf-8");
  console.log("📝 Saved enhanced prompt to enhancedPrompt.txt");
})();
