import React from 'react';
import FieldContext from './FieldContext';
/**
 * 字段的组件
 * 类组件是如何获取上下文对象的值呢?
 * 实现双向数据绑定
 * input的值显示的是formInstance.store对应的字段的值
 * 当input的值发生改变的时候要把值放到formInstance.store上
 */
class Field extends React.Component{
    static contextType = FieldContext// this.context获取 Provider里的value了
    //当组件挂载完成后
    componentDidMount(){
        this.context.registerField(this);
    }
    onStoreChange = ()=>{
        //如果老值和新的值一样的话不进行forceUpdate
        this.forceUpdate();
    }
//原来我们没有写getControlled 组件是一个非受控组件，input value不受状态
//value onChange受控组件，必须得调用forceUpdate
    getControlled = (childProps)=>{
        let {name} = this.props;
        let {getFieldValue,setFieldValue} = this.context;//formInstance
        return {
            ...childProps,
            value:getFieldValue(name),//这是React属性 React会同步到原生DOM上
            onChange:event=>{
                setFieldValue(name,event.target.value);
                console.log(childProps);
                if(this.props.onChange){
                    this.props.onChange(event);
                }
                if(childProps.onChange){
                    childProps.onChange(event);
                }
            }
        }
    }
    render(){
        let children =  this.props.children;//获取 原来的儿子 <input placeholder="密码"/>
        return React.cloneElement(children,this.getControlled(children.props));
    }
}

/* function cloneElement(oldElement,newProps){
    return {...oldElement,props:newProps};
} */
export default Field;