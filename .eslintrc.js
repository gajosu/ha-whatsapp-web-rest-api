module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: 'standard-with-typescript',
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
		project: './tsconfig.json'
	},
	rules: {
		'@typescript-eslint/indent': ['error', 4],
		// alow non-null assertion
		'@typescript-eslint/no-non-null-assertion': 'off',
		// allow space before function parentheses
		'space-before-function-paren': 'off',
		// allow Invalid type "any" of template literal expression
		'@typescript-eslint/restrict-template-expressions': 'off'
	}
}
