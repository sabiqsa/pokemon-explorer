import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const appProject = (name: string) => ({
  resolve: {
    alias: { "@": fileURLToPath(new URL(`./apps/${name}/src`, import.meta.url)) },
  },
  test: {
    name,
    include: [`apps/${name}/src/**/*.test.ts`],
  },
});

export default defineConfig({
  test: {
    projects: [
      appProject("pokemon"),
      appProject("berries"),
      {
        test: {
          name: "packages",
          include: ["packages/*/src/**/*.test.ts"],
        },
      },
    ],
  },
});
