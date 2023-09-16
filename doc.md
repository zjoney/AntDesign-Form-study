### 1.生成项目

+   rc-field-form
+   async-validator

```js
create-react-app zhufeng_antdesign-form cd zhufeng_antdesign-form
yarn add rc-field-form
yarn start
```

### 2.使用Form

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59d706dd852d48d39c7248c0ba4e18b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=907&h=687&s=370313&e=png&b=fefdfd)

#### 2.src\index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import Form, { Field } from "rc-field-form";
ReactDOM.render(
<Form  
  initialValues={{username:'',password:''}}  
  onFinish={values =>{
  console.log('values') 
  }}>
<Field name="username">
<input input placeholders='用户名' />
</Field>
<Field name="password">
<input placeholders='密码' />
</Field>
<button>提交</button>
</Form>,
document.getElementByld('root')
);
```

### 3.实现双向数据绑定

#### 3.1 src\index.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
//import Form, { Field } from 'rc-field-form';
import Form,{Field } from './rc-field-form';

ReactDOM.render(
<Form
initialValues={{username:'',,password:''}}
onFinish={values => {
console.log('完成：'，values);
}}>
<Field name="username">
  <input placeholder = '用户名'/>
</Field>
<Field name="password">
<input placeholder="密码"/>
</Field>
<button>提交</button>
</Form>,
document.getElementByld('root')
)；
```

#### 3.2 rc-field-form\index.js

src\rc-field-form\index.js

```js
import Form from "./Form";
import Field from "./Field";
import useForm from "./useForm";
export default Form;
export {
Field,useForm
}
```

#### 3.3 Form.js

src\rc-field-form\Form.js

```js
import React from "react";
import useForm from "./useForm";
import FieldContext from "./FieldContext";
const Form = ({initialvalues,onFinish,children}) => {
const [forminstance] = useForm();
forminstance.setCallbacks({
onFinish
})
const mountRef = React.useRef(null);
forminstance.setlnitialValues(initialvalues, !mountRef.current);

if (!mountRef.current) {
  mountRef.current = true;
 }

return(
<form
  onSubmit={event => {
event.preventDefault();
event.stopPropagation();
forminstance.submit();
}}>
<FieldContext.Provider value={formlnstance}>
{children}
</FieldContext.Provider>
</form>
)
}
export default Form;
```

#### 3.4 FieldContext.js

src\rc-field-form\FieldContext.js

```js
import React from "react";
const warningFunc = () => {
console.warn(false,'无法找到FormContext.请确定你是在Form下面使用Field'); }；

const Context = React.createContext({ 
  getFieldValue: warningFunc, 
  getFieldsValue: warningFunc, 
  setFieldsValue: warningFunc, 
  submit: warningFunc,
})；
export default Context;
```

#### 3.5 Field.js

src\rc-field-form\Field.js
```js
import React from "react";
import FieldContext from "./FieldContext";
class Field extends React.Component {
  static contextType = FieldContext;

componentDidMount() {

this.context.registerField(this);

}

onStoreChange = () => { 
  this.forceUpdate();

}；

getControlled = (childProps) => { 
  const {name} = this.props;

const {getFieldValue,setFieldsValue} = this.context;

return {

...childProps,

value: getFieldValue(name),

onChange: event => { 
  setFieldsValue({[name]: event.target.value});

}

};

};

render() { 
  const { children } = this.props; 
  const returnChildNode = React.cloneElement(children, this.getControlled(children.props));
   return returnChildNode;
}
}
export default Field;
```

#### 3.6 useForm.js

src\rc-field-form\useForm.js


```js
import React from 'react';

class FormStore {

store = {};

fieldEntities =[];

initialvalues = {};

callbacks = {};

constructor(forceRootUpdate) { 
  this. forceRootUpdate = forceRootUpdate;

}

getForm = () => ({

getFieldValue: this.getFieldValue, getFieldsValue: this.getFieldsValue, setFieldsValue: this.setFieldsValue, setlnitialValues: this.setlnitialvalues, setCallbacks: this.setCallbacks, registerField: this.registerField, submit: this.submit,

})；

setInitialValues = (initialValues) => { 
  this.store = { ...initialValues };

};

setcallbacks = (callbacks) => { this.callbacks = callbacks;

};

getFieldValue = (name) => { 
  return this.store[name];

};

getFieldsValue = () => { 
  return this.store;

}

registerField = (entity) => {

this.fieldEntities.push(entity);

}；

setFieldsValue = (store) => {

this.store = { ...this.store, ...store };
this.fieldEntities.forEach(({ onStoreChange }) => { 
  onStoreChange();

});

};

submit = () => {

const { onFinish } = this.callbacks; 
if (onFinish) {

onFinish(this.store);

};

}

export default function useForm(form) {

const formRef = React.useRef();

const [, forceUpdate] = React.useState({});

if (!formRef.current) {

if (form) { 
  formRef.current = form;

} else {

const forceReRender = () => { 
  forceUpdate({});

};

const formStore = new FormStore(forceReRender); 
formRef.current = formStore.getForm();

}

}

return [formRef.current];

}
```

### 4.实现表单校验

#### 4.1 src\index.js

src\index.js


```js
import React from 'react';

import ReactDOM from 'react-dom';

//import Form, { Field } from 'rc-fieId-form';

import Form,{Field } from './rc-field-form'; 
ReactDOM.render(

<Form

initialValues={{username:'',password:''}}
onFinish={values => { console.log('完成：',values);

}}

+   onFinishFailed={(errorinfo)=>{
+   console, log('失败：'，errorinfo);
+   }}
>

+   <Field name="username" rules={[{ required: true }]}> 
    <input placeholder="用户名" />
    </Field>
+   <Field name="password" rules={[{ required: true }]}>
    <input placeholder="密码"  />

</Field>

<button>提交</button>

</Form>, 
document.getElementByld('root')

);
```

#### 4.2 Form.js

src\rc-field-form\Form.js


```js
import React from "react";

import useForm from "./useForm";

import FieldContext from "./FieldContext";

+const Form = ({initialvalues,onFinish,onFinishFailed,children}) => { 
  const [formInstance] = useForm();

formInstance.setCallbacks({
onFinish,

+   onFinishFailed

});

const mountRef = React.useRef(null);

forminstance.setInitialValues(initialValues, !mountRef.current);

if (!mountRef.current) {

mountRef.current = true;

}

return (

<form

onSubmit={event => {

event,preventDefault();

event.stopPropagation();

formInstance.submit();

}}>

<FieldContext.Provider value={formlnstance}>

{children}

</FieldContext.Provider>

</form>

export default Form;
```

#### 4.3 useForm.js

src\rc-field-form\useForm.js


```js
import React from "react";

import AsyncValidator from './async-validator';

class FormStore {

store = {};

fieldEntities =[];

initialValues = {};

callbacks = {};

constructor(forceRootUpdate) {

this.forceRootUpdate = forceRootUpdate;

}

getForm = () => ({

getFieldValue: this.getFieldValue, 
getFieldsValue: this.getFieldsValue, 
setFieldsValue: this.setFieldsValue, 
setlnitialvalues: this.setlnitialValues, 
setCallbacks: this.setCallbacks, 
registerField: this.registerField, 
submit: this.submit,
}); 
setInitialvalues = (initialvalues) => {

this.store = { ...initialvalues };

};
 setCallbacks = (callbacks) => { 
  this.callbacks = callbacks;

};

getFieldValue = (name) => { 
  return this.store[name];

}；

getFieldsValue = () => { 
  return this.store;

}

registerField = (entity) => {

this.fieldEntities.push(entity);

}； 
setFieldsValue = (store) => {

this.store = { ...this.store, ...store };

this.fieldEntities.forEach(({ onStoreChange }) => { 
  onStoreChange();

})；

}；

+   submit = () => {

+   this.validateFields()

+   .then(values => {

+   const { onFinish } = this.callbacks;

+   if (onFinish) {

+   onFinish(values);

+   }

+   })

+   .catch(errorlnfo => {

+   const { onFinishFailed } = this.callbacks;

+   if (onFinishFailed) {

+   onFinishFailed(errorlnfo);}});

+   validateFields =()=>{

+   let values = this.getFieldsValue();

+   let descriptor = this.fieldEntities.reduce((descriptor,entity)=>{

+   let rules = entity.props.rules;

+   if(rules && rules.length){

+   let config = rules.reduce((config,rule)=>{

+   config = {...config,...rule};

+   return config;

+   },{});

+   descriptor[entity.props.name]=config;

+   }

+   return descriptor;

+   },{});

+   return new AsyncValidator(descriptor).validate(values);

+   } 
}

export default function useForm(form) {
   const formRef = React.useRef();

const [, forceUpdate] = React.useState({}); 
if (!formRef.current) {

if (form) { 
  formRef.current = form;

} else { 
  const forceReRender = () => {

forceUpdate({});

};

const formStore = new FormStore(forceReRender);

formRef.current = formStore.getForm(); 
}

} 
return [formRef.current];

}
```

#### 4.4 async-validator.js

src\async-validator.js


```js
class Schema {
constructor(descriptor) {
   this.descriptor = descriptor;

}

validate(values) { 
  return new Promise((resolve,reject) => { 
    let errorFields =[];

for (let name in this.descriptor) {
   let rules = this.descriptor[name]; 
   if (rules) {

let ruleKeys = Object.keys(rules);

let errors =[];

for(let i=0;i<ruleKeys.length;i++){
   let ruleKey = ruleKeys[i];

if (ruleKey === 'required') {

if (rules[ruleKey] && !values[name]) { 
  errors.push(`${name} is required`);

}

} else if (ruleKey === 'type') {

if (typeof values[name] !== rules[ruleKey]) { 
  errors.push(`${name} is not ${rules[ruleKey]}`);

}

}else if (ruleKey === 'min') {

if (values[name].length < rules[ruleKey]) { 
  errors.push(`${name} must be at least ${rules[ruleKey]} characters` );

}

} } 
if(errors && errors.length){ 
  errorFields.push({name,errors});
   }

} }

if(errorFields && errorFields.length>0){ 
  reject({errorFields,values});

}else{ resolve(values);

}

});

}

}

//export default Schema;

module.exports = Schema;
```

### 5.实现异步校验

#### 5.1 src\index.js

src\index.js


```js
import React from 1 react1;

import ReactDOM from 'react-dom,;

//import Form, { Field } from 'rc-fieId-form';

import Form,{Field } from './rc-field-form';

+let uniqueValidator = (rule, value, callback, form) => {
+   return new Promise((resolve,reject)=>{
+   setTimeout(()=>{
+   if(value === 'zhufeng'){
+   resolve('用户名已经被占用');
+   }else{
+   resolve('');
+   }
+   },3000);

+   });
+}

ReactDOM.render(
<Form
initialValues={{username:'',password: ''}}
onFinish={values => {
console.log('成功：'，values);
}}

onFinishFailed={(errorinfo)=>{

console.log('失败'：,errorinfo);
}} 
>

+ <Field name="username" rules={[{ required: true },{ min: 3 },{validator:uniqueValidator}]}> 
  <input placeholder="用户名" />
</Field>
<Field name="password" rules={[{ required: true }]}>
<input placeholder="密码"  />
</Field>
<button>提交</button>
</Form>,
document.getElementByld('root')

);
```

#### 5.2 async-validator.js

src\rc-field-form\async-validator.js

```class Schema { constructor(descriptor) { this.descriptor = descriptor;

} validate(values) {

return let for

new Promise(async (resolve,reject) => { errorFields =[];

(let name in this.descriptor) {

let rules = this.descriptor[name];

if

(rules) {

let ruleKeys = Object.keys(rules);

let errors =[];

for(let i=0;i<ruleKeys.length;i++){ let ruleKey = ruleKeys[i];

if (ruleKey === ' required') {

if

(rules[ruleKey] && lvalues[name]) {

errors.push('${name} is

required');

![]() 

if (ruleKey —= •type') { (typeof values[name] !== errors.push('${name> is rules[ruleKey]) { not ${rules[ruleKey];

}else if (ruleKey == 'min') {

if (values[name].length < rules[ruleKey]) {

![]()errors.push('${name} must be at least ${rules[ruleKey]} characters' ); }

}else if (ruleKey === 'validator') {

let validator = rules[ruleKey];

let result = await validator(rules[ruleKey], values[name]);

if(result.length>0){

errors.push(' ${name}不符合自定义验证器的需求!' );

}

}

if(errors && errors.length){

errorFields.push({name,errors}); }

}

if(errorFields && errorFields.length>0){ reject({errorFields,values});

}else(

resolve(values);

})；

}

//export default Schema; module.exports = Schema;
```

### 6.按需加载

#### 6.1.生成项目


```create-react-app zhufeng-antdesign-form

cd zhufeng-antdesign-form

yarn add react-app-rewired customize-cra babel-plugin-import npm start
```

#### 6.1 使用 antd

##### 6.1.1 安装依赖


```
yarn add react-app-rewired customize-cra babel-plugin-import less less-loader
```

##### 6.1.2 config-overrides.js

config-overrides.js


```js
const {override,fixBabellmports, addLessLoader} = require('customize-cra'); module.exports = override(

fixBabelImports('import' libraryName:+antd', libraryDirectory:'es', styleitrue

}),

addLessLoader({

lessOptions:{

javascriptEnabled: true, modifyVars:<'^primary-color':'red'} }

})

)；
```

##### 6.1.3 package.json

package.json


```js
+ "scripts": {

+ ''start": "react-app-rewired start",

+ "build": Mreact-app-rewired build",

+ "test": "react-app-rewired test", + "eject": "react-app-rewired eject"

+ }
```

##### 6.1.4 src\index.js

src\index.js


```js
import React from + react';

import ReactDOM from 'react-dom';

import {Button} from 'antd';

ReactDOM.render(

<Button type="primary”>点击(/Button〉， document.getElementByld('root')

)；
```
