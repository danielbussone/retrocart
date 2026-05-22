import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/schema/export-schema.ts",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript"],
      config: {
        avoidOptionals: true,
      },
    },
  },
};

export default config;
