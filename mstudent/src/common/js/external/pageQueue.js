/**
 * @author junlin.yan
 * @date 2018/11/22
 * @description pageQueue系列，这些方法原来是学生端的，后来才加到老师端
 *
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311914
 */

import {hasExternal, doExternal} from './call';
import {joinQueryParams, wrapHost} from '../utils/URLUtils';
import {extend, platform, compareVersion, parseJson} from '../utils';
import {getInitParams} from './index';

/** 页面跳转队列 */
const pageQueue = [];
const pageManager = {};

pageManager.navigateTo = function (params) {
  console.log("APP执行本地页面跳转");
  let name = params.name;
  let url = params.url;
  let initParams = params.initParams;
  // 记录队列
  let queue = {
    url: url,
    name: name,
    initParams: initParams
  };
  pageQueue.push(queue);
  // 获取初始参数
  let oriInitParams = getInitParams();
  // 解析JSON字符串
  if (initParams == null) {
    initParams = {};
  } else {
    initParams = parseJson(initParams);
  }
  // 连接两部分参数
  let ultiParams = extend(oriInitParams, initParams);
  // 转换为url
  let newUrl = joinQueryParams(wrapHost(url, window.location.origin, true), ultiParams);
  // 跳转
  window.location.replace(newUrl);
};

pageManager.navigateBack = function (params) {
  console.log("APP执行本地页面回退");
  let step = params.step;
  let index = params.index;
  let name = params.name;
  let url = params.url;
  let initParams = params.initParams;

  let to = null;
  let length = pageQueue.length;
  if (name != null) {
    for (let i = 0; i < length; i++) {
      let temp = pageQueue[i];
      if (temp.name == name) {
        to = temp;
        pageQueue.splice(i + 1);
        break;
      }
    }
  } else if (index >= 0 && index < length) {
    to = pageQueue[index];
    pageQueue.splice(index + 1);
  } else if (step > 0 && step < length) {
    to = pageQueue[length - step - 1];
    pageQueue.splice(length - step);
  }

  if (to != null) {
    // 记录队列
    if (url != null) {
      to.url = url;
    }
    if (initParams != null) {
      to.initParams = initParams;
    }
    // 获取初始参数
    let oriInitParams = getInitParams();
    // 解析JSON字符串
    if (to.initParams == null) {
      initParams = {};
    } else {
      initParams = parseJson(to.initParams);
    }
    // 连接两部分参数
    let ultiParams = extend(oriInitParams, initParams);
    // 转换为url
    let newUrl = joinQueryParams(wrapHost(to.url, window.location.origin, true), ultiParams);
    // 跳转
    window.location.replace(newUrl);
  }
};

/**
 * 页面队列-打开新页面
 * @param {Object} params
 * @param {string} params.url 页面地址
 * @param {string} params.pageCategory 新页面的类型，暂时只有两种："homework"和"feedback"，如果是"homework"，在菜单中显示反馈，否则不显示
 * @param {string} params.name 名称，必须保证在队列中的唯一性
 * @param {boolean} params.isRead 是否是语音应用
 * @param {string} params.useNewCore 新内核 (默认不传为“system”，“crossWalk", "wk") ("wk"是ios的新内核 ios 从2.9.2之后添加)
 * @param {boolean} params.fullScreen 是否全屏
 * @param {string} params.initParams 附加参数，新打开的页面中调用getInitParams()的时候需要返回的值，json字符串
 * @param {boolean} params.closeHelp 是否关闭帮助按钮（2.8.0）
 * @param {string} params.quitMsg 关闭当前页面时候提示文案（2.8.1）,json字符串
 * @param {string} params.closeBtn 关闭按钮的位置。参数如下(2.9.2学生端支持)
 * @param {string} params.closeBtn.position 支持：“topLeft”,"topRight"
 * @param {string} params.closeBtn.iconUrl icon的地址，地址为绝对路径，图片区域为固定大小（35*35）
 * @param {string} params.closeBtn.positionY 按钮居上的边距（针对模考ios传28）
 *
 */
export function pageQueueNew(params) {
  if (!params) {
    throw new Error('非法调用pageQueueNew,参数个数错误');
  }
  if (hasExternal('pageQueueNew')) {
    if (params.url) {
      params.url = joinQueryParams(params.url, {v: new Date().getTime()});
    }
    if (platform() == 'android') {
      let initParams = getInitParams();
      let appVersion = initParams.system_version || '0.0.0';
      let compareRes = compareVersion(appVersion, '6.1');
      if (compareRes <= 0) {
        params.useNewCore = 'crossWalk';
      }
    }
    let _params = JSON.stringify(params);
    doExternal('pageQueueNew', _params);
  } else {
    console.log('[no external] pageQueueNew----->params: ' + params);
    pageManager.navigateTo(params);
  }
}

/**
 * 页面队列-后退, 优先级：name > index > step  （正常情况中三者互斥）如果没有index也没有name（或找不到指定name），则默认后退一步
 * @param {Object} params
 * @param {number} params.step 后退的步数,step=0，表示直接替换掉当前的页面
 * @param {number} params.index 目标页面的索引
 * @param {string} params.name 目标页面的名称（优先级3）
 * @param {string} params.url 如果传入了，则目标页面要加载这个新的url
 * @param {string} params.pageCategory 新页面的类型
 * @param {string} params.initParams 附加参数，json字符串
 * @param {boolean} params.needReloadPage 是否需要刷新页面
 * @param {boolean} params.needRefreshData 是否需要通知刷新数据（调用vox.refreshData()）
 *
 */
export function pageQueueBack(params) {
  if (!params) {
    throw new Error('非法调用pageQueueBack,参数个数错误');
  }
  if (hasExternal('pageQueueBack')) {
    if (params.url) {
      params.url = joinQueryParams(params.url, {v: new Date().getTime()});
    }
    let _params = JSON.stringify(params);
    doExternal('pageQueueBack', _params);
  } else {
    console.log('[no external] pageQueueBack----->params: ' + params);
    pageManager.navigateBack(params);
  }
}

/**
 * 页面队列-刷新, 如果传入了url，表示直接在当前页面加载新的url,没有传入则直接刷新, android pageQueueRefresh 参数为空，加载原有的地址
 * @param {Object} params
 * @param {string} params.url 如果传入了，则目标页面要加载这个新的url
 * @param {string} params.initParams 附加参数，json字符串
 * @param {boolean} params.hasLoadingBg 是否添加白色背景loading
 *
 */
export function pageQueueRefresh(params) {
  let url = null;

  params = params || {};
  // 初始化参数
  if (params.url) {
    url = joinQueryParams(params.url, {v: new Date().getTime()});
  }
  let initParams = extend(getInitParams(true), parseJson(params.initParams));
  let _params = {};

  if (url) {
    _params.url = url;
  }
  if (initParams) {
    _params.initParams = JSON.stringify(initParams);
  }

  if (hasExternal('pageQueueRefresh')) {
    _params = JSON.stringify(_params);
    doExternal('pageQueueRefresh', _params);
  } else {
    console.log('[no external] pageQueueRefresh----->params: ' + params);
    console.log('[no external] pageQueueRefresh----->_params: ' + _params);
    if (url) {
      url = joinQueryParams(params.url, initParams);
      window.location.replace(url);
    } else {
      window.location.reload();
    }
  }
}

/**
 * 页面队列-退出, 直接退出整个队列，相当于在root页面后退
 *
 */
export function pageQueueQuit() {
  if (hasExternal('pageQueueQuit')) {
    doExternal('pageQueueQuit');
  } else {
    console.log('[no external] pageQueueQuit');
    alert("已经正常退出到外壳");
  }
}
