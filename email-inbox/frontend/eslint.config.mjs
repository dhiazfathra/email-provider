import next from "eslint-config-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**"] },
  ...next,
  ...tseslint.configs.recommended,
);
