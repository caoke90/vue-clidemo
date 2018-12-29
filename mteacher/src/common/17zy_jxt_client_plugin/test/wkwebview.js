import wkwebview_lib, {support_wk_webview} from '../src/wkwebview.js';

var {check_external, do_external} = wkwebview_lib();

var init_postmessage = cb=>{
		window.webkit = {
			messageHandlers : {
				_17m_external : {
					postMessage : cb
				}
			}
		};
	},
	trigger_event = (method, data)=>{
		window.document.dispatchEvent(
			new CustomEvent(method, {detail : [data]})
		);
	};

const check_external_name = 'methodExists';

describe('check_external spec', ()=>{
	const init_method = 'getInitParams';

	init_postmessage(arg=>{
		let {method, param, callback} = arg;

		trigger_event(callback, {exist : param.name === init_method});
	});

	it('Test check_external method is methodExists shoud be ok', ()=>{
		check_external(check_external_name, res=>{
			expect(res).toBeTruthy();
		});
	});

	it('Test getInitParams method, shoud be ok', done=>{
		check_external(init_method, res=>{
			expect(res).toBeTruthy();

			check_external('abc', res=>{
				expect(res).toBeFalsy();
				done();
			});
		});
	});
});

describe('do_external spec', ()=>{
	it('Test no cb call, shoule be ok', done=>{
		var _method = 'abc';

		init_postmessage(arg=>{
			let {method, param, callback} = arg;

			expect(method).toBe(_method);
			expect(callback).toBeUndefined();

			done();
		});

		do_external(_method);
	});

	it('Test method is not exist, should be ok', done=>{
		var _method = 'abc';

		init_postmessage(arg=>{
			let {method, param, callback} = arg;

			if(method === check_external_name){
				trigger_event(callback, {exist : false});
			}
		});

		do_external(_method, (res, msg)=>{
			expect(res).toBe(null);
			expect(msg).toBe('NO METHOD');
			done();
		});
	});

	it('Test when param is map, should be ok', done=>{
		var _method = 'abc',
			inc = 0;

		init_postmessage(arg=>{
			let {method, param, callback} = arg;

			expect(method).toBe(_method);
			expect(callback).toBeUndefined();

			++inc === 3 && done();
		});

		do_external(_method);
		do_external({method : _method});
		do_external(_method, {});
	});

	it('Test whe param is multi params, should be ok and accept like {1:a, 2:b}', done=>{
		var _method = 'abc';

		init_postmessage(arg=>{
			let {method, param, callback} = arg;

			expect(method).toBe(_method);
			expect(callback).toBeUndefined();
			expect(param).toEqual({
				0 : 'a',
				1 : 'b',
				2 : 'c'
			});

			done();
		});

		do_external(_method, 'a', 'b', 'c');
	});
});

describe('support_wk_webview spec', ()=>{
	it('Test when postMessage is exist, should return true', ()=>{
		delete window.webkit;
		init_postmessage(1);
		expect(support_wk_webview()).toBeTruthy();
		delete window.webkit;
		expect(support_wk_webview()).toBeFalsy();
		window.webkit = {messageHandlers: {}};
		expect(support_wk_webview()).toBeFalsy();
	});
});
