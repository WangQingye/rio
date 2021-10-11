import{z as e,A as l,p as a,a as t,L as o,B as s,r as n,o as d,c as i,f as r,h as u,t as c,w as m}from"./vendor.e430a4a4.js";import{_ as p,a as b,b as g,f}from"./ProductDetail.cbb09a8f.js";const y={components:{BaseTable:p,ProductAdd:b,ProductDetail:g},name:"product-manage",setup(){const a=e({address:"",name:"",pageIndex:1,pageSize:10}),t=l([]),n=l(0),d=()=>{f(a).then((e=>{t.value=e.list,n.value=e.pageTotal||50}))},i=l(!1);let r=l(null);const u=l(!1),c=l(!1),m=l(!1),p=l(!1),b=l(null);return{columns:[{label:"量具规格",prop:"mesuringSpecs"},{label:"量具编号",prop:"mesuringId"},{label:"归属任务号",prop:"taskId",slot:"taskId"},{label:"状态",prop:"status"},{label:"剩余数量",prop:"restNum"},{label:"总数",prop:"totalNum"}],formItems:[{label:"量具规格",key:"mesuringSpecs",required:!0},{label:"量具编号",key:"mesuringId",required:!0},{label:"归属任务号",key:"taskId",required:!0,type:"select",options:[{label:"J2101-1050D(E)",value:"J2101-1050D(E)"}]},{label:"状态",key:"status",required:!0},{label:"总数量",key:"totalNum",required:!0}],query:a,tableData:t,pageTotal:n,editVisible:i,handleSearch:()=>{a.pageIndex=1,d()},handlePageChange:e=>{a.pageIndex=e,d()},handleDelete:e=>{o.confirm("确定要删除吗？","提示",{type:"warning"}).then((()=>{s.success("删除成功"),t.value.splice(e,1)})).catch((()=>{}))},handleEdit:e=>{i.value=!0,r.value=e},showDetail:e=>{r.value=e,u.value=!0},editItemData:r,editSubmit:e=>{console.log(e)},handleAdd:()=>{i.value=!0,r.value=null},detailVisible:u,handleLendingRecords:e=>{c.value=!0,r.value=e},lendingRecordsColumns:[{label:"领用人",prop:"lendUser"},{label:"领用时间",prop:"lendTime"},{label:"领用数量",prop:"lendnum"},{label:"当前状态",prop:"status"},{label:"归还时间",prop:"returnTime"},{label:"备注",prop:"remark"}],lendingRecordsVisible:c,showAddLend:e=>{m.value=!0},addLendVisible:m,addLendFormItems:[{label:"出借人",key:"lendUser",required:!0},{label:"出借数量",key:"num",required:!0,type:"number"},{label:"备注",key:"remark",required:!0,type:"textarea"}],addLendSubmit:e=>{console.log(e)},showReturnMesuring:e=>{p.value=!0,b.value=e},returnMesuringVisible:p,returnMesuringItems:[{label:"归还数量",key:"num",required:!0,type:"number"}],returnMesuringSubmit:e=>{console.log(e)}}}},k=m();a("data-v-a93e85fc");const D={class:"container"},h=u("查询"),v=u("添加量具"),I=u("出借记录 "),V=u("编辑 "),C=u("删除"),_=u(" 借出 "),q=u("归还 "),S=u("删除"),x={class:"dialog-footer"},L=u("关 闭");t();const R=k(((e,l,a,t,o,s)=>{const m=n("el-input"),p=n("el-form-item"),b=n("el-button"),g=n("el-form"),f=n("el-tag"),y=n("el-link"),R=n("BaseTable"),w=n("ProductAdd"),M=n("el-dialog");return d(),i("div",null,[r("div",D,[r(g,{inline:!0,model:t.query,class:"demo-form-inline"},{default:k((()=>[r(p,{label:"量具编号"},{default:k((()=>[r(m,{modelValue:t.query.address,"onUpdate:modelValue":l[1]||(l[1]=e=>t.query.address=e),placeholder:"量具编号"},null,8,["modelValue"])])),_:1}),r(p,{label:"量具名称"},{default:k((()=>[r(m,{modelValue:t.query.address,"onUpdate:modelValue":l[2]||(l[2]=e=>t.query.address=e),placeholder:"量具名称"},null,8,["modelValue"])])),_:1}),r(p,{label:"归属批次号"},{default:k((()=>[r(m,{modelValue:t.query.address,"onUpdate:modelValue":l[3]||(l[3]=e=>t.query.address=e),placeholder:"归属批次号"},null,8,["modelValue"])])),_:1}),r(p,null,{default:k((()=>[r(b,{type:"primary",onClick:t.handleSearch},{default:k((()=>[h])),_:1},8,["onClick"])])),_:1})])),_:1},8,["model"]),r(b,{type:"primary",icon:"el-icon-plus",style:{"margin-bottom":"20px"},onClick:t.handleAdd},{default:k((()=>[v])),_:1},8,["onClick"]),r(R,{cols:t.columns,url:"/mesuring",onEdit:t.handleEdit},{status:k((e=>[r(f,{type:"成功"===e.scopeData.status?"success":"失败"===e.scopeData.status?"danger":""},{default:k((()=>[u(c(e.scopeData.status),1)])),_:2},1032,["type"])])),taskId:k((e=>[r(y,{href:"javascript:void(0)",type:"primary",onClick:l=>t.showDetail(e.scopeData)},{default:k((()=>[u(c(e.scopeData.taskId),1)])),_:2},1032,["onClick"])])),operation:k((e=>[r(b,{type:"text",icon:"el-icon-document",class:"color-success",onClick:l=>t.handleLendingRecords(e.scopeData)},{default:k((()=>[I])),_:2},1032,["onClick"]),r(b,{type:"text",icon:"el-icon-edit",style:{"margin-left":"0"},onClick:l=>t.handleEdit(e.scopeData)},{default:k((()=>[V])),_:2},1032,["onClick"]),r(b,{type:"text",icon:"el-icon-delete",class:"color-danger",onClick:l=>t.handleDelete(e.scopeData)},{default:k((()=>[C])),_:2},1032,["onClick"])])),_:1},8,["cols","onEdit"])]),r(w,{visible:t.editVisible,onClose:l[4]||(l[4]=e=>t.editVisible=!1),itemData:t.editItemData,formItems:t.formItems,onDialogSubmit:t.editSubmit},null,8,["visible","itemData","formItems","onDialogSubmit"]),r(M,{title:`出借记录 - ${t.editItemData&&t.editItemData.mesuringId}`,modelValue:t.lendingRecordsVisible,"onUpdate:modelValue":l[6]||(l[6]=e=>t.lendingRecordsVisible=e),"close-on-click-modal":!1,"close-on-press-escape":!1,width:"60%"},{footer:k((()=>[r("span",x,[r(b,{onClick:l[5]||(l[5]=e=>t.lendingRecordsVisible=!1)},{default:k((()=>[L])),_:1})])])),default:k((()=>[r(b,{type:"primary",icon:"el-icon-plus",style:{"margin-bottom":"20px"},onClick:t.showAddLend},{default:k((()=>[_])),_:1},8,["onClick"]),r(R,{cols:t.lendingRecordsColumns,url:"/lendRecords"},{operation:k((e=>[r(b,{type:"text",icon:"el-icon-download",class:"color-success",onClick:l=>t.showReturnMesuring(e.scopeData)},{default:k((()=>[q])),_:2},1032,["onClick"]),r(b,{type:"text",icon:"el-icon-delete",class:"color-danger",onClick:l=>t.handleDelete(e.scopeData)},{default:k((()=>[S])),_:2},1032,["onClick"])])),_:1},8,["cols"])])),_:1},8,["title","modelValue"]),r(w,{visible:t.addLendVisible,onClose:l[7]||(l[7]=e=>t.addLendVisible=!1),formItems:t.addLendFormItems,propTitle:"借出量具",onDialogSubmit:t.addLendSubmit},null,8,["visible","formItems","onDialogSubmit"]),r(w,{visible:t.returnMesuringVisible,onClose:l[8]||(l[8]=e=>t.returnMesuringVisible=!1),formItems:t.returnMesuringItems,propTitle:"归还量具",onDialogSubmit:t.returnMesuringSubmit},null,8,["visible","formItems","onDialogSubmit"])])}));y.render=R,y.__scopeId="data-v-a93e85fc";export default y;
