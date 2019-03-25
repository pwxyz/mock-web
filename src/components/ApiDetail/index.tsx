
import React from 'react';
import { Tabs, Table, Input, Button } from 'antd';
import TransformTime  from '@/components/TransformTime'
import CodeEditor from '@/components/CodeEditor'
import { PROJECT_NAMESPACE } from '@/constants/nameSpace'

const Wrap = ({ label, children=null }) => 
  <div style={{ display:'flex' }} >
    <label style={{ fontWeight: 'bold', marginRight: 15 }} >{label+ ':'}</label>
    {
      children
    }
  </div>

const ReqTable = ({ data }) => {
  const columns = [
    { title: '描述', key: 'description', dataIndex: 'description' },
    { title: '位置', key: 'in', dataIndex: 'in' },
    { title: '名称', key: 'name', dataIndex: 'name' },
    { title: '数据类型', key: 'type', dataIndex: 'type' },
    { title: '是否必须', key: 'require', dataIndex: 'require' }
  ]

  return (
    <Table dataSource={data.map(i => { i['key'] = i['_id']; return i } )} columns={columns} />
  )
}

const ApiDetail = ({path, method, createdAt, updatedAt, req, res, mockRes, mockCover,dispatch}) => {
  const getInputExpireIn = e => {
    dispatch({ type:`${PROJECT_NAMESPACE}/setInputExpireIn`, payload: e.target.value })
  }

  const setMockCover = value => {
    dispatch({ type:`${PROJECT_NAMESPACE}/setMockCover`, payload: value })
  }

  const postCache = () => {
    dispatch({ type:`${PROJECT_NAMESPACE}/postCache` })
  }

  return(
    <div>
      <Wrap label='路径'>
        {path}
      </Wrap>
      <Wrap label='路径'>
        {method}
      </Wrap>
      <Wrap label='创建时间'>
        <TransformTime time={createdAt} />
      </Wrap>
      <Wrap label='修改时间'>
        <TransformTime time={updatedAt} />
      </Wrap>
      <Wrap label='请求参数'>
        <ReqTable data={req} />
      </Wrap>
      <Tabs >
        <Tabs.TabPane tab='JSON格式' key='JSON格式' >
          <Wrap label='返回'>
            <span style={{ whiteSpace: 'pre-wrap' }} >{JSON.stringify(res, null ,2)}</span>
          </Wrap>
        </Tabs.TabPane>
        <Tabs.TabPane tab='mock数据' key='mock数据'  >
          <Wrap label='mock'>
            <span style={{ whiteSpace: 'pre-wrap' }} >{JSON.stringify(mockRes, null ,2)}</span>
          </Wrap>
        </Tabs.TabPane>
        <Tabs.TabPane tab='mock覆盖' key='mock覆盖'  >
          <Wrap label='mockCover'>
            <div style={{ display:'flex', flexDirection:'column' }} >
              <CodeEditor  height={200} width={500} type={'editor'} defaultValue ={JSON.stringify(mockCover, null, 2)} onChange={setMockCover} />
              <Input onChange={getInputExpireIn} style={{ width:200 }} addonBefore='过期时间'  />
              <Button onClick={postCache}  >保存</Button>
            </div>
          </Wrap>
        </Tabs.TabPane>
      </Tabs>
      
    </div>
  )
}


export default ApiDetail
