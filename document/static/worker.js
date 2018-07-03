
importScripts('axios.min.js');
//worker.js
onmessage =function (evt){

  init('a.html').then(function (resp) {
    postMessage(resp)
  })
}
/*
初始化
*/
async function init(url){
  var resp=await geturl(url)
  console.log(resp.data)
  var regArr=[
    /地址】(.+?)(<|&)/u,
    /时间】(.+?)(<|&)/u,
    /姓名】(.+?)(<|&)/u,
    /籍贯】(.+?)(<|&)/u,
    /年齡】(.+?)(<|&)/u,
    /三围】(.+?)(<|&)/u,
    /环境】(.+?)(<|&)/u,
    /项目】(.+?)(<|&)/u,
    /价格】(.+?)(<|&)/u,
    /细节】(.+?)(<|&)/u,
  ]
  var obj={

  }
  regArr.forEach(function (regexp) {
    resp.data.replace(regexp,function (m,p1) {
      console.log(clearStr(p1))
    })
  })

  return 'ok';
}
/*
  清除汉字中的特殊字符
*/
function clearStr(str){
  return str.replace(/&nbsp;/g,'').replace(/[&\|\\\*^%$#@\-：]/g,"");
}
/*
处理请求异常
 */
async function geturl(url){
  var resp=await axios.get(url)
  return resp;
}
