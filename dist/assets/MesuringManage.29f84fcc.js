import{a as e}from"./MesuringTable.4d1cd74b.js";import{B as l,i as a,p as d,a as u,r,o,c as s,f as n,w as t,h as m}from"./vendor.783501fb.js";import"./index.4c0ae215.js";const c={components:{MesuringTable:e},name:"mesuring-manage",setup(){const e=l({address:"",name:"",pageIndex:1,pageSize:10});let d=a(null);return{query:e,handleSearch:()=>{e.pageIndex=1},mesuringTable:d,handleAdd:()=>{d.value.handleAdd()}}}},p=t();d("data-v-4affec60");const i={class:"container"},f=m("查询"),y=m("添加量具");u();const b=p(((e,l,a,d,u,t)=>{const m=r("el-input"),c=r("el-form-item"),b=r("el-option"),V=r("el-select"),h=r("el-button"),q=r("el-form"),_=r("MesuringTable");return o(),s("div",i,[n(q,{inline:!0,model:d.query,class:"demo-form-inline"},{default:p((()=>[n(c,{label:"量具名称"},{default:p((()=>[n(m,{modelValue:d.query.address,"onUpdate:modelValue":l[1]||(l[1]=e=>d.query.address=e),placeholder:"量具名称"},null,8,["modelValue"])])),_:1}),n(c,{label:"量具规格"},{default:p((()=>[n(m,{modelValue:d.query.address,"onUpdate:modelValue":l[2]||(l[2]=e=>d.query.address=e),placeholder:"量具规格"},null,8,["modelValue"])])),_:1}),n(c,{label:"量具编号"},{default:p((()=>[n(m,{modelValue:d.query.address,"onUpdate:modelValue":l[3]||(l[3]=e=>d.query.address=e),placeholder:"量具编号"},null,8,["modelValue"])])),_:1}),n(c,{label:"归属序号"},{default:p((()=>[n(m,{modelValue:d.query.address,"onUpdate:modelValue":l[4]||(l[4]=e=>d.query.address=e),placeholder:"归属序号"},null,8,["modelValue"])])),_:1}),n(c,{label:"数量"},{default:p((()=>[n(m,{modelValue:d.query.address,"onUpdate:modelValue":l[5]||(l[5]=e=>d.query.address=e),placeholder:"数量"},null,8,["modelValue"])])),_:1}),n(c,{label:"状态"},{default:p((()=>[n(V,{modelValue:d.query.address,"onUpdate:modelValue":l[6]||(l[6]=e=>d.query.address=e),placeholder:"状态",class:"handle-select mr10"},{default:p((()=>[n(b,{key:"1",label:"在库房",value:"在库房"}),n(b,{key:"2",label:"在使用",value:"在使用"}),n(b,{key:"3",label:"已归还",value:"已归还"})])),_:1},8,["modelValue"])])),_:1}),n(c,null,{default:p((()=>[n(h,{type:"primary",onClick:d.handleSearch},{default:p((()=>[f])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),n(h,{type:"primary",icon:"el-icon-plus",style:{"margin-bottom":"20px"},onClick:d.handleAdd},{default:p((()=>[y])),_:1},8,["onClick"]),n(_,{ref:"mesuringTable"},null,512)])}));c.render=b,c.__scopeId="data-v-4affec60";export default c;