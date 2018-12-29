import external_lib from '../src/external.js';

const default_external = {getInitParams(){}};

describe('external spec', ()=>{
	window.external = default_external;

	let {check_external, do_external} = external_lib();

	describe('getInitParams params', ()=>{
		it('Test getInitParams accept json, should be ok', ()=>{
			var test = {a:1};

			window.external.getInitParams = arg=>{
				expect(arg).toBe(JSON.stringify(test));
			};

			do_external('getInitParams', test);
			do_external({
				method : 'getInitParams',
				param : test
			});
		});

		it('Test getInitParams accept multiple params(include no param), should be ok and the getInitParams arguments’length is passed params’length', done=>{
			[()=>{
				window.external.getInitParams = (...args)=>{
					expect(args.length).toBe(0);

					return 0;
				};
			}, ()=>{
				window.external.getInitParams = (...args)=>{
					expect(args.length).toBe(6);

					return 0;
				};
			}].forEach((v, i)=>{
				let num = i * 3,
					params = [...new Array(num)].map((v, i)=>i+1);

				window.external.getInitParams = (...args)=>{
					if(args[0] === undefined){
						args.shift();
					}

					expect(args.length).toBe(num);

					return 0;
				};

				do_external('getInitParams', ...params);

				do_external('getInitParams', ...params, res=>{
					expect(res).toBe(0);
				});
			});

			done();
		});
	});

	describe('getInitParams return', ()=>{
		var test_val = {a:1, b:2};

		beforeEach(()=>{
			window.external.getInitParams = ()=>JSON.stringify(test_val);
		});

		afterEach(()=>{
			window.external = default_external;
		});

		it('Test getInitParams return string should be parsed', (done)=>{
			do_external('getInitParams', (res)=>{
				expect(JSON.stringify(res)).toBe(JSON.stringify(test_val));
				done();
			});
		});

		it('Test getInitParams return object should be ok', (done)=>{
			window.external.getInitParams = ()=>test_val;

			do_external('getInitParams', (res)=>{
				expect(JSON.stringify(res)).toBe(JSON.stringify(test_val));
				done();
			});
		});

		it('Test getInitParams return string boolean should be parsed', (done)=>{
			window.external.getInitParams = ()=>"true";

			do_external('getInitParams', res=>{
				expect(res).toBe(true);
				done();
			});
		});

		it('Test getInitParams return boolean should be ok', (done)=>{
			window.external.getInitParams = ()=>true;

			do_external('getInitParams', res=>{
				expect(res).toBe(true);
				done();
			});
		});

		it('Test getInitParams return string number should be string', done=>{
			window.external.getInitParams = ()=>'123';

			do_external('getInitParams', res=>{
				expect(res).toBe('123');
				done();
			});
		});

		it('Test getInitParams return undefined should be ok', done=>{
			window.external.getInitParams = ()=>undefined;

			do_external('getInitParams', res=>{
				expect(res).toBeUndefined();
				done();
			});
		});
	});

	describe('check no methods', ()=>{
		it('Test check_external, should be ok', ()=>{
			check_external('getInitParams', res=>{
				expect(res).toBeTruthy();
			});

			check_external('abcejfhad', res=>{
				expect(res).toBeFalsy();
			});

			do_external('qwe', (res, msg)=>{
				expect(res).toBe(null);
				expect(msg).toBe('NO METHOD');
			});
		});
	});
});

describe('no external spec', ()=>{
	beforeEach(()=>{
		delete window.external;
	});

	it('Test no external for do_external, shoud be return null', done=>{
		let {do_external} = external_lib();

		do_external('qwe', (res, msg)=>{
			expect(res).toBe(null);
			expect(msg).toBe('NO EXTERNAL');

			done();
		});
	});

	it('Test no external for check_external, shoud be return false', done=>{
		let {check_external} = external_lib();

		check_external('qwe', res=>{
			expect(res).toBeFalsy();
			done();
		});
	});

	it('Test window.external builded in 300ms, should be ok', done=>{
		let {check_external, do_external} = external_lib();

		setTimeout(()=>{
			window.external = default_external;
		}, 166);

		check_external('abcde', res=>{
			expect(res).toBeFalsy();

			do_external('qwe', (res, msg)=>{
				console.log(msg);
				expect(res).toBe(null);
				expect(msg).toBe('NO METHOD');

				done();
			});
		});
	});
});
