import React from 'react';
import ModalWithDrag from "../../../../components/ModalWithDrag";

let winWidth;
let winHeight;

class Show extends React.Component {
  state = {visible: true};

  findWidth = () => {
    if(window.innerWidth){     //获取窗口宽度
      winWidth = window.innerWidth - 30;
      return winWidth;
    }/*else if((document.body.clientWidth)){
      winWidth = document.body.clientWidth - 30;
    }
    if(document.documentElement && document.documentElement.clientWidth){//通过深入document内部对body进行检测，获取窗口大小
      winWidth = document.documentElement.clientWidth - 30;
    }*/
  };

  findHeight = () => {
    if(window.innerHeight){    //获取窗口高度
      winHeight = window.innerHeight - 30;
      return winHeight
    }/*else if((document.body.clientHeight)){
      winHeight = window.body.clientHeight - 30;
      return winHeight
    }
    if(document.documentElement && document.documentElement.clientHeight){ //通过深入document内部对body进行检测，获取窗口大小
      winHeight = document.documentElement.clientHeight - 30;
      return winHeight
    }*/
  };



  getProps = () => {
    const {title, onCancel} = this.props;
    return {
      title,
      onCancel: onCancel.bind(null, this.props),
      width: this.findWidth(),
      height: this.findHeight(),
      visible: true,
      maskClosable: false,
      footer: false
    };
  };

  render() {
    const {result} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        <iframe src = {result} style={{width: winWidth - 20, height: winHeight - 20}} />
      </ModalWithDrag>
    );
  }
}

export default Show;
