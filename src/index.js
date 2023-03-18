import React from 'react';
import ReactDOM from 'react-dom';
//import Form,{Field} from 'rc-field-form';
import Form,{Field} from './rc-field-form';
//自定义的较验函数 实现判断用户名是否重复
let uniqueUsername = (rule,value)=>{
   return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      if(value === 'zhufeng'){
        resolve('用户名已被占用');
      }else{
        resolve('');
      }
    },3000);
   });
}
ReactDOM.render(
  <Form
     initialValues={{username:'',password:''}}
     onFinish={
       (values)=>{
         console.log('成功',values);
       }
     }
     onFinishFailed={
      (errorInfo)=>{
        console.log('失败',errorInfo);
      }
    }
  >
    <Field name="username" rules={[{required:true,min:3,max:6},{validate:uniqueUsername}]}>
      <input placeholder="用户名"/>
    </Field>
    <Field name="password" rules={[{required:true}]} onChange={event=>{
      console.log('密码变了');
    }}>
      <input  placeholder="密码" onChange={event=>{
      console.log('密码变了2222');
    }}/>
    </Field>
    <button htmltype="submit">提交</button>
  </Form>,document.getElementById('root')
);