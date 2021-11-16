var e=Object.defineProperty,a=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable,o=(a,l,t)=>l in a?e(a,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[l]=t,r=(e,r)=>{for(var s in r||(r={}))l.call(r,s)&&o(e,s,r[s]);if(a)for(var s of a(r))t.call(r,s)&&o(e,s,r[s]);return e};import{j as s,d as i,p as u,i as d,w as n,r as p,o as c,c as m,f as b,m as f,t as y,s as h,h as k}from"./vendor.b5aa390e.js";import{_ as v}from"./MesuringTable.6d60c92d.js";import{s as S,_ as w}from"./index.4d78699e.js";import{a as N}from"./ProductDetail.0fa2cf7a.js";const C={components:{BaseTable:v,ProductAdd:w,ProductDetail:N},name:"product-manage",setup(){const e=s({partName:"",productCode:"",partCode:""}),a=i({}),l=()=>{a.value.refresh(e)},t=i(null),o=i(!1),u=i(!1);return{columns:[{label:"产品代号",prop:"productCode"},{label:"零件代号",prop:"partCode"},{label:"零件名称",prop:"partName"},{label:"工序",prop:"workingName"},{label:"操作设备",prop:"deviceName"},{label:"状态",prop:"status",slot:"status"},{label:"要求完工时间",prop:"needFinalDate"},{label:"开工时间",prop:"startDate"},{label:"完工时间",prop:"finalDate"},{label:"接受产品数量",prop:"acceptAmt"},{label:"合格产品数量",prop:"qualAmt"},{label:"工序单价（元）",prop:"price"}],query:e,handleSearch:l,handleWorkStatus:(e,a)=>{t.value=e,"start"===a?u.value=!0:"finish"===a&&(o.value=!0)},worklistTable:a,finishEditVisible:o,finishEditSubmit:async e=>{await(e=>S({url:`/work-shop-manage/close/${e.workId}`,method:"put",params:e}))(r({workId:t.value.id},e)),n.success("操作成功"),o.value=!1,l()},finishStartVisible:u,finishStartSubmit:async e=>{await(e=>S({url:`/work-shop-manage/start/${e.workId}`,method:"put",params:e}))(r({workId:t.value.id},e)),n.success("操作成功"),u.value=!1,l()}}}},D=k();u("data-v-4ce988d0");const g={class:"container"},V=f("查询"),_=f("开工 "),q=f("完成");d();const I=D(((e,a,l,t,o,r)=>{const s=p("el-input"),i=p("el-form-item"),u=p("el-button"),d=p("el-form"),n=p("el-tag"),k=p("BaseTable"),v=p("ProductAdd");return c(),m("div",null,[b("div",g,[b(d,{inline:!0,model:t.query,class:"demo-form-inline"},{default:D((()=>[b(i,{label:"产品代号"},{default:D((()=>[b(s,{modelValue:t.query.productCode,"onUpdate:modelValue":a[1]||(a[1]=e=>t.query.productCode=e),placeholder:"产品代号"},null,8,["modelValue"])])),_:1}),b(i,{label:"零件代号"},{default:D((()=>[b(s,{modelValue:t.query.partCode,"onUpdate:modelValue":a[2]||(a[2]=e=>t.query.partCode=e),placeholder:"零件代号"},null,8,["modelValue"])])),_:1}),b(i,{label:"零件名称"},{default:D((()=>[b(s,{modelValue:t.query.partName,"onUpdate:modelValue":a[3]||(a[3]=e=>t.query.partName=e),placeholder:"零件名称"},null,8,["modelValue"])])),_:1}),b(i,null,{default:D((()=>[b(u,{type:"primary",onClick:t.handleSearch},{default:D((()=>[V])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),b(k,{cols:t.columns,ref:"worklistTable",url:"/work-shop-manage/work/pages"},{status:D((e=>[b(n,{type:"NORMAL"===e.scopeData.status?"warning":"RUNNING"===e.scopeData.status?"primary":"success"},{default:D((()=>[f(y({NORMAL:"未开工",RUNNING:"已开工",CLOSED:"已完工"}[e.scopeData.status]),1)])),_:2},1032,["type"])])),operation:D((e=>["NORMAL"==e.scopeData.status?(c(),m(u,{key:0,type:"primary",icon:"el-icon-video-play",style:{"margin-left":"0"},onClick:a=>t.handleWorkStatus(e.scopeData,"start")},{default:D((()=>[_])),_:2},1032,["onClick"])):h("",!0),"RUNNING"==e.scopeData.status?(c(),m(u,{key:1,type:"success",icon:"el-icon-finished",onClick:a=>t.handleWorkStatus(e.scopeData,"finish")},{default:D((()=>[q])),_:2},1032,["onClick"])):h("",!0)])),_:1},8,["cols"])]),b(v,{visible:t.finishStartVisible,onClose:a[4]||(a[4]=e=>t.finishStartVisible=!1),title:"开工填报",formItems:[{label:"接受产品数量",key:"acceptAmt",required:!1}],key:"product-edit",onDialogSubmit:t.finishStartSubmit},null,8,["visible","onDialogSubmit"]),b(v,{visible:t.finishEditVisible,onClose:a[5]||(a[5]=e=>t.finishEditVisible=!1),title:"完工填报",formItems:[{label:"合格产品数量",key:"qualAmt",required:!1}],key:"product-edit",onDialogSubmit:t.finishEditSubmit},null,8,["visible","onDialogSubmit"])])}));C.render=I,C.__scopeId="data-v-4ce988d0";export default C;