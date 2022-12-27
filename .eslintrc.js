module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin,
    "eslint:recommended", // Uses the recommended rules from the eslint,
    "plugin:@stencil/recommended",
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    project: "./tsconfig.json",
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    "no-unused-vars": "off",
    "no-magic-numbers": "off",
    "@typescript-eslint/no-magic-numbers": "warn",
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ],

    "@stencil/async-methods": "error", // This rule catches Stencil public methods that are not async
    "@stencil/decorators-context": "error", // This rule catches Stencil decorators in bad locations
    "@stencil/decorators-style": [
      "error",
      {
        prop: "inline",
        state: "inline",
        element: "inline",
        event: "inline",
        method: "multiline",
        watch: "multiline",
        listen: "multiline"
      }
    ],
    "@stencil/element-type": "error", // This rule catches Stencil public methods that are not async
    "@stencil/methods-must-be-public": "error", // This rule catches Stencil Methods marked as private or protected
    "@stencil/no-unused-watch": "error", // This rule catches Stencil Watchs with non existing Props or States
    "@stencil/own-methods-must-be-private": "error", // This rule catches own class methods marked as public
    "@stencil/own-props-must-be-private": "error", // This rule catches own class properties marked as public
    "@stencil/prefer-vdom-listener": "error", // This rule catches Stencil Listen with vdom events
    "@stencil/props-must-be-public": "error", // This rule catches Stencil Props marked as private or protected
    "@stencil/props-must-be-readonly": "error", // This rule catches Stencil Props marked as non readonly, excluding mutable ones
    "@stencil/required-jsdoc": "warn", // This rule catches Stencil Props, Methods and Events to define jsdoc
    "@stencil/required-prefix": ["error", ["gx-"]], // Ensures that a Component's tag use the "gx-" prefix.
    "@stencil/single-export": "error", // This rule catches modules that expose more than just the Stencil Component itself
    "@stencil/strict-boolean-conditions": ["error", ["allow-string"]],
    "@stencil/strict-mutable": "off" // This rule catches Stencil Prop marked as mutable but not changing value in code
  }
};
