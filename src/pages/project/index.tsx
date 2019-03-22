
import React from 'react';
import CommonConnect from '@/components/CommonConnect'
import { Menu, Tabs, Table, Row, Col, Card  } from 'antd';
import { PROJECT_NAMESPACE } from '@/constants/nameSpace'
import TransformTime  from '@/components/TransformTime'

interface ProjectProps {
  dispatch: Function,
  history: {
    location: {
      query: {
        id:string,
        version: string
      }
    }
  },
  [PROJECT_NAMESPACE]: {
    tagArr: object[],
    apiArr: object[],
    mockRes: object,
    selectApi: {
      path:string, 
      method:string, 
      createdAt:number, 
      updatedAt:number, 
      req:object[], 
      res:object
    }
  }
}


@CommonConnect()
class ApiPage extends React.Component<ProjectProps, any>{
  
  componentDidMount(){
    let { id, version } = this.props.history.location.query
    this.getTag(id, version)
  }

  getApi = (tag) => {
    let { id, version } = this.props.history.location.query
    this.props.dispatch({ type: `${PROJECT_NAMESPACE}/getApi`, payload: {id, version, tag} })
  }

  getTag = (id, version) => {
    this.props.dispatch({ type: `${PROJECT_NAMESPACE}/getTag`, payload: {id, version} })
  }

  getApiDetail = ({ key='' }) => {
    let arr = key.split('_')
    if(arr.length===2&&/\d/.test(arr[1])){
      let index= Number(arr[1]); 
      this.props.dispatch({ type:  `${PROJECT_NAMESPACE}/selectApi`, payload: index })
    }
  }
  
  render(){
    let { tagArr, apiArr, selectApi, mockRes }= this.props[PROJECT_NAMESPACE]
    console.log( this.props[PROJECT_NAMESPACE])

    return(
      <div>
        <Tabs onChange={this.getApi} >
          {
            tagArr&&tagArr.length&&tagArr.map(i => 
              <Tabs.TabPane tab={i['name']} key={i['keys']} >
              <Row>
                <Col span={4}>
                  <Menu style={{ width: 256, display: 'inline-block' }} onClick={this.getApiDetail} >
                    {
                      apiArr&&apiArr.length&&apiArr.map(i => 
                        <Menu.Item key={i['keys']} >{i['path']+ '--' + i['method']}</Menu.Item>)
                    }
                  </Menu>
                </Col>
                <Col span={20}>
                  {
                    selectApi&&<Card title='详情' ><ApiDetail {...selectApi} mockRes={mockRes} /></Card>}
                </Col>
              </Row>
                
                
              </Tabs.TabPane>)
          }
        </Tabs>
      </div>
    )
  }
}

const Wrap = ({ label, children=null }) => 
  <div style={{ display:'flex' }} >
    <label style={{ fontWeight: 'bold', marginRight: 15 }} >{label+ ':'}</label>
    {
      children
    }
  </div>

const ApiDetail = ({path, method, createdAt, updatedAt, req, res, mockRes}) => {
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
      </Tabs>
      
    </div>
  )
}

const ReqTable = ({ data }) => {
  const columns = [
    { title: '描述', key: 'description', dataIndex: 'description' },
    { title: '位置', key: 'in', dataIndex: 'in' },
    { title: '名称', key: 'name', dataIndex: 'name' },
    { title: '数据类型', key: 'type', dataIndex: 'type' },
    { title: '是否必须', key: 'require', dataIndex: 'require' }
  ]

  return (
    <Table dataSource={data} columns={columns} />
  )
}

const resColumns = [
  
  { title: 'key', key: 'key', dataIndex: 'key' },
  { title: '精确类型', key: 'kind', dataIndex: 'kind' },
  { title: '数据类型', key: 'type', dataIndex: 'type' },
  { title: '描述', key: 'description', dataIndex: 'description' },
]

const ResTable = ({ obj }) => {
  let data = obj2arr(obj)
  const expandedRowRender = (record, index, indent, expanded) => {
    if(record['properties']){
      return <ResTable obj={record['properties']} />
    }
    if(record['items']){
      return <ResTable obj={record['items']['properties']} />
    }
    return null
  }

  return (
    <Table dataSource={data} columns={resColumns}  defaultExpandAllRows={true} expandedRowRender={expandedRowRender} pagination={false}  />
  )
}

const obj2arr = obj => {
  let arr = [];
  for(let key in obj){
    let i = {}
    i['key'] = key;
    i = { ...obj[key], ...i  }
    arr.push(i)
  }
  return arr
}


export default ApiPage;
