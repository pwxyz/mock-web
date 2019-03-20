

import axois from 'axios';

interface RequestArg {
  method?: string; 
  url: string; 
  data?: object
}

async function request(obj:RequestArg){
  let { method='get', url, data } = obj
  try{
    let res = await axois({ method, url, data })
    return res
  }
  catch(err){
    return err
  }
}

export default request;
