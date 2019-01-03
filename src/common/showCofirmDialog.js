import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { Modal} from 'antd';

const showConfirmDialog = (content, okFunc=undefined,newProps={}) => {
  let myElement = document.getElementById('globalContainer');
  if (!myElement) {
    myElement = document.createElement("div");
    myElement.id = 'globalContainer';
    document.body.appendChild(myElement);
  }
  const onCancel = () => {
    ReactDOM.unmountComponentAtNode(myElement);
  };
  const onOk = async () => {
    ReactDOM.unmountComponentAtNode(myElement);
    okFunc && okFunc();
  };
  const props = Object.assign({
    title: '提示',
    ok: '确定',
    cancel: '取消',
    content,
    onOk,
    onCancel
  },newProps);
  ReactDOM.render(<ConfirmDialog {...props} />, myElement);
};

// isDom:是否使用reactNode节点解析content，这里做了换行的解析，用中文分号做占位符塞<br/>
const modalConfirm = ({isDom=false, ...props}) => {
  const compileEnter = (str) => {
    const arr = str.split('；');
    return (<p>{arr.map((it, i) => (<span key={i}>{it}<br/></span>))}</p>)
  };
  const content = isDom ? compileEnter(props.content) : props.content;
  Modal.confirm({
    title: '提示',
    ...props,
    content
  });
};

export {showConfirmDialog, modalConfirm};
