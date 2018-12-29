import {build_trigger_name, parse, is_type, NOOP} from './tools.js';

const DOC = document;

let remove_event = DOC.removeEventListener.bind(DOC),
	add_event = DOC.addEventListener.bind(DOC);

let events = {},
	has = method=>Array.isArray(events[method]),
	remove = val=>{
		remove_event(val._method, val.build);
	},
	clean = method=>{
		events[method] = null;
	};

let bind_trigger = function(method, cb, once){
	if(!(is_type(method, 'String') && is_type(cb, 'Function'))){
		throw new TypeError('method must be String, and cb must be Function');
	}

	var trigger_cb,
		_cb = args=>{
			args[0] = parse(args[0]);

			cb(...args);
		},
		_method = build_trigger_name(method);

	if(once === 'RANDOM'){
		trigger_cb = event=>{
			_cb(event.detail);

			remove_event(event.type, trigger_cb);
		};

		add_event(_method, trigger_cb);

		return ;
	}

	if(!(this instanceof bind_trigger)){
		return new bind_trigger(method, cb, once);
	}

	let {task, _task} = window.vox,
		z_cb = (type, args)=>{
			if(_task[method] === undefined){
				_task[method] = type;
			}

			_task[method] === type && _cb(args);
		};

	trigger_cb = event=>{
		once && remove_event(event.type, trigger_cb);
		z_cb('TRIGGER', event.detail);
	};

	task[method] = (...args)=>{
		// 如果参数为多参数，则传给H5一个数组

		once && (task[method] = NOOP);

		z_cb('VOX', args);
	};

	this.method = method;
	this.cb = cb;

	add_event(_method, trigger_cb);

	events[method] || (events[method] = []);

	events[method].push({
		origin : cb,
		_method,
		build  : trigger_cb
	});
};

bind_trigger.has = (method, cb)=>has(method) && (typeof cb !== 'function' || events[method].some(_event=>_event.origin === cb));

bind_trigger.remove = (method, cb)=>{
	if(!has(method)){
		return ;
	}

	if(typeof cb === 'function'){
		if(
			events[method].reduce((count, val, index, self)=>{
				if(val.origin === cb){
					remove(val);

					delete self[index];

					return count;
				}

				return ++count;
			}, 0) === 0
		){
			clean(method);
		}

		return ;
	}

	events[method].forEach(remove);

	clean(method);
}

bind_trigger.prototype.remove = function(){
	bind_trigger.remove(this.method, this.cb);
	this.remove = NOOP;
	this.method = this.cb = null;
}

export default bind_trigger;
