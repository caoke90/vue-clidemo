module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
	"extends": [
		'eslint-config-airbnb-base',
		'eslint-config-airbnb-base/rules/strict'
	].map(require.resolve),
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-var": 0,
        "indent":[2,"tab"],
        "no-tabs":0,
        "no-alert":2,
        "no-console":2,
        "camelcase":0,
        "one-var":0,
        "no-param-reassign":0,
        "no-underscore-dangle":0,
        "vars-on-top":0,
        "no-mixed-operators":0,
        "prefer-const":0,
        "func-names":0,
        "quotes": [1, "single"],
        "import/extensions": 0,
        "consistent-return":0
    }
};
