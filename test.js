
const axios = require('axios');

const getData = async ()=> {
  //同步请求数据
  const res1=await axios.get("https://i.cnblogs.com/")

  console.log(res1.data)
  return {res1};
}


getData().then(function ({res1}) {

})
