
import React from 'react';
import CommonConnect from '@/components/CommonConnect'
import { Menu, Tabs, Row, Col, Card  } from 'antd';
import { PROJECT_NAMESPACE } from '@/constants/nameSpace'
// import TransformTime  from '@/components/TransformTime'
// import CodeEditor from '@/components/CodeEditor'
import ApiDetail from '@/components/ApiDetail'

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
    mockCover: object,
    selectApiMenuItem: string[],
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

  getApi = (key) => {
    let { id, version } = this.props.history.location.query
    let tag = this.props[PROJECT_NAMESPACE].tagArr[Number(key)]['keys']
    this.props.dispatch({ type: `${PROJECT_NAMESPACE}/getApi`, payload: {id, version, tag } })
  }

  getTag = (id, version) => {
    this.props.dispatch({ type: `${PROJECT_NAMESPACE}/getTag`, payload: {id, version} })
  }

  getApiDetail = ({ key='' }) => {

    let payload = this.props[PROJECT_NAMESPACE].apiArr.filter(i => i['_id']===key)[0]
    this.props.dispatch({ type:  `${PROJECT_NAMESPACE}/selectApi`, payload })
  }

  getExpreIn = e => {
    console.log(e.target.value)
    this.props.dispatch({ type:`${PROJECT_NAMESPACE}/setInputExpireIn`, payload: e.target.value })
  }

  
  render(){
    let { tagArr, apiArr, selectApi, mockRes, selectApiMenuItem, mockCover }= this.props[PROJECT_NAMESPACE]
    let { dispatch } = this.props
    return(
      <div>
        <Tabs onChange={this.getApi} animated={false}  >
          {
            tagArr&&tagArr.length&&tagArr.map((i, index )=> 
              <Tabs.TabPane tab={i['name']} key={index+''}  >
              <Row key={index} >
                <Col span={4}>
                  <Menu style={{ width: 256, display: 'inline-block' }} onClick={this.getApiDetail}  selectedKeys={selectApiMenuItem} >
                    {
                      apiArr&&apiArr.length&&apiArr.map((i, index )=> 
                        <Menu.Item key={i['_id']} >{i['path']+ '--' + i['method']}</Menu.Item>)
                    }
                  </Menu>
                </Col>
                <Col span={20}>
                  {
                    selectApi&&<Card title='详情' ><ApiDetail  dispatch={ dispatch } {...selectApi} mockRes={mockRes} mockCover={mockCover}   /></Card>}
                </Col>
              </Row>
                
                
              </Tabs.TabPane>)
          }
        </Tabs>
      </div>
    )
  }
}


export default ApiPage;
