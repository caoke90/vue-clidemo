;(function(){
if('do_external' in window){return}
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
Array.from||(Array.from=function(){var a=Object.prototype.toString,b=function(b){return"function"==typeof b||"[object Function]"===a.call(b)},c=function(a){var b=Number(a);return isNaN(b)?0:0!==b&&isFinite(b)?(b>0?1:-1)*Math.floor(Math.abs(b)):b},d=Math.pow(2,53)-1,e=function(a){var b=c(a);return Math.min(Math.max(b,0),d)};return function(a){var f,g,h,i,j,k,c=this,d=Object(a);if(null==a)throw new TypeError("Array.from requires an array-like object - not null or undefined");if(f=arguments.length>1?arguments[1]:void 0,"undefined"!=typeof f){if(!b(f))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(g=arguments[2])}for(h=e(d.length),i=b(c)?Object(new c(h)):new Array(h),j=0;h>j;)k=d[j],i[j]=f?"undefined"==typeof g?f(k,j):f.call(g,k,j):k,j+=1;return i.length=h,i}}());
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
* 对json字符串进行转换
* @description 因为有些字符串id是string的数字。为了保证id的格式 以及 防止大数字转换科学记数法 则只对object boolean做转换
* @param {String} json          - JSON 或 其他字符串
*
* @return {Object}        -  转换过后的数据
*/
var parse = function (json) {
	if (typeof json === 'string') {
		try {
			var parsed = JSON.parse(json),
			    type = typeof parsed === 'undefined' ? 'undefined' : _typeof(parsed);

			if (type === 'object' || type === 'boolean') {
				return parsed;
			}
		} catch (e) {}
	}

	return json;
};

var build_trigger_name = function build_trigger_name(method) {
	return '_17m.' + method;
};

/**
* 对object增加限制 不能写 不能遍历 不能删除
* @param {Object} obj     - 要操作的对象
* @param {string} key     - 要锁住的key
* @param {Object} value   - 值为多少
*
* @return {Object}        -  转换过后的数据
*/
var lock_obj = function lock_obj(obj, key, value) {
	try {
		Object.defineProperty(obj, key, {
			value: value,
			configurable: false,
			enumerable: false,
			writable: false
		});
	} catch (e) {}
};

/**
* 根据用户给定的类型查看obj是否是该类型
* @param {Object} obj        - 要判断的数据
* @param {String} type       - 判断的类型
*
* @return {Boolean}  - 是否是该类型
*/
var is_type = function is_type(obj, type) {
	return Object.prototype.toString.call(obj) === '[object ' + type + ']';
};

/**
* 根据参数类型找到对应的的函数形态并返回相应的调整过后的参数列表
* @param {Array} _args       - 参数列表
* @param {Object} cb_action  - 对应状态的行为
*
* @return {Object.method}  - 真正的方法名
* @return {Object.param}   - 真正的参数列表
* @return {Object.cb}      - 回调函数
*/
var parse_params = function parse_params(_args, cb_action) {
	var _args2 = _toArray(_args),
	    method = _args2[0],
	    param = _args2[1],
	    args = _args2.slice(2),
	    status = 'ELSE';

	if (is_type(method, 'Object')) {
		// You must use Object param when use this way;
		status = 'METHOD';
	} else if (is_type(param, 'Object')) {
		// param为object
		status = 'OBJ_PARAM';
	} else if (is_type(param, 'Function')) {
		// 无param
		status = 'FN_PARAM';
	} else {
		var cb = args[args.length - 1];

		if (is_type(cb, 'Function')) {
			param = [param].concat(_toConsumableArray(args.slice(0, -1)));
		} else {
			param === undefined || (param = [param].concat(_toConsumableArray(args)));
			cb = undefined;
		}

		args = cb;
	}

	return cb_action[status](method, param, args);
};

var NOOP = function NOOP() {};

var external_lib = function external_lib() {
	var do_external,
	    check_exists = function check_exists(name, cb) {
		switch (check_exists.done) {
			case 1:
				cb(name in window.external);
				break;
			case 0:
				cb(false);
				break;
			default:
				do_external("getInitParams", function (err, msg) {
					// 防止window.external 未注入 错误判断
					if (msg === "NO EXTERNAL") {
						check_exists.done = 0;
						check_exists(name, cb);
					} else {
						check_exists.done = 1;
						check_exists(name, cb);
					}
				});
		}
	};

	// 因为ios 在刷新或使用h5跳转的时候，会存在external加载时机的问题
	var queues = [];

	var _do_external = function _do_external() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		console.warn("NOT READY");
		queues.push(args);
	};

	var count = -1,
	    external_inter = void 0,
	    check_external = function check_external() {
		if (++count > 33) {
			_do_external = function _do_external(method, params, cb) {
				console.warn("NOT FOUND EXTERNAL METHOD");

				cb(null, "NO EXTERNAL");
			};

			clearInterval(external_inter);
		} else {
			try {
				window.external.getInitParams();

				clearInterval(external_inter);

				check_exists.done = 1;

				_do_external = function _do_external(method, params, cb) {
					check_exists(method, function (exists) {
						if (exists) {
							try {
								var _window$external;

								cb(parse((_window$external = window.external)[method].apply(_window$external, _toConsumableArray(params))));
							} catch (e) {
								cb(null, e);
							}

							return;
						}

						console.warn(method + ' DO NOT EXIST IN EXTERNAL');

						cb(null, "NO METHOD");
					});
				};
			} catch (e) {
				return;
			}
		}

		queues.forEach(function (args) {
			_do_external.apply(undefined, _toConsumableArray(args));
		});
	};

	external_inter = setInterval(check_external, 20);

	check_external();

	var to_stringify = function to_stringify(obj) {
		return obj ? [JSON.stringify(obj)] : [];
	};

	do_external = function do_external() {
		for (var _len2 = arguments.length, _args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			_args[_key2] = arguments[_key2];
		}

		var res = parse_params(_args, {
			METHOD: function METHOD(_method) {
				var method = _method.method,
				    param = _method.param,
				    cb = _method.cb;


				return {
					method: method,
					param: to_stringify(param),
					cb: cb
				};
			},
			OBJ_PARAM: function OBJ_PARAM(method, param, args) {
				return {
					method: method,
					param: to_stringify(param),
					cb: args[0]
				};
			},
			FN_PARAM: function FN_PARAM(method, param) {
				return {
					method: method,
					param: [],
					cb: param
				};
			},
			ELSE: function ELSE(method, param, cb) {
				return {
					method: method,
					param: param || [],
					cb: cb
				};
			}
		});

		var method = res.method,
		    param = res.param,
		    _res$cb = res.cb,
		    cb = _res$cb === undefined ? NOOP : _res$cb;


		_do_external(method, param, cb);
	};

	do_external.type = 'EXTERNAL';

	return { check_external: check_exists, do_external: do_external };
};

var DOC = document;

var remove_event = DOC.removeEventListener.bind(DOC);
var add_event = DOC.addEventListener.bind(DOC);

var events = {};
var has = function has(method) {
	return Array.isArray(events[method]);
};
var remove = function remove(val) {
	remove_event(val._method, val.build);
};
var clean = function clean(method) {
	events[method] = null;
};

var bind_trigger = function bind_trigger(method, cb, once) {
	if (!(is_type(method, 'String') && is_type(cb, 'Function'))) {
		throw new TypeError('method must be String, and cb must be Function');
	}

	var _trigger_cb2,
	    _cb = function _cb(args) {
		args[0] = parse(args[0]);

		cb.apply(undefined, _toConsumableArray(args));
	},
	    _method = build_trigger_name(method);

	if (once === 'RANDOM') {
		_trigger_cb2 = function trigger_cb(event) {
			_cb(event.detail);

			remove_event(event.type, _trigger_cb2);
		};

		add_event(_method, _trigger_cb2);

		return;
	}

	if (!(this instanceof bind_trigger)) {
		return new bind_trigger(method, cb, once);
	}

	var _window$vox = window.vox,
	    task = _window$vox.task,
	    _task = _window$vox._task,
	    z_cb = function z_cb(type, args) {
		if (_task[method] === undefined) {
			_task[method] = type;
		}

		_task[method] === type && _cb(args);
	};

	_trigger_cb2 = function _trigger_cb(event) {
		once && remove_event(event.type, _trigger_cb2);
		z_cb('TRIGGER', event.detail);
	};

	task[method] = function () {
		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		// 如果参数为多参数，则传给H5一个数组

		once && (task[method] = NOOP);

		z_cb('VOX', args);
	};

	this.method = method;
	this.cb = cb;

	add_event(_method, _trigger_cb2);

	events[method] || (events[method] = []);

	events[method].push({
		origin: cb,
		_method: _method,
		build: _trigger_cb2
	});
};

bind_trigger.has = function (method, cb) {
	return has(method) && (typeof cb !== 'function' || events[method].some(function (_event) {
		return _event.origin === cb;
	}));
};

bind_trigger.remove = function (method, cb) {
	if (!has(method)) {
		return;
	}

	if (typeof cb === 'function') {
		if (events[method].reduce(function (count, val, index, self) {
			if (val.origin === cb) {
				remove(val);

				delete self[index];

				return count;
			}

			return ++count;
		}, 0) === 0) {
			clean(method);
		}

		return;
	}

	events[method].forEach(remove);

	clean(method);
};

bind_trigger.prototype.remove = function () {
	bind_trigger.remove(this.method, this.cb);
	this.remove = NOOP;
	this.method = this.cb = null;
};

var message_id = '_17m_external';

var wkwebview_lib = function wkwebview_lib() {
	/*
 let get_guid = ()=>'xx-xx-4x-yx-xx'.replace(/[xy]/g, c=>{
 	var r = Math.random() * 16 | 0;
 		return (c === 'x' ? r : (r & 0x3 | 0x8)).is_type(16);
 });
 */

	// 相邻Date.now() 会得到相同的时间戳
	var check_external = void 0,
	    guid = 0,
	    _do_external = function _do_external(method, param, cb) {
		var cb_name;

		if (cb) {
			var cb_id = 'SHAKS_' + ++guid;

			bind_trigger(cb_id, cb, 'RANDOM');

			cb_name = build_trigger_name(cb_id);
		}

		window.webkit.messageHandlers[message_id].postMessage({
			method: method,
			param: param,
			callback: cb_name
		});
	},
	    do_external = function do_external() {
		for (var _len4 = arguments.length, _args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			_args[_key4] = arguments[_key4];
		}

		var res = parse_params(_args, {
			METHOD: function METHOD(method) {
				return method;
			},
			OBJ_PARAM: function OBJ_PARAM(method, param, args) {
				return {
					method: method,
					param: param,
					cb: args[0]
				};
			},
			FN_PARAM: function FN_PARAM(method, param) {
				return {
					method: method,
					cb: param
				};
			},
			ELSE: function ELSE(method, param, cb) {
				return {
					method: method,
					param: param && param.reduce(function (prev, curr, index) {
						// 这里之因为不传真数组，因客户端还需要判断重载函数以及解析类型还需判断，所以在js这里将Array to Map
						prev[index] = curr;

						return prev;
					}, {}),
					cb: cb
				};
			}
		});

		var method = res.method,
		    param = res.param,
		    cb = res.cb;


		if (cb) {
			check_external(method, function (_res) {
				if (!_res) {
					console.warn(method + ' DO NOT EXIST IN EXTERNAL');

					cb(null, 'NO METHOD');

					return;
				}

				_do_external(method, param, cb);
			});
		} else {
			_do_external(method, param);
		}
	};

	var check_external_name = 'methodExists';

	check_external = function check_external(name, cb) {
		if (name === check_external_name) {
			cb(true);

			return;
		}

		_do_external(check_external_name, { name: name }, function (res) {
			cb(res.exist);
		});
	};

	do_external.type = 'WK';

	return { check_external: check_external, do_external: do_external };
};

// http://wiki.17zuoye.net/pages/viewpage.action?pageId=31938486
var support_wk_webview = function support_wk_webview() {
	try {
		window.webkit.messageHandlers[message_id].postMessage;

		return true;
	} catch (e) {
		return false;
	}
};

/*eslint-disable no-console*/
/**
* 客户端 h5交互逻辑
* @module dependes/client_plugin
* @author rambo <luwei.li@17zuoye.com>
*/

var WIN = window;

if (is_type(WIN.vox, 'Object')) {
	WIN.vox.task || (WIN.vox.task = {});
} else {
	WIN.vox = { task: {} };
}

// TODO 因为目前还未能全面禁止vox 因此暂且放开
//lock_obj(WIN, 'vox', WIN.vox);
//lock_obj(WIN.vox, 'task', WIN.vox.task);

lock_obj(WIN.vox, '_task', {});

var _ref = support_wk_webview() ? wkwebview_lib() : external_lib(),
    do_external = _ref.do_external,
    check_external = _ref.check_external;

/**
 * @namespace
 * @prop {Function}  do_external    - 用于调用客户端方法, 并接受客户端返回
 * @prop {Function}  bind_trigger   - 用于生成监听客户端回掉函数 eg: playAudio  load 等.
 *
 */


var methods = {
	/**
 * 用于调用客户端方法, 并接受客户端返回
 * @global
 * @param {(String | Object)} method  - 要调用方法的名称
 *  @param {String} method.method      - 要调用方法的名称
 *  @param {Object} method.param       - 调用方法所需的参数
 *  @param {Function} method.cb  - 回调函数
 * @param {String | Object} [...param]  - 调用方法所需的参数
 * @param {Function} [ cb ]        - 回调函数
 *
 * @example
 * // 多参数形式  TODO 该方法仅仅适用于兼容老方法。对于wkwebview方法不适合改调用方式。 并且建议以后方法都使用Object来传递
 * do_external('xxx', 'param1', 'param2', ... , ()=>{});
 * @example
 * // 参数Object形式
 * do_external('xxx', {id: 1, name : 'rambo'}, ()=>{});
 * @example
 * // 单参数形式  TODO 使用单参数形式 其中的param 必须为 Object格式
 * do_external({method : 'xxx', param : {a:1, b:2}, cb : ()=>{});
 * @example
 * // 单参数形式 无cb
 * do_external({method : 'xxx', param : {a:1, b:2});
 */
	do_external: do_external,

	/**
 * 用于生成监听客户端回掉函数 eg: playAudio  load 等. http://wiki.17zuoye.net/pages/viewpage.action?pageId=31936626
 * @global
 * @param {String} method          - 要监听方法的名称
 * @param {Function} cb            - 回调函数
 * @param {Boolean} [once = false] - 回调函数
 *
 * @example
 * bind_trigger('load', (...args)=>{
 *     if(args.length === 1){  // 返回就一个值 eg: true || Object
 *
 *     }else{                  // TODO 返回多个值的 返回多个值的 将会以数组形式给予。使用注意。 例如: playAudioProgress 返回的其实是 [url, status, currentTime, duration];
 *
 *     }
 * });
 *
 * @example
 * bind_trigger('load', ()=>{}, once); 只监听一次
 *
 */
	bind_trigger: bind_trigger,

	/**
 * 用于兼容wkwebview 检测某个客户端方法是否存在
 * @global
 * @param {String} name          - 要检测的方法名
 * @param {Function} cb          - 回调函数
 *
 * @return {Boolean} exist       - 是否存在
 *
 * @example
 * check_external('load', (exist)=>{true ? '存在' : '不存在'});
 */
	check_external: check_external
};

for (var key in methods) {
	if (methods.hasOwnProperty(key)) {
		lock_obj(WIN, key, methods[key]);
	}
}

// vim: set ts=4
// vim: set noexpandtab
}());
