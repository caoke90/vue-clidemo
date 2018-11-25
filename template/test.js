const fs=require('fs')
const cssText=fs.readFileSync('./test.css').toString()

const analysis={
    init(cssText){

        this.map=[]
        //添加计数
        this.numCssText=this.addNum(cssText)
        // 生成中间结构
        this.map=this.producMiddle(this.numCssText)

        this.commonCss=this.map.filter(function (item) {
            console.log(item)
            return ['html','body'].indexOf(item[0])>-1

        })
        console.log(this.commonCss)

    },
    // 生成中间结构
    producMiddle(numCssText){
        const map=[]
        numCssText.replace(/([%@\(\)\w \.:,\-\#\[\]\*]+)(`\d+)\{(.+?)\2\}/g, (m,p1,p2,p3) =>{
            if(/`\d+\{/.test(p3)){
                p3=this.producMiddle(p3)
            }
            map.push([p1,p3])
        })
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