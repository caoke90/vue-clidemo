/**
* 对json字符串进行转换
* @description 因为有些字符串id是string的数字。为了保证id的格式 以及 防止大数字转换科学记数法 则只对object boolean做转换
* @param {String} json          - JSON 或 其他字符串
*
* @return {Object}        -  转换过后的数据
*/
let parse = json=>{
	if(typeof json === 'string'){
		try{
			let parsed = JSON.parse(json),
				type = typeof parsed;

			if(type === 'object' || type === 'boolean'){
				return parsed;
			}
		}catch(e){
		}
	}

	return json;
};

let build_trigger_name = method=>`_17m.${method}`;

/**
* 对object增加限制 不能写 不能遍历 不能删除
* @param {Object} obj     - 要操作的对象
* @param {string} key     - 要锁住的key
* @param {Object} value   - 值为多少
*
* @return {Object}        -  转换过后的数据
*/
let lock_obj = (obj, key, value)=>{
	try {
		Object.defineProperty(obj, key, {
			value,
			configurable : false,
			enumerable   : false,
			writable     : false
		});
	} catch (e){
	}
};

/**
* 根据用户给定的类型查看obj是否是该类型
* @param {Object} obj        - 要判断的数据
* @param {String} type       - 判断的类型
*
* @return {Boolean}  - 是否是该类型
*/
let is_type = (obj, type)=>Object.prototype.toString.call(obj) === `[object ${type}]`;

/**
* 根据参数类型找到对应的的函数形态并返回相应的调整过后的参数列表
* @param {Array} _args       - 参数列表
* @param {Object} cb_action  - 对应状态的行为
*
* @return {Object.method}  - 真正的方法名
* @return {Object.param}   - 真正的参数列表
* @return {Object.cb}      - 回调函数
*/
let parse_params = (_args, cb_action)=>{
	let [method, param, ...args] = _args,
		status = 'ELSE';

	if(is_type(method, 'Object')){ // You must use Object param when use this way;
		status = 'METHOD';
	}else if(is_type(param, 'Object')){ // param为object
		status = 'OBJ_PARAM';
	}else if(is_type(param, 'Function')){ // 无param
		status = 'FN_PARAM';
	}else{
		var cb = args[args.length - 1];

		if(is_type(cb, 'Function')){
			param = [param, ...args.slice(0, -1)];
		}else{
			param === undefined || (param = [param, ...args]);
			cb = undefined;
		}

		args = cb;
	}

	return cb_action[status](method, param, args);
};

let NOOP = function(){};

export {parse, lock_obj, parse_params, is_type, NOOP, build_trigger_name};
