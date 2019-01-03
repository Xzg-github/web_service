import React from 'react';
import ReactDOM from 'react-dom';
import XLSX from 'xlsx';
import helper from "../common/common";

let lastResolve = null;

const readFile = (file, cols=[], dic={}) => {
  const tableCols = cols.filter(col => col.type !== 'checkbox' && col.type !== 'index');
  let status = true, importItems = [], msg='';
  return new Promise((resolve) => {
    let reader = new FileReader();
    // 以二进制方式打开文件
    reader.readAsBinaryString(file);
    reader.onload = (ev) => {
      try {
        let workbook = XLSX.read(ev.target.result, {type: 'binary'});
        // 表格的表格范围，可用于判断表头是否数量是否正确
        let fromTo = '';
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]['!ref'];
            importItems = importItems.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; // 只取第一张表，否则注释这行
          }
        }
        console.log(importItems);
      } catch (e) {
        msg = '文件类型不正确';
        status = false;
      }
      if (status) {
        let errorCols = [];
        importItems = importItems.map( item => {
          let newItem = {};
          tableCols.map(col => {
            newItem[col.key] = item[col.title];
            if (newItem[col.key] && (col.dictionary || col.position || col.options)) { //下拉值
              const options = col.options || dic[col.dictionary] || dic[col.position] || [];
              const {value} = options.filter(option => option.title === item[col.title]).pop() || {};
              if (!value) {
                errorCols.push(col.title);
              }else {
                newItem[col.key] = value;
              }
            }
          });
          return newItem;
        });
        errorCols.length > 0 && errorCols.map(errCol => {msg += `${errCol},`});
        msg && (msg += '字段转字典值失败');
        helper.showSuccessMsg(`[${file.name}]导入成功！ ${msg ? msg : ''}`);
      }else {
        helper.showError(`[${file.name}]导入失败: ${msg}`);
      }
      resolve({
        status,
        importItems
      });
    }
  });
};

/*
* 功能： 前端纯文本格式字段excel文件导入，注意此方法为异步方法
* 参数： cols: [必需] 前端表格配置
*        dic: [可选] 当有字段为下拉选择且options不在对应col配置中时需要手动传入
* 返回值：{status: true/false, importItems:[]}  status为true时importItems为导入的数据， false代表取消或导入失败
* */
const webImport = (cols=[], dic={}) => {
  return new Promise(resolve => {
    let node = document.getElementById('_import_global');
    if (!node) {
      node = document.createElement('div');
      node.id = '_import_global';
      node.style.display = 'none';
      document.body.appendChild(node);
    }else {
      ReactDOM.unmountComponentAtNode(node);
      lastResolve && lastResolve({status: false});
    }

    lastResolve = resolve;

    const onChange = (e) => {
      readFile(e.target.files[0], cols, dic).then(result => {
        ReactDOM.unmountComponentAtNode(node);
        node.parentNode.removeChild(node);
        resolve(result);
      });
    };

    ReactDOM.render(<input type='file' onChange={onChange} ref={e => e && e.click()}/>, node);
  });
};

export default webImport;

