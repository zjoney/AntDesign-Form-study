
class Schema{
    constructor(descriptor){
        this.descriptor = descriptor;
    }
    validate(values){
        return new Promise(async (resolve,reject)=>{
            let errorFields = [];
            for(let name in this.descriptor){
                let value = values[name];
                let rules = this.descriptor[name];
                let ruleKeys = Object.keys(rules);//[required,min,max]
                let errors = [];
               
                for(let i=0;i<ruleKeys.length;i++){
                    let ruleKey = ruleKeys[i];
                    if(ruleKey === 'required'){
                        if(rules[ruleKey]&&!value){
                            errors.push(`${name} is required`);
                        }
                    }else  if(ruleKey === 'min'){
                        if(value.length<rules[ruleKey]){
                            errors.push(`${name}最少是${rules[ruleKey]}个字符!`);
                        }
                    }else  if(ruleKey === 'max'){
                        if(value.length>rules[ruleKey]){
                            errors.push(`${name}最多是${rules[ruleKey]}个字符!`);
                        }
                    }else  if(ruleKey === 'validate'){
                        let validate = rules[ruleKey];
                        let result = await validate(rules[ruleKey],value);
                        if(result.length>0){
                            errors.push(`${name}不符合自定义较验器的规则判断!`);
                        }
                    }
                }
                if(errors.length>0){
                    errorFields.push({name,errors});
                }
            }
            if(errorFields.length>0){
                reject({errorFields,values});
            }else{
                resolve(values);
            }
        });
    }
}
export default Schema;

/**
const descriptor = {
  username: {
    required: true,min:3,max:6
  },
  age: {
       required: true
  },
};
 */