

import axois from 'axios';
import { message as Msg } from 'antd';

interface RequestArg {
  method?: string; 
  url: string; 
  data?: object
}

const hostConfig = 'http://localhost:3366'

async function request(obj:RequestArg){
  let { method='get', url, data } = obj
  let urls = /^http/.test(url) ? url : hostConfig + url
  try{
    let res = await axois({ method, url: urls  , data })
    let code= res.data.code
    if(code>=200&&code<=300||/\/mock\//.test(url)){
      return res.data
    }
    else {
      Msg.error(res.data.message)
    }
  }
  catch(err){
    return Msg.error(err)
  }
}

export default request;
