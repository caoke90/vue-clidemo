/**
 * @author junlin.yan
 * @date 2018/11/22
 * @description 视频相关方法封装
 *
 * http://wiki.17zuoye.net/pages/viewpage.action?pageId=30311912
 */

import {hasExternal, doExternal} from './call';

/**
 * 播放视频接口
 * @param {Object} params
 * @param {array}  params.urlList 必填，视频地址（多个cdn线路），数组
 * @param {string} params.header 当视频通过ip播放时需要在header中加host
 * @param {string} params.title 视频标题
 * @param {string} params.placeholderImageUrl 视频图片
 * @param {boolean} params.isSavePlayProgress 是否保存播放进度 默认true
 * @param {number} params.voiceDubbingType 配音模式 1:播放原始视频  2：开始配音播放 3:播放预览视频 (学生端2.9.10)
 * @param {boolean} params.fullScreen true:全屏 false：非全屏 (学生端2.9.10)
 * @param {string} params.backMusicUrl 视频的背景音 (学生端2.9.10)
 * @param {string} params.id 整个题目的ID  (2.9.10学生端)
 * @param {boolean} params.isDraggable 视频是否可以拖拽 (学生端3.0.2)
 * @param {string} params.unDraggableToast 当视频不可以拖拽的时候，用户拖拽了弹的toast文字 (学生端3.0.2)
 */
export function playerVideo(params) {
  if (hasExternal('playerVideo')) {
    let _params = JSON.stringify(params);
    doExternal('playerVideo', _params);
  } else {
    console.log('[no external] playerVideo----->params: ' + params);
  }
}
