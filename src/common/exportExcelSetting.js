import SetColDialog from '../components/SetColDialog/SetColDialog';
import {fetchJson, postOption, showError, deepCopy} from './common';
import showPopup from '../standard-business/showPopup';
import ExportJsonExcel from 'js-export-excel';

const URL_GET_ID = '/api/permission/custom_export_table';

const exportExcelFunc = async (newCols, items, byFront=true) => {
  const gridConfig = newCols.map(col => {
    const newCol = { title: col.title, dataPath: col.key };
    (col.type === 'number') && (newCol.isNumber = true);
    (!col.option) && (newCol.dataSource = col.dictionary || col.position);
    return newCol;
  });
  const hasDictionaryData = newCols.filter(col=>col.options && col.options.length);
  const checkItems = items.filter(o=>o.checked);
  const srcData = checkItems.length == 0 ? items : checkItems;
  const data = deepCopy(srcData).map(o=>{
    for(let v in o) {
      if(typeof o[v] == 'object'){
        o[v] = o[v].title;
      }
      hasDictionaryData.map(a=>{
        if(a.key == v){
          const value = a.options.filter(b=>b.value == o[v]);
          o[v] = value.length > 0 ? value[0].title : '';
        }
      });
    }
    return o;
  });
  if(byFront){  //前端导出
    const D = new Date();
    const option = {
      fileName: `${D.getFullYear()}${D.getMonth()+1}${D.getDate()}${D.getHours()}${D.getMinutes()}${D.getSeconds()}`,
      datas: [{
          sheetHeader: gridConfig.map(o=>o.title),
          sheetFilter: gridConfig.map(o=>o.dataPath),
          sheetData: data
      }]
    };
    const file = new ExportJsonExcel(option);
    file.saveExcel();
  }else{  //后端导出
    const {returnCode, result, returnMsg} = await fetchJson(URL_GET_ID, postOption({gridConfig, data}));
    if(returnCode !== 0) return showError(returnMsg);
    window.open(`/api/proxy/integration_service/load/excel_datasource/${result.id}`);
  }
};

// cols:表格字段配置，items：表格数据源
const showExcelDialog = (cols, items) => {
  const onOk = (newCols) => {exportExcelFunc(newCols, items)};
  const props = {
    ok: '确定',
    cancel: '取消',
    title: 'Excel',
    buttons: [
      {key:'up', title: '前移'},
      {key:'down', title: '后移'},
      {key:'remove', title: '移除'}
    ],
    tableCols:[
      {key: 'checked', title: '', type: 'checkbox'},
      {key: 'index', title: '序号', type: 'index'},
      {key:'title', title: '字段名', type: 'readonly'},
    ],
    cols,
    onOk
  };
  return showPopup(SetColDialog, props);
};

export {showExcelDialog, exportExcelFunc};
