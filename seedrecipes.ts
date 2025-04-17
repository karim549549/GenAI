import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import { config } from "dotenv";
import * as bcrypt from "bcrypt";
config();
const prisma = new PrismaClient();

async function main() {
  const data = await fs.readFile("PostRecipes.json", "utf-8");
  const recipes = JSON.parse(data);

  // Find or create the seeding user
  const user = await prisma.user.upsert({
    where: { email: "karimkhaled549@gmail.com" },
    update: {},
    create: {
      firstname: "karim",
      lastname: "khaled",
      email: "karimkhaled549@gmail.com",
      hashPassword: bcrypt.hashSync(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      ),
      role: "ADMIN",
    },
  });

  let added = 0;

  for (const recipe of recipes) {
    try {
      const exists = await prisma.recipe.findFirst({
        where: { name: recipe.name },
      });

      if (exists) {
        console.log(`⚠️ Skipped duplicate: ${recipe.name}`);
        continue;
      }

      await prisma.recipe.create({
        data: {
          ...recipe,
          createdById: user.id,
        },
      });

      added++;
      console.log(`✅ Added: ${recipe.name}`);
    } catch (err) {
      console.error(`❌ Error adding ${recipe.name}`, err);
    }
  }

  console.log(`🎉 Done! Inserted ${added} new recipes.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
