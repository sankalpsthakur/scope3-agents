module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: ["react-app"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
