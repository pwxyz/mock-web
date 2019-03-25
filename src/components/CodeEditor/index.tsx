//此组件可以设置initvalue, 但是不能通过props.onChange来传值
import React from 'react';
import MonacoEditor from 'react-monaco-editor';


interface props{
  defaultValue : string,
  type: string,
  width: number,
  height: number,
  onChange: (str:string)=> void
}

interface state{
  type: string
}

class App extends React.Component <props, state>{
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type || 'editorChange'
    }
  }

  ref=null

  editorDidMount(editor, monaco) {
  }

  onChange = value => {
    this.props.onChange(value)
  }

  render() {
    const options = {
    }
    return (
      <MonacoEditor
        width={this.props.width || 800}
        height={this.props.height ||600}
        ref="monaco"
        language="json"
        theme="vs"
        defaultValue={this.props.defaultValue }
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}


export default App
