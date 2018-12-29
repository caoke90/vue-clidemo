import {build_trigger_name, NOOP, parse, lock_obj, parse_params, is_type} from '../src/tools.js';

describe('parse spec', ()=>{
	it('Test : when the param is not string, should be return the original param', ()=>{
		[
			{a : 1},
			[1],
			true,
			new Date(),
			Symbol(),
			1,
			new Map(),
			new Set(),
			undefined,
			null
		].forEach(v=>{
			expect(parse(v)).toBe(v);
		});
	});

	it('Test : when the param is normal string, should be return the original string', ()=>{
		var test = 'abc';

		expect(parse(test)).toBe(test);
	});

	it('Test : when the param is boolean string, should be return the parsed Boolean', ()=>{
		[true, false].forEach(v=>{
			expect(parse(JSON.stringify(v))).toEqual(v);
		});
	});

	it('Test : when the param is json string, should be return the parsed object', ()=>{
		[{a:1}, [1,2,3]].forEach(v=>{
			expect(parse(JSON.stringify(v))).toEqual(v);
		});
	});

	it('Test : when the param is string number, should be return the string', ()=>{
		var test = '123';

		expect(parse(test)).toEqual(test);
	});
});

describe('lock_obj spec', ()=>{
	it('Test : when the function is called multiple times for the same param, should be no throw exception', ()=>{
		var test = {};

		expect(lock_obj(test, 'a', 1)).toBeUndefined();

		expect(test.a).toBe(1);

		expect(()=>{
			lock_obj(test, 'a', 1);
		}).not.toThrow();

		expect(()=>{
			lock_obj(test, 'a', 2);
		}).not.toThrow();

		expect(test.a).toBe(1);

		expect(()=>{ // TODO: 仅仅在严格模式下才会报错
			test.a = 2;
		}).toThrow();

		expect(()=>{
			delete test.a;
		}).toThrow();
	});

	it('Test : when the object is defined should be can modify and ok', ()=>{
		var test = {
			a : 1
		};

		expect(lock_obj(test, 'a', 1)).toBeUndefined();

		expect(test.a).toBe(1);

		expect(()=>{
			test.a = 2;
		}).toThrow();
	});
});

describe('is_type spec', ()=>{
	it('Test : when the param is normal should be ok', ()=>{
		expect(is_type('1', 'String')).toBe(true);
		expect(is_type([], 'Array')).toBe(true);
		expect(is_type({}, 'Object')).toBe(true);

		expect(is_type('1', 'number')).toBe(false);
	});
});

describe('build_trigger_name spec', ()=>{
	it('TEST : build_trigger_name function should be return undefined', ()=>{
		expect(build_trigger_name('abc')).toBe('_17m.abc');
	});
});

describe('NOOP spec', ()=>{
	it('TEST : NOOP function should be return undefined', ()=>{
		expect(NOOP()).toBeUndefined();
	});

	it('TEST : NOOP function should be do nothing', ()=>{
		expect(NOOP.toString()).toBe('()=>{}');
	});
});

describe('parse_params spec', ()=>{
	var keys = ['METHOD', 'OBJ_PARAM', 'FN_PARAM', 'ELSE'];

	var cb_action = ['METHOD', 'OBJ_PARAM', 'FN_PARAM', 'ELSE'].reduce((prev, key)=>{
		prev[key] = ()=>key;

		return prev;
	}, {});

	it('Test : when the param is single and the first param is Object, should be ok', ()=>{
		expect(parse_params([{a : 1}], cb_action)).toBe(keys[0]);
	});

	it('Test : when the 2st param is Object, should be ok', ()=>{
		expect(parse_params(['getInitParams', {}], cb_action)).toBe(keys[1]);
	});

	it('Test : when the 2st param is Function, should be ok', ()=>{
		expect(parse_params(['getInitParams', function(){}], cb_action)).toBe(keys[2]);
	});

	describe('parse_params multi params', ()=>{
		var test_obj;

		beforeEach(()=>{
			test_obj = cb_action;
		});

		it('Test : when the param is multi params and the first param is no true data, should be ok', ()=>{
			test_obj.ELSE = (method, param, cb)=>{
				expect(method).toBe('abc');
				expect(param).toEqual([0, 2, 3]);
				expect(cb).toBeUndefined();

				return keys[3];
			};

			expect(parse_params(['abc', 0, 2, 3], cb_action)).toBe(keys[3]);
		});

		it('Test : when the param is multi params, should be ok', ()=>{
			test_obj.ELSE = (method, param, cb)=>{
				expect(method).toBe('getInitParams');
				expect(param).toEqual([1, 2, 3]);
				expect(cb).toBeUndefined();

				return keys[3];
			};

			expect(parse_params(['getInitParams', 1, 2, 3], cb_action)).toBe(keys[3]);
		});

		it('Test : when the param is multi params and last param is function, should be ok', ()=>{
			var test_fn = ()=>{};

			test_obj.ELSE = (method, param, cb)=>{
				expect(method).toBe('getInitParams');
				expect(param).toEqual([1, 2, 3]);
				expect(cb).toBe(test_fn);

				return keys[3];
			};

			expect(parse_params(['getInitParams', 1, 2, 3, test_fn], cb_action)).toBe(keys[3]);
		});
	});
});
