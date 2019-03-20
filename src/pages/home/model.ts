
import request from '../../utils/request'

export default {
  namespace: 'home',
  state:{
    num:1
  },

  reducers: {
    add(state, {payload: data}){
      console.log('add')
      return { ...state, num: state.num+1 }
    }
  },

  effects: {
    *getProject(action, { put, call }) {
      let res = yield call(() => request({ url: 'http://localhost:3366/project' })) 
      console.log(res)
    }
  },

  subscriptions: {
    history({ dispatch, history }){
      console.log('history', history)
      dispatch({ type: 'getProject' })
    }
  }
}
