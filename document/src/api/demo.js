import ajax from './ajax';
/*
get
* */
var allData=[];
const component = require.context('../marvel/cards', false, /\.js$/);
component.keys().map(component).forEach((card)=>{
  card.forEach(function (item) {
    allData.push(item)
  })

})
export function get(hash){
  return new Promise(function (res,rej) {
    if(hash){
      var data=allData.filter(function (item) {
        return item.card_type==hash;
      })
      res(data);
    }else{
      res(allData);
    }
  })

}

