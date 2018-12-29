import {NOOP, parse, parse_params} from './tools.js';

export default ()=>{
	var do_external,
		check_exists = (name, cb) => {
			switch (check_exists.done){
			case 1:
				cb(name in window.external);
				break;
			case 0:
				cb(false);
				break;
			default:
				do_external("getInitParams", (err, msg) => { // 防止window.external 未注入 错误判断
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
	const queues = [];

	let _do_external = (...args) => {
		console.warn("NOT READY");
		queues.push(args);
	};

	let count = -1,
		external_inter,
		check_external = () => {
			if (++count > 33) {
				_do_external = (method, params, cb) => {
					console.warn("NOT FOUND EXTERNAL METHOD");

					cb(null, "NO EXTERNAL");
				};

				clearInterval(external_inter);
			} else {
				try{
					window.external.getInitParams();

					clearInterval(external_inter);

					check_exists.done = 1;

					_do_external = (method, params, cb) => {
						check_exists(method, (exists) => {
							if(exists){
								try{
									cb(parse(window.external[method](...params)));
								}catch(e){
									cb(null, e);
								}

								return;
							}

							console.warn(`${method} DO NOT EXIST IN EXTERNAL`);

							cb(null, "NO METHOD");
						});
					};
				}catch(e){
					return;
				}
			}

			queues.forEach((args) => {
				_do_external(...args);
			});
		};

	external_inter = setInterval(check_external, 20);

	check_external();

	const to_stringify = obj => (obj ? [JSON.stringify(obj)] : []);

	do_external = (..._args)=>{
		let res = parse_params(_args, {
			METHOD : _method=>{
				let {method, param, cb} = _method;

				return {
					method,
					param: to_stringify(param),
					cb,
				};
			},
			OBJ_PARAM: (method, param, args) => ({
				method,
				param: to_stringify(param),
				cb: args[0],
			}),
			FN_PARAM: (method, param) => ({
				method,
				param: [],
				cb: param,
			}),
			ELSE: (method, param, cb) => ({
				method,
				param: param || [],
				cb,
			}),
		});

		const { method, param, cb = NOOP } = res;

		_do_external(method, param, cb);
	};

	do_external.type = 'EXTERNAL';

	return {check_external : check_exists, do_external};
};
