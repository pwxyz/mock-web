
import request from '@/utils/request'
import { PROJECT } from '@/constants/apiConfig'
import { HOME_NAMESCAPE }  from '@/constants/nameSpace'

export default {
  namespace: HOME_NAMESCAPE,
  state:{
    projectArr: []
  },

  reducers: {
    addProjectArr(state, {payload: data}){
      return { ...state, projectArr: data }
    }
  },

  effects: {
    *getProject(action, { put, call }) {
      let res = yield call(() => request({ url: PROJECT })) 
      if(!res.payload){
        return 
      }
      else {
        yield put({ type: 'addProjectArr', payload: res.payload.data })
      }
    }
  },

  subscriptions: {
    // history({ dispatch, history }){
    //   if(history.location.pathname==='/home'){
    //     dispatch({ type: 'getProject' })
    //   }
      
    // }
  }
}
