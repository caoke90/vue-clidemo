#!/bin/bash

## runing single test file
# fanyi.baidu.com/#en/zh/
# https://github.com/karma-runner/karma/issues/553

if [ -f $2 ]; then
   single=""
else
   single="--single-run"
fi

function do_test(){
	KARMA_SPECS="$1" npx karma start ${single}
}

if [ "test" = "$1" ]; then
	find $PWD/test -name '*.js' | while read line
	do
		do_test $line
	done
else
	do_test $1
fi
