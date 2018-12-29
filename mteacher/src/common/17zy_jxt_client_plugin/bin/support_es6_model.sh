#!/bin/bash

### karma原生支持ES6 module
#https://github.com/karma-runner/karma/issues/2903

sed -i -e '/^var SCRIPT_TYPE/{n;n;n;s/$/\nSCRIPT_TYPE[".js"]="module";/;}' ./node_modules/karma/lib/middleware/karma.js

# support mobile orientation prop
#sed -i '1i\window.orientation=0;' ./node_modules/karma/static/context.js
#sed -i '1i\window.orientation=0;' ./node_modules/karma/static/debug.js

sed -i ':a;$!N;/window.__karma__.loaded()/s/.*(\n)/<script type="module">\1/;t;P;D' ./node_modules/karma/static/context.html
sed -i ':a;$!N;/window.__karma__.loaded()/s/.*(\n)/<script type="module">\1/;t;P;D' ./node_modules/karma/static/debug.html

sed -i '34d;36d' ./node_modules/jasmine-core/lib/jasmine-core/jasmine.js
