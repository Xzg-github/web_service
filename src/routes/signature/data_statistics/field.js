import EditPage from './component/EditPage/EditPage'
import showPopup from '../../../standard-business/showPopup';

// 将动态字段信息转换成搜索组件的filters、表格1组件的cols和表单组件的controls
const parseFields = (fields) => {
  const filters = [], cols = [], controls=[];
  for (const {property:{propertyId, propertyName, componentType, componentSource}, isQuery, isRequire, pricePropertyName} of fields) {
    const col = {key: propertyId, title: pricePropertyName || propertyName};
    const edit = {type: componentType};
    isRequire && (edit.required = true);
    if (componentType === 'dictionary') {
      if (componentSource) {
        col.dictionary = componentSource;
        edit.type = 'select';
      }
    } else if (componentType === 'search') {
      edit.searchType = componentSource;
    }
    const control = Object.assign(edit, col);
    isQuery && (filters.push(control));
    cols.push(col);
    controls.push(control);
  }
  return {filters, cols, controls};
};

const findField = (fields, id) => {
  return fields.find(field => field.property.propertyId === id);
};

// 将值里面的动态字段转换成静态字段，会直接改变value
const dynamicToStatic = (value, fields) => {
  const items = value.detailConditionList || [];
  for (const item of items) {
    const field = findField(fields, item.propertyId);
    if (field) {
      value[item.propertyId] = field.property.componentType === 'search' ? item : item.value;
    }
  }
  return value;
};

const toPropertyObject = (key, value, type) => {
  if (type === 'search') {
    if (value && (typeof value === 'object')) {
      return {propertyId: key, value: value.value || '', title: value.title || ''};
    } else {
      return {propertyId: key, value: '', title: ''};
    }
  } else {
    return {propertyId: key, value};
  }
};

// 将值里面的静态字段转换成动态字段，不会改变value
const staticToDynamic = (value, fields) => {
  const keys = Object.keys(value);
  const res = {};
  const dynamic = [];
  for (const key of keys) {
    const field = findField(fields, key);
    if (field) {
      dynamic.push(toPropertyObject(key, value[key], field.property.componentType));
    } else {
      res[key] = value[key];
    }
  }
  res.detailConditionList = dynamic;
  return res;
};

const showErrorDialog = (value) => {
  const props = {
    value,
    controls: [{key:'msg',title:'',type:'textArea',span:6,props:{readOnly:true}}],
  };
  return showPopup(EditPage, props);
};

const handleValue = (value,tableItems) => {
  const body = [];
  tableItems.forEach(item => {
    body.push({
      ...value,
      price:item.price,
      priceBasicId:item.valueTitleDto.value
    })
  });
  return body
};

const field = {
  parseFields, dynamicToStatic, staticToDynamic, toPropertyObject,showErrorDialog,handleValue
};

export default field;
