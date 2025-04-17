# 🍽️ Recipe Dataset Generation Pipeline (AI + Validation)

This project builds a high-quality, validated, and diverse recipe dataset using modern GenAI techniques and custom validation logic. It is designed to support training, analysis, and seeding a production-grade food application.

---

## 🚀 Project Overview

We use **Google Gemini Pro** via prompt engineering to generate recipes that conform to a specific schema. These recipes are:

- Automatically validated using [Zod](https://github.com/colinhacks/zod)
- Deduplicated based on recipe name
- Stored in clean, machine-friendly JSON
- Ready to be pushed into a database (MongoDB)

---

## 📦 Features

- ✅ **Structured Recipe Schema**  
  Ensures consistent format across all entries (name, nutrition, ingredients, tags, etc.)

- 🧠 **GenAI Prompting with Gemini Pro**  
  Highly structured prompts enforce schema rules, enum constraints, and diversity (cuisine, meal types, etc.)

- 🔍 **Schema Validation with Zod**  
  Recipes are validated field-by-field, and errors are logged with detailed breakdowns.

- ♻️ **Deduplication via Recipe Name Hashing**  
  A `Set` ensures no name is repeated, even across batches.

- 🗃️ **Prompt Generation with Existing Data Filter**  
  Already-generated names are passed into new prompts to avoid duplicates.

---

## 📁 Folder Structure

```bash
.
├── prerecipes.json           # Raw unfiltered recipes
├── PostRecipes.json          # Validated + unique recipes
├── RecipeValidationSchema.ts # Zod schema for validation
├── validateAndExport.ts      # Validates recipes and saves cleaned version
├── generateRecipes.ts        # Gemini Pro-based batch generation
├── final_prompt.txt          # Enhanced prompt with schema + used names
└── .env                      # API keys (ignored)
