import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import TransformTime from '../../components/TransformTime'

const commonConnect = () => connect(
  state => state
)

const IndexPage = ({ dispatch, home }) => {
  const add = () => dispatch({ type: 'home/add' })
  let data = home.data|| []
  return (
    <div>
      <button onClick={add} >{home.num}</button>
      {
        data.map((i => 
          <Project title={i['title']} description={i['description']} createdAt={i['createdAt']} key={i['_id']} />)
      }
    </div>
    
  )
} 


const Project = ({ title, description, createdAt }) => {
  return (
    <Card title={title} >
      <p>{description}</p>
      <p><TransformTime time={createdAt} /></p>
    </Card>
  )
}


export default commonConnect()(IndexPage)
