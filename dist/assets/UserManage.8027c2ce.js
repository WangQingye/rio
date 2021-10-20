import{B as e,i as a,p as l,a as t,L as o,E as s,r as i,o as d,c as n,f as r,h as u,t as c,w as m}from"./vendor.783501fb.js";import{f as p}from"./index.cc8f9e19.js";import{_ as b,b as f}from"./MesuringTable.525c0010.js";import{a as v}from"./ProductDetail.b6d0352e.js";const y={components:{BaseTable:b,ProductAdd:f,ProductDetail:v},name:"product-manage",setup(){const l=e({address:"",name:"",pageIndex:1,pageSize:10}),t=a([]),i=a(0),d=()=>{p(l).then((e=>{t.value=e.list,i.value=e.pageTotal||50}))};d();const n=a(!1);let r=a(null);const u=a(!1);return{columns:[{label:"用户名",prop:"userName"},{label:"用户角色",prop:"role"},{label:"联系方式",prop:"contact"}],formItems:[{label:"用户名",key:"userName",required:!0},{label:"用户角色",key:"role",required:!0,type:"select",options:[{label:"管理员",value:"admin"},{label:"仓库管理员",value:"storeAdmin"},{label:"生产管理员",value:"productAdmin"},{label:"普通员工",value:"employee"}]},{label:"联系方式",key:"contact",required:!0,placeholder:"联系方式即为登录账号"}],query:l,tableData:t,pageTotal:i,editVisible:n,handleSearch:()=>{l.pageIndex=1,d()},handlePageChange:e=>{l.pageIndex=e,d()},handleDelete:e=>{o.confirm("确定要删除吗？","提示",{type:"warning"}).then((()=>{s.success("删除成功"),t.value.splice(e,1)})).catch((()=>{}))},handleEdit:e=>{n.value=!0,r.value=e},showDetail:e=>{r.value=e,u.value=!0},editItemData:r,editSubmit:e=>{console.log(e)},handleAdd:()=>{n.value=!0,r.value=null},detailVisible:u}}},D=m();l("data-v-4cec8aa6");const h={class:"container"},k=u("查询"),g=u("添加用户"),_=u("编辑 "),C=u("删除");t();const I=D(((e,a,l,t,o,s)=>{const m=i("el-input"),p=i("el-form-item"),b=i("el-option"),f=i("el-select"),v=i("el-button"),y=i("el-form"),I=i("el-tag"),V=i("el-link"),q=i("BaseTable"),x=i("ProductAdd"),A=i("ProductDetail");return d(),n("div",null,[r("div",h,[r(y,{inline:!0,model:t.query,class:"demo-form-inline"},{default:D((()=>[r(p,{label:"用户名"},{default:D((()=>[r(m,{modelValue:t.query.address,"onUpdate:modelValue":a[1]||(a[1]=e=>t.query.address=e),placeholder:"用户名"},null,8,["modelValue"])])),_:1}),r(p,{label:"用户角色"},{default:D((()=>[r(f,{modelValue:t.query.address,"onUpdate:modelValue":a[2]||(a[2]=e=>t.query.address=e),placeholder:"用户角色",class:"handle-select mr10"},{default:D((()=>[r(b,{key:"1",label:"管理员",value:"admin"}),r(b,{key:"2",label:"仓库管理员",value:"storeAdmin"}),r(b,{key:"3",label:"普通员工",value:"employee"})])),_:1},8,["modelValue"])])),_:1}),r(p,null,{default:D((()=>[r(v,{type:"primary",onClick:t.handleSearch},{default:D((()=>[k])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),r(v,{type:"primary",icon:"el-icon-plus",style:{"margin-bottom":"20px"},onClick:t.handleAdd},{default:D((()=>[g])),_:1},8,["onClick"]),r(q,{cols:t.columns,url:"/user"},{status:D((e=>[r(I,{type:"成功"===e.scopeData.status?"success":"失败"===e.scopeData.status?"danger":""},{default:D((()=>[u(c(e.scopeData.status),1)])),_:2},1032,["type"])])),taskId:D((e=>[r(V,{href:"javascript:void(0)",type:"primary",onClick:a=>t.showDetail(e.scopeData)},{default:D((()=>[u(c(e.scopeData.taskId),1)])),_:2},1032,["onClick"])])),operation:D((e=>[r(v,{type:"text",icon:"el-icon-edit",onClick:a=>t.handleEdit(e.scopeData)},{default:D((()=>[_])),_:2},1032,["onClick"]),r(v,{type:"text",icon:"el-icon-delete",class:"red",onClick:a=>t.handleDelete(e.scopeData)},{default:D((()=>[C])),_:2},1032,["onClick"])])),_:1},8,["cols"])]),r(x,{visible:t.editVisible,onClose:a[3]||(a[3]=e=>t.editVisible=!1),itemData:t.editItemData,formItems:t.formItems,onDialogSubmit:t.editSubmit},null,8,["visible","itemData","formItems","onDialogSubmit"]),r(A,{visible:t.detailVisible,onClose:a[4]||(a[4]=e=>t.detailVisible=!1),itemData:t.editItemData},null,8,["visible","itemData"])])}));y.render=I,y.__scopeId="data-v-4cec8aa6";export default y;
