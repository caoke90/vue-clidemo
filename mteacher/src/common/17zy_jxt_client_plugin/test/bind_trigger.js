import {NOOP, build_trigger_name} from '../src/tools.js';
import bind_trigger from '../src/bind_trigger.js';

let init_vox = ()=>{
	window.vox = {
		task : {},
		_task : {}
	};
};

let trigger_event = (method, data, use_event = false)=>{
	if(use_event === 'ALL'){
		trigger_event(method, data);
		trigger_event(method, data, true);

		return ;
	}
	if(use_event){
		window.document.dispatchEvent(
			new CustomEvent(build_trigger_name(method), {detail : [data]})
		);

		return ;
	}

	try{
		window.vox.task[method](data);
	}catch(e){
	}
};

describe('bind_trigger spec', ()=>{
	beforeEach(()=>{
		init_vox();
	});

	describe('params validity', ()=>{
		let error_msg = 'method must be String, and cb must be Function';

		it('Test : when no method and cb param, should be throw error', ()=>{
			expect(()=>{
				bind_trigger();
			}).toThrowError(error_msg);
		});

		it('Test : when the method param is not string, should be throw error', ()=>{
			expect(()=>{
				bind_trigger(123);
			}).toThrowError(error_msg);
		});

		it('Test : when the cb param is not function, should be throw error', ()=>{
			expect(()=>{
				bind_trigger('test', 123);
			}).toThrowError(error_msg);
		});
	});

	it('Test : when the return data is map json, should be parsed', done=>{
		// XXX it 跟 describe 是同步执行的
		let method = 'abcd',
			cb_data = {
				a : 1
			};

		bind_trigger(method, (res)=>{
			expect(res).toEqual(cb_data);
			let method = 'abcde';

			bind_trigger(method, _res=>{
				expect(_res).toEqual(cb_data);

				let method = 'uio';

				bind_trigger(method, (t_res)=>{
					expect(t_res).toEqual(cb_data);
					done();
				});

				trigger_event(method, JSON.stringify(cb_data), 'ALL');
			});

			trigger_event(method, JSON.stringify(cb_data));
		});

		setTimeout(trigger_event, 66, method, JSON.stringify(cb_data), true);
	});

	describe('has spec', ()=>{
		it('Test : has spec', ()=>{
			let cb = ()=>{},
				method = 'ijnk',
				method1 = 'abc';

			bind_trigger(method, cb);
			bind_trigger(method1, ()=>{});

			expect(bind_trigger.has(method1)).toBeTruthy();
			expect(bind_trigger.has('adfdssf')).toBeFalsy();
			expect(bind_trigger.has(method, cb)).toBeTruthy();
			expect(bind_trigger.has(method, ()=>{})).toBeFalsy();
		});
	});

	describe('remove spec', ()=>{
		it('Test : remove all of the method spec will be ok', ()=>{
			let method = 'abc';

			bind_trigger(method, ()=>{});
			bind_trigger(method, ()=>{});

			bind_trigger.remove(method);
			expect(bind_trigger.has(method)).toBeFalsy();
		});

		it('Test : remove method and cb spec will be ok', ()=>{
			let method = 'abc';

			bind_trigger(method, NOOP);
			bind_trigger(method, ()=>{});

			bind_trigger.remove(method, NOOP);
			expect(bind_trigger.has(method)).toBeTruthy();

			bind_trigger.remove(method, ()=>{});
			expect(bind_trigger.has(method)).toBeTruthy();
		});

		it('Test : remove method with itself will be ok', ()=>{
			let method = 'abc_itself';

			let a = bind_trigger(method, NOOP);

			a.remove();

			expect(bind_trigger.has(method)).toBeFalsy();
		})
	});

	describe('once param', ()=>{
		let method = 'abc',
			cb_data = 'test';

		it('Test : when the once is RANDOM should be ok', done=>{
			bind_trigger(method, (res)=>{
				// RANDOM 强制走 trigger
				expect(window.vox.task[method]).toBeUndefined();
				expect(res).toBe(cb_data);
				done();
			}, 'RANDOM');

			setTimeout(trigger_event, 66, method, cb_data, true);
		});

		it('Test : when the once is true, shoud be ok', done=>{
			bind_trigger(method, (res)=>{
				expect(res).toBe(cb_data);
				expect(typeof window.vox.task[method]).toBe('function');
				done();
			}, true);

			setTimeout(trigger_event, 66, method, cb_data);
		});

		it('Test : when the once is true, shoud only regigest and execute once', done=>{
			let test = 0;

			bind_trigger(method, (res)=>{
				expect(window.vox.task[method]).not.toBeUndefined();

				test++;

				trigger_event(method, cb_data);
				trigger_event(method, cb_data);

				setTimeout(()=>{
					expect(test).toBe(1);

					// 测试肯定走的是 trigger 因为trigger先调用的
					expect(window.vox.task[method]).toBe(NOOP);

					done();
				}, 88);
			}, true);

			setTimeout(trigger_event, 66, method, cb_data);
		});
	});
});
