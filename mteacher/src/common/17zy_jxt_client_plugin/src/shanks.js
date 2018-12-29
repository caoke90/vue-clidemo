/*eslint-disable no-console*/
/**
* 客户端 h5交互逻辑
* @module dependes/client_plugin
* @author rambo <luwei.li@17zuoye.com>
*/

import {lock_obj, is_type} from './tools.js';
import external_lib from './external.js';
import wkwebview_lib, {support_wk_webview} from './wkwebview.js';
import bind_trigger from './bind_trigger.js';

var WIN = window;

if(is_type(WIN.vox, 'Object')){
	WIN.vox.task || (WIN.vox.task = {});
}else{
	WIN.vox = { task : { }};
}

// TODO 因为目前还未能全面禁止vox 因此暂且放开
//lock_obj(WIN, 'vox', WIN.vox);
//lock_obj(WIN.vox, 'task', WIN.vox.task);

lock_obj(WIN.vox, '_task', {});

let {do_external, check_external} = support_wk_webview() ? wkwebview_lib() : external_lib();

/**
 * @exports
 * @namespace
 * @prop {Function}  do_external    - 用于调用客户端方法, 并接受客户端返回
 * @prop {Function}  bind_trigger   - 用于生成监听客户端回掉函数 eg: playAudio  load 等.
 *
 */
let methods = {
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
	do_external,

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
	bind_trigger,

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
	check_external
};

for(let key in methods){
	if(methods.hasOwnProperty(key)){
		lock_obj(WIN, key, methods[key]);
	}
}

export default methods;
export {do_external, bind_trigger, check_external};

// vim: set ts=4
// vim: set noexpandtab
