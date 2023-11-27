module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: "standard-with-typescript",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    semi: "off",
    "@typescript-eslint/semi": "off",
    quotes: "off",
    "@typescript-eslint/quotes": "off",
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": "off",
    "space-before-function-paren": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "no-floating-promise": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/member-delimiter-style": "off",
  },
};
