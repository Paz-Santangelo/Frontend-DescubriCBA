import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist/**'], // Correct way to ignore directories
    ...pluginReactConfig, // Spread the recommended React config
    languageOptions: {
      ...pluginReactConfig.languageOptions, // Use language options from React config
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules, // Add hooks rules
      'react-refresh/only-export-components': [ // Add refresh rule
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off', // Not needed with modern React/Vite
      'react/prop-types': 'off', // Often disabled in modern projects, good default
      'no-unused-vars': ['warn', { args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: '^[A-Z_]' }],
    },
  },
];