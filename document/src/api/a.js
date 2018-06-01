import ajax from './ajax';

/*

* */
export function getA(id){

  return ajax.get('http://www.13ytt.com/thread-126523-1-1.html')
  // return ajax.get('a.html')
}

getA().then(function(resp){
  console.log(resp)

  var html=resp.data
  html.replace(/<div class="message">/)
})
