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

const appDomProject = (name: string) => ({
  resolve: appProject(name).resolve,
  test: {
    name: `${name}-dom`,
    environment: "happy-dom" as const,
    include: [`apps/${name}/src/**/*.test.tsx`],
  },
});

export default defineConfig({
  test: {
    projects: [
      appProject("pokemon"),
      appProject("berries"),
      appDomProject("pokemon"),
      {
        test: {
          name: "packages",
          include: ["packages/*/src/**/*.test.ts"],
          exclude: ["packages/shared/src/hooks/**"],
        },
      },
      {
        test: {
          name: "dom",
          environment: "happy-dom",
          include: ["packages/shared/src/hooks/**/*.test.{ts,tsx}", "packages/ui/src/**/*.test.tsx"],
        },
      },
    ],
  },
});
