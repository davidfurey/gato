module.exports =  {
  parser: '@typescript-eslint/parser',
  extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
      // Allows for the parsing of modern ECMAScript features
      ecmaVersion: 2018,
      // Allows for the use of imports
      sourceType: 'module',
      ecmaFeatures: {
          // Allows for the parsing of JSX
          jsx:  true,
      },
      project: 'tsconfig.json',
  },
  rules: {
      // Triple-equals equality in JS
      'eqeqeq': [
          'error', 
          'always', 
          {
            'null': 'ignore'
          }
        ],
      // Avoid let when variable is never re-assigned
      'prefer-const': 'error',
      'max-len': [
          'error',
          {
              code: 100,
              ignoreStrings: true,
              ignoreTemplateLiterals: true,
              ignoreUrls: true,
          },
      ],
      'no-trailing-spaces': 'error',
      "@typescript-eslint/no-unused-vars": ['error', { "argsIgnorePattern": "^_", "varsIgnorePattern": "^ignored?$" }]
    //   '@typescript-eslint/no-unused-vars': 'off'
  },
  settings: {
      react: {
          // Tells eslint-plugin-react to automatically detect the version of React to use
          version: 'detect',
      },
  },
};