import{B as e,p as a,a as l,L as o,E as r,r as s,o as n,c as t,f as d,w as u,h as p}from"./vendor.783501fb.js";import"./index.4c0ae215.js";import{_ as c,b as m}from"./MesuringTable.4d1cd74b.js";import{a as i}from"./ProductDetail.faf80dea.js";const b={components:{BaseTable:c,ProductAdd:m,ProductDetail:i},name:"product-manage",setup:()=>({columns:[{label:"物品名称",prop:"toolName"},{label:"规格型号",prop:"type"},{label:"领用时间",prop:"lendTime"},{label:"领用数量",prop:"lendNum"},{label:"归还数量",prop:"returnNum"},{label:"归还时间",prop:"returnTime"}],query:e({address:"",name:"",pageIndex:1,pageSize:10}),handleDelete:e=>{o.confirm("确定要删除吗？","提示",{type:"warning"}).then((()=>{r.success("删除成功"),tableData.value.splice(e,1)})).catch((()=>{}))}})},f=u();a("data-v-7b1aa01a");const y={class:"container"},h=p("查询");l();const _=f(((e,a,l,o,r,u)=>{const p=s("el-input"),c=s("el-form-item"),m=s("el-button"),i=s("el-form"),b=s("BaseTable");return n(),t("div",null,[d("div",y,[d(i,{inline:!0,model:o.query,class:"demo-form-inline"},{default:f((()=>[d(c,{label:"物品名称"},{default:f((()=>[d(p,{modelValue:o.query.address,"onUpdate:modelValue":a[1]||(a[1]=e=>o.query.address=e),placeholder:"物品名称"},null,8,["modelValue"])])),_:1}),d(c,null,{default:f((()=>[d(m,{type:"primary",onClick:e.handleSearch},{default:f((()=>[h])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),d(b,{cols:o.columns,needOperation:!1,url:"/lendlist"},null,8,["cols"])])])}));b.render=_,b.__scopeId="data-v-7b1aa01a";export default b;