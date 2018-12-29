import bind_trigger from './bind_trigger.js';
import {build_trigger_name, parse_params} from './tools.js';

const message_id = '_17m_external';

export default ()=>{
	/*
	let get_guid = ()=>'xx-xx-4x-yx-xx'.replace(/[xy]/g, c=>{
		var r = Math.random() * 16 | 0;

		return (c === 'x' ? r : (r & 0x3 | 0x8)).is_type(16);
	});
	*/

	// 相邻Date.now() 会得到相同的时间戳
	let check_external,
		guid = 0,
		_do_external = (method, param, cb)=>{
			var cb_name;

			if(cb){
				let cb_id = `SHAKS_${++guid}`;

				bind_trigger(cb_id, cb, 'RANDOM');

				cb_name = build_trigger_name(cb_id);
			}

			window.webkit.messageHandlers[message_id].postMessage({
				method,
				param,
				callback : cb_name
			});
		},
		do_external = (..._args)=>{
			let res = parse_params(_args, {
				METHOD : (method)=>method,
				OBJ_PARAM : (method, param, args)=>{
					return {
						method,
						param,
						cb : args[0]
					};
				},
				FN_PARAM : (method, param)=>{
					return {
						method,
						cb : param
					};
				},
				ELSE : (method, param, cb)=>{
					return {
						method,
						param : param &&
							param.reduce((prev, curr, index)=>{ // 这里之因为不传真数组，因客户端还需要判断重载函数以及解析类型还需判断，所以在js这里将Array to Map
								prev[index] = curr;

								return prev;
							}, {}),
						cb
					};
				}
			});

			let {method, param, cb} = res;

			if(cb){
				check_external(method, _res=>{
					if(!_res){
						console.warn(`${method} DO NOT EXIST IN EXTERNAL`);

						cb(null, 'NO METHOD');

						return ;
					}

					_do_external(method, param, cb);
				});
			}else{
				_do_external(method, param);
			}

		};

	const check_external_name = 'methodExists';

	check_external = (name, cb)=>{
		if(name === check_external_name){
			cb(true);

			return ;
		}

		_do_external(check_external_name, {name}, res=>{
			cb(res.exist);
		});
	};

	do_external.type = 'WK';

	return {check_external, do_external};
};

// http://wiki.17zuoye.net/pages/viewpage.action?pageId=31938486
export let support_wk_webview = ()=>{
	try{
		window.webkit.messageHandlers[message_id].postMessage;

		return true;
	}catch(e){
		return false;
	}
};
