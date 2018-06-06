const child=require('child_process')
const exec = function (cmd) {
  var str=child.execSync(cmd)
  // console.log(str.toString())
  return str.toString();
};
/*获取线上版本tag*/
function getpretag(tagArr,postTag){
  var vision=postTag.split('.')[0]
  var preTag=postTag;
  for(let i=0;i<tagArr.length;i++){
    const tag=tagArr[i]
    if(tag.split('.')[0]!==vision){
      preTag=tag;
      break;
    }
  }
  return preTag;
}
/*获取待上线版本tag*/
function getposttag(tagArr){
  return tagArr[0]
}

var log;
if(exec('git branch').indexOf('* master')>-1){
  console.log("当前处于master分支，执行打包到cdn命令")

  var tagArr=exec('git tag').split('\n')
  tagArr=tagArr.filter(function (tag) {
    return /^v\d+\./i.test(tag)
  })
  tagArr.sort(function (p1,p2) {
    if(parseInt(/\d+/.exec(p1)[0])>parseInt(/\d+/.exec(p2)[0])){
      return -1;
    }else{
      return 1;
    }
  })
  const postTag=getposttag(tagArr);
  const preTag=getpretag(tagArr,postTag);


  exec('git checkout '+preTag)
  console.log('1、打包master分支，tag：'+preTag)
  log=exec('npm run build')
  console.log(log)

  exec('git checkout '+postTag)
  console.log('2、打包master分支，tag：'+postTag)
  log=exec('npm run build')
  console.log(log)

  exec('git checkout master')
  console.log('tag：'+preTag+"、"+postTag+"打包完成")

}
