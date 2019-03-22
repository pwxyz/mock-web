import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import TransformTime from '../../components/TransformTime'
import { last } from 'lodash'
import { HOME_NAMESCAPE } from '@/constants/nameSpace'

const commonConnect = () => connect(
  state => state
)
interface Props {
  home: {
    projectArr: object[]
  },
  history: {
    push: Function
  },
  dispatch: Function
}

@commonConnect()
class IndexPage extends React.Component<Props, any>{

  componentDidMount(){
    this.props.dispatch({ type: `${HOME_NAMESCAPE}/getProject` })
  }

  render(){
    let { home, history } = this.props
    let data = home.projectArr|| []

    const push = (id, history, version) => {
      let url = `/project?id=${id}&version=${last(version)}`
      history.push(url)
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth:1300, margin: '0 auto' }} >
        {
          data.map((i => 
            <div key={i['_id']} onClick={_ => push(i['_id'], history, i['version'])} >
              <Project title={i['title']} description={i['description']} createdAt={i['createdAt']}  />
            </div>
            ))
        }
      </div>
      
    )
  }
}


const Project = ({ title, description, createdAt }) => {
  return (
    <Card title={title} style={{ width:400, margin: '10px' }} >
      <p>{description ? description : '暂无描述'}</p>
      <div><TransformTime time={createdAt} /></div>
    </Card>
  )
}


export default commonConnect()(IndexPage)
