
import React from 'react';
import CommonConnect from '@/components/CommonConnect'

@CommonConnect()
class ApiPage extends React.Component<any, any>{
  render(){
    console.log(this.props)
    return(
      <div>ApiPage</div>
    )
  }
}


export default ApiPage;
