import{a as e}from"./MesuringTable.6d60c92d.js";import{j as l,d as a,p as u,i as d,r as o,o as n,c as r,f as t,h as s,m}from"./vendor.b5aa390e.js";import"./index.4d78699e.js";const c={components:{MesuringTable:e},name:"mesuring-manage",setup(){const e=l({specification:"",name:"",code:"",serialNum:"",numbers:"",status:""});let u=a(null);return{query:e,handleSearch:()=>{u.value.handleSearch(e)},mesuringTable:u,handleAdd:()=>{u.value.handleAdd()}}}},i=s();u("data-v-39c53dcd");const p={class:"container"},f=m("查询"),y=m("添加量具");d();const b=i(((e,l,a,u,d,s)=>{const m=o("el-input"),c=o("el-form-item"),b=o("el-option"),V=o("el-select"),h=o("el-button"),q=o("el-form"),_=o("MesuringTable");return n(),r("div",p,[t(q,{inline:!0,model:u.query,class:"demo-form-inline"},{default:i((()=>[t(c,{label:"量具名称"},{default:i((()=>[t(m,{modelValue:u.query.name,"onUpdate:modelValue":l[1]||(l[1]=e=>u.query.name=e),placeholder:"量具名称"},null,8,["modelValue"])])),_:1}),t(c,{label:"量具规格"},{default:i((()=>[t(m,{modelValue:u.query.specification,"onUpdate:modelValue":l[2]||(l[2]=e=>u.query.specification=e),placeholder:"量具规格"},null,8,["modelValue"])])),_:1}),t(c,{label:"量具编号"},{default:i((()=>[t(m,{modelValue:u.query.code,"onUpdate:modelValue":l[3]||(l[3]=e=>u.query.code=e),placeholder:"量具编号"},null,8,["modelValue"])])),_:1}),t(c,{label:"归属序号"},{default:i((()=>[t(m,{modelValue:u.query.serialNum,"onUpdate:modelValue":l[4]||(l[4]=e=>u.query.serialNum=e),placeholder:"归属序号"},null,8,["modelValue"])])),_:1}),t(c,{label:"数量"},{default:i((()=>[t(m,{modelValue:u.query.numbers,"onUpdate:modelValue":l[5]||(l[5]=e=>u.query.numbers=e),placeholder:"数量"},null,8,["modelValue"])])),_:1}),t(c,{label:"状态"},{default:i((()=>[t(V,{modelValue:u.query.status,"onUpdate:modelValue":l[6]||(l[6]=e=>u.query.status=e),placeholder:"状态",clearable:"",class:"handle-select mr10"},{default:i((()=>[t(b,{key:"2",label:"在使用",value:"USE"}),t(b,{key:"3",label:"已归还",value:"RETURN"})])),_:1},8,["modelValue"])])),_:1}),t(c,null,{default:i((()=>[t(h,{type:"primary",onClick:u.handleSearch},{default:i((()=>[f])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),t(h,{type:"primary",icon:"el-icon-plus",style:{"margin-bottom":"20px"},onClick:u.handleAdd},{default:i((()=>[y])),_:1},8,["onClick"]),t(_,{ref:"mesuringTable"},null,512)])}));c.render=b,c.__scopeId="data-v-39c53dcd";export default c;