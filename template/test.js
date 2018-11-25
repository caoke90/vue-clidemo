const fs=require('fs')
const cssText=fs.readFileSync('./test.css').toString()

//css 选择器部分 结构
function cssWrap() {
    // 构造函数窃取
    Array.prototype.push.apply(this,arguments);
}
cssWrap.prototype=Object.create(Array.prototype);
cssWrap.prototype.constructor=cssWrap;

//css 属性部分 结构
function cssNature() {
    // 构造函数窃取
    Array.prototype.push.apply(this,arguments);
}
cssNature.prototype=Object.create(Array.prototype);
cssNature.prototype.constructor=cssNature;

const analysis={
    init(cssText){

        this.map=[]
        //添加计数
        this.numCssText=this.addNum(cssText)
        // 生成中间结构
        this.map=this.productMiddle(this.numCssText)
        this.natureMap(this.map)

        this.commonCss=this.map.filter(function (item) {

            return ['html','body'].indexOf(item[0])>-1

        })
        // console.log(this.commonCss)

    },
    natureMap(map){
        map.forEach((arr)=>{
            if(arr[1] instanceof cssWrap){
                this.natureMap(arr[1])
            }else{

                arr[1]=this.productNatureMiddle(arr[1])

            }
        })
    },
    // 生成中间结构
    productMiddle(numCssText){
        const map=new cssWrap()
        numCssText.replace(/([%@\(\)\w \.:,\-\#\[\]\*]+)(`\d+)\{(.+?)\2\}/g, (m,p1,p2,p3) =>{
            if(/`\d+\{/.test(p3)){
                p3=this.productMiddle(p3)
            }
            map.push(new cssWrap(p1,p3))
        })
        return map;
    },
    // 生成css属性 中间结构
    productNatureMiddle(numCssText){
        const map=new cssNature()
        const cache={}
        let num=0;
        //暂存
        numCssText=numCssText.replace(/\(.+?\)/g, (m) =>{
            num++
            cache[num]=m
            return '`'+num+'`';
        })
        // console.log(numCssText)
        numCssText.replace(/([\w-]+):([^;]+);?/g, (m,p1,p2) =>{
            //取出暂存内容
            p2=p2.replace(/`(\d)`/,function (mo,po1) {
                return cache[po1]
            })
            map.push([p1,p2])
        })
        // console.log(map)
        return map;
    },
    //计数转化
    addNum(cssText){
        let num=0;
        return cssText.replace(/[{}]/g,function (m) {
            if(m=='{'){
                return '`'+(++num)+m;
            }else{
                return '`'+(num--)+m;
            }

        })
    },
    //移除计数
    removeAddNum(cssText){
        return cssText.replace(/`\d+/g,'')
    }
}

analysis.init(cssText)
fs.writeFileSync('./cssText.css',cssText)