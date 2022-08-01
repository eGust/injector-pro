module.exports = {
  root: true,
  plugins: ['solid'],
  extends: ['airbnb-base'],
  rules: {
    'max-len': ['error', {
      code: 120,
      comments: 120,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
    }],
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['solid', '@typescript-eslint'],
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:solid/typescript',
        'plugin:@typescript-eslint/recommended',
      ],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
