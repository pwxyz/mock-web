
import { API, TAG, MOCK_CACHE, MOCK } from '@/constants/apiConfig'
import request from '@/utils/request'
import { PROJECT_NAMESPACE } from '@/constants/nameSpace'
import { message } from 'antd'


export default {
  namespace: PROJECT_NAMESPACE,
  state: {
    apiArr: [],
    tagArr: [],
    selectApi: null ,
    mockRes: {},
    selectApiMenuItem:[ ''],
    mockCover: {},
    exprieIn: 60,
  },

  reducers:{
    addApi(state, { payload:{ data } }){
      return { ...state, apiArr: data }
    },
    addTag(state, { payload: data }){
      return { ...state, tagArr: data }
    },
    setSelectApi(state, { payload }){   
      return { ...state, selectApi: payload, selectApiMenuItem: [payload['_id']] }
    },

    setMock(state, { payload: mockRes }){
      return { ...state, mockRes }
    },

    setMockCover(state, { payload }){
      return { ...state, mockCover: payload }
    },

    setInputExpireIn(state, { payload }){
      return { ...state, exprieIn: payload }
    }
  },
  effects: {
    *getApi({ payload }, { put, call }){
      let { id, version, tag } = payload
      let url = tag ? `${API}/${id}/${version}?tag=${tag}` : `${API}/${id}/${version}`
      let res = yield call(() => request({ url }) )
      if(res.payload){
        yield put({ type: 'addApi', payload:{data: res.payload.data } })
        if(res.payload.data.length){
          yield put({ type: 'selectApi', payload: res.payload.data[0] })
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
      let url = `${MOCK}/${id? id: blongTo}/${version}${path}?apimock=true&limit=10`
      let res = yield call(() => request({ url, method }) )
      if(res){
        yield put({ type: 'setMock', payload: res })
      }
    },

    *selectApi({ payload }, {select, put, call } ){
      yield put({ type:'getMock', payload: payload })
      yield put({ type: 'setSelectApi', payload })
      yield put({ type: 'getMockCoverAysnc', payload })
    },

    *getMockCoverAysnc({ payload }, {put, call }){
      let { projectId, version, path, method, blongTo } = payload;
      let url = `${MOCK_CACHE}?projectId=${projectId ? projectId : blongTo }&version=${version}&path=${path}&method=${method}`
      let res = yield call(() => request({ url }) )
      if(res){
        yield put({ type: 'setMockCover', payload: res.payload })
      }
    },

    *postCache({}, { select, put, call }){
      let obj = yield select(state => state[PROJECT_NAMESPACE])
      let { selectApi, mockCover, exprieIn } = obj
      try{
        let res = JSON.parse(mockCover)
        if(/^\d+$/.test(exprieIn)&&typeof res ==='object'){
          yield put({ type:'setMockCoverAysnc', payload: { ...selectApi, exprieIn: Number(exprieIn), res } })
        }
        else if(!/^\d+$/.test(exprieIn)) {
          message.error('过期时间必须为数字')
        }
        else {
          message.error('mockCover不能转换为obj')
        }
      }
      catch(err){
        message.error('mockCover不能转换为obj')
      }
    },

    *setMockCoverAysnc({ payload }, {put, call }){
      let { projectId, version, path, method, exprieIn, res, blongTo } = payload;
      let url = `${MOCK_CACHE}`
      let response = yield call(() => request({ url, data: {projectId: projectId? projectId: blongTo , version, path, method, exprieIn, res  }, method: 'post'  }) )
      if(response){
        console.log(res)
        message.success('增加成功')
      }
    },
  }
}
