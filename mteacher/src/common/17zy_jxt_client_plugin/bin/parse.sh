#!/bin/bash

#../node_modules/.bin/cat ../src/shanks.js
mkdir -p ./dist/

cat ./src/shanks.js  | sed '/export/d' > ./src/_cache.js

./node_modules/.bin/rollup ./src/_cache.js --output.format es --output.file ./dist/seed.js

./node_modules/.bin/babel ./dist/seed.js --presets=es2015 -o ./dist/seed.js

# 不想吐槽mac的sed了。 艹艹艹
seed_content=`cat ./dist/seed.js`
polyfill=`cat ./src/polyfill.js`
echo -e ";(function(){\nif('do_external' in window){return}\n${polyfill}\n""${seed_content}""\n}());" | cat > ./dist/seed.js

cat ./dist/seed.js | sed '/console/d' > ./dist/seed.min.js

./node_modules/.bin/uglifyjs ./dist/seed.min.js --compress --mangle -o ./dist/seed.min.js

/bin/rm -f ./src/_cache.js

