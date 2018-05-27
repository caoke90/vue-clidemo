import ajax from './ajax';
/*
get
* */
export function get(id){
  return ajax.get('/demo',{
    params:{
      id: id
    }
  })
}

export function post(id){
  return ajax.post('/demo',{
    id: id
  })
}
