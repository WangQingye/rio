var e=Object.defineProperty,l=Object.defineProperties,a=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,r=(l,a,t)=>a in l?e(l,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[a]=t;import{i as s,b as d,p as n,h as u,L as c,w as m,r as p,o as b,c as f,e as v,F as D,f as y,l as h,t as _,g as k}from"./vendor.86c6712b.js";import{_ as I}from"./MesuringTable.63d439f4.js";import{_ as V,i as S,j as C,k as w}from"./index.2615daba.js";import{a as j}from"./ProductDetail.382fd02a.js";import g from"./WorkList.53b037b4.js";import L from"./LendList.24363ece.js";const N={components:{BaseTable:I,ProductAdd:V,ProductDetail:j,LendList:L,WorkList:g},name:"product-manage",setup(){const e=s({userName:"",roleId:""}),n=d([]),u=d(0),p=d(),b=()=>{p.value.refresh(e)},f=d(!1);let v=d(null);const D=d(!1),y=d(null),h=d(null);S().then((e=>{y.value=e.data,h.value=[{label:"用户姓名",key:"realName",required:!0},{label:"用户角色",key:"role",required:!0,type:"select",options:e.data.map((e=>({label:e.roleName,value:e.id})))},{label:"手机号(登录账号)",key:"phone",required:!0,placeholder:""}]}));const _=d(!1),k=d({}),I=d("worklist");return{roleList:y,columns:[{label:"用户姓名",prop:"realName",slot:"realName"},{label:"手机号",prop:"phone"},{label:"用户角色",prop:"role",slot:"role"}],formItems:h,query:e,tableData:n,pageTotal:u,editVisible:f,handleSearch:b,handleDelete:e=>{c.confirm("确定要删除吗？","提示",{type:"warning"}).then((async()=>{await C({userId:e.id}),m.success("删除成功"),b()})).catch((()=>{}))},handleEdit:e=>{f.value=!0,v.value=e,v.value.role=e.roles[0].id},showDetail:e=>{v.value=e,D.value=!0},editItemData:v,editSubmit:async e=>{var s,d,n;await w((d=((e,l)=>{for(var a in l||(l={}))o.call(l,a)&&r(e,a,l[a]);if(t)for(var a of t(l))i.call(l,a)&&r(e,a,l[a]);return e})({id:null==(s=v.value)?void 0:s.id},e),n={password:e.phone},l(d,a(n)))),m.success("操作成功"),f.value=!1,b()},handleAdd:()=>{f.value=!0,v.value=null},detailVisible:D,userTable:p,userDetailVisible:_,userDetailInfo:k,showUserDetail:e=>{k.value=e,_.value=!0},detailActive:I}}},O=k();n("data-v-af6eda06");const P={class:"container"},T=h("查询"),q=h("添加用户"),A=h("编辑 "),E=h("删除"),U={class:"dialog-footer"},Y=h("关 闭");u();const x=O(((e,l,a,t,o,i)=>{const r=p("el-input"),s=p("el-form-item"),d=p("el-option"),n=p("el-select"),u=p("el-button"),c=p("el-form"),m=p("el-link"),k=p("BaseTable"),I=p("ProductAdd"),V=p("ProductDetail"),S=p("WorkList"),C=p("el-tab-pane"),w=p("LendList"),j=p("el-tabs"),g=p("el-dialog");return b(),f("div",null,[v("div",P,[v(c,{inline:!0,model:t.query,class:"demo-form-inline"},{default:O((()=>[v(s,{label:"用户姓名"},{default:O((()=>[v(r,{modelValue:t.query.userName,"onUpdate:modelValue":l[1]||(l[1]=e=>t.query.userName=e),placeholder:"用户姓名"},null,8,["modelValue"])])),_:1}),v(s,{label:"用户角色"},{default:O((()=>[v(n,{modelValue:t.query.roleId,"onUpdate:modelValue":l[2]||(l[2]=e=>t.query.roleId=e),placeholder:"用户角色",clearable:"",class:"handle-select mr10"},{default:O((()=>[(b(!0),f(D,null,y(t.roleList,(e=>(b(),f(d,{label:e.roleName,key:e.id,value:e.id},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])),_:1}),v(s,null,{default:O((()=>[v(u,{type:"primary",onClick:t.handleSearch},{default:O((()=>[T])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),v(u,{type:"primary",icon:"el-icon-plus",style:{"margin-bottom":"20px"},onClick:t.handleAdd},{default:O((()=>[q])),_:1},8,["onClick"]),v(k,{cols:t.columns,ref:"userTable",url:"/rui_ao/users"},{realName:O((e=>[v(m,{href:"javascript:void(0)",type:"primary",onClick:l=>t.showUserDetail(e.scopeData)},{default:O((()=>[h(_(e.scopeData.realName),1)])),_:2},1032,["onClick"])])),role:O((e=>[v("span",null,_({SYS_ADMIN:"系统管理员",SYS_EMPLOYEE:"普通员工",SYS_CONTACT:"外协联络员",SYS_PRODUCT:"生产管理员",SYS_STORE:"仓库管理员"}[e.scopeData.roles[0].roleCode]),1)])),operation:O((e=>[v(u,{type:"text",icon:"el-icon-edit",onClick:l=>t.handleEdit(e.scopeData)},{default:O((()=>[A])),_:2},1032,["onClick"]),v(u,{type:"text",icon:"el-icon-delete",class:"red",onClick:l=>t.handleDelete(e.scopeData)},{default:O((()=>[E])),_:2},1032,["onClick"])])),_:1},8,["cols"])]),v(I,{visible:t.editVisible,onClose:l[3]||(l[3]=e=>t.editVisible=!1),itemData:t.editItemData,formItems:t.formItems,onDialogSubmit:t.editSubmit},null,8,["visible","itemData","formItems","onDialogSubmit"]),v(V,{visible:t.detailVisible,onClose:l[4]||(l[4]=e=>t.detailVisible=!1),itemData:t.editItemData},null,8,["visible","itemData"]),v(g,{"append-to-body":!0,title:`用户详情 - ${t.userDetailInfo.realName}`,modelValue:t.userDetailVisible,"onUpdate:modelValue":l[7]||(l[7]=e=>t.userDetailVisible=e),"destroy-on-close":!0,"show-close":!1,"close-on-click-modal":!1,"close-on-press-escape":!1,width:"80%"},{footer:O((()=>[v("span",U,[v(u,{onClick:l[6]||(l[6]=e=>t.userDetailVisible=!1)},{default:O((()=>[Y])),_:1})])])),default:O((()=>[v(j,{modelValue:t.detailActive,"onUpdate:modelValue":l[5]||(l[5]=e=>t.detailActive=e)},{default:O((()=>[v(C,{label:"工作列表",name:"worklist"},{default:O((()=>[v(S,{userId:t.userDetailInfo.id},null,8,["userId"])])),_:1}),v(C,{label:"领用清单",name:"lendlist"},{default:O((()=>[v(w,{userId:t.userDetailInfo.id},null,8,["userId"])])),_:1})])),_:1},8,["modelValue"])])),_:1},8,["title","modelValue"])])}));N.render=x,N.__scopeId="data-v-af6eda06";export default N;
