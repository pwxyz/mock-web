
import { API, TAG } from '@/constants/apiConfig'
import request from '@/utils/request'
import { PROJECT_NAMESPACE } from '@/constants/nameSpace'


export default {
  namespace: PROJECT_NAMESPACE,
  state: {
    apiArr: [],
    tagArr: [],
    selectApi: null ,
    mockRes: {}
  },

  reducers:{
    addApi(state, { payload: data }){
      return { ...state, apiArr: data }
    },
    addTag(state, { payload: data }){
      return { ...state, tagArr: data }
    },
    selectApi(state, { payload: index }){   
      return { ...state, selectApi: state.apiArr[index] }
    },

    setMock(state, { payload: mockRes }){
      console.log('payload')
      return { ...state, mockRes }
    }
  },
  effects: {
    *getApi({ payload }, { put, call }){
      let { id, version, tag } = payload
      let url = tag ? `${API}/${id}/${version}?tag=${tag}` : `${API}/${id}/${version}`
      let res = yield call(() => request({ url }) )
      if(res.payload){
        yield put({ type: 'addApi', payload: res.payload.data })
        if(res.payload.data.length){
          yield put({ type: 'selectApi', payload: 0 })
          yield put({ type: 'getMock', payload: { ...res.payload.data[0] } })
        }
      }
    },

    *getTag({ payload }, { put, call }){
      let { id, version } = payload 
      let url = `${TAG}/${id}/${version}`
      let res = yield call(() => request({ url }) )
      if(res.payload&&res.payload.data){
        yield put({ type:'addTag', payload: res.payload.data })
        if( res.payload.data[0]&&res.payload.data[0]['keys']){
          yield put({ type:'getApi', payload: { id, version , tag: res.payload.data[0]['keys'] } })
        }
      }
    },
    *getMock({ payload }, { put, call }){
      let { id, version, path, method , blongTo} = payload
      let url = `/mock/${id? id: blongTo}/${version}${path}?apimock=true&limit=10`
      let res = yield call(() => request({ url, method }) )
      if(res){
        yield put({ type: 'setMock', payload: res })
      }
    }
  }
}
