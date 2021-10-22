<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="序号">
          <el-input v-model="query.address"
            placeholder="序号"></el-input>
        </el-form-item>
        <el-form-item label="任务号">
          <el-input v-model="query.address"
            placeholder="任务号"></el-input>
        </el-form-item>
        <el-form-item label="产品代号">
          <el-input v-model="query.address"
            placeholder="产品代号"></el-input>
        </el-form-item>
        <el-form-item label="零件代号">
          <el-input v-model="query.address"
            placeholder="零件代号"></el-input>
        </el-form-item>
        <el-form-item label="零件名称">
          <el-input v-model="query.address"
            placeholder="零件名称"></el-input>
        </el-form-item>
        <el-form-item label="调度备注">
          <el-input v-model="query.address"
            placeholder="调度备注"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.address"
            placeholder="状态"
            class="handle-select mr10">
            <el-option key="1"
              label="在线"
              value="在线"></el-option>
            <el-option key="2"
              label="完结"
              value="完结"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px;"
        @click="handleAdd">添加批次</el-button>
      <BaseTable :cols="columns">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === '成功'? 'success': slotProps.scopeData.status === '失败'? 'danger': ''">{{ slotProps.scopeData.status }}</el-tag>
        </template>
        <template v-slot:index="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showDetail(slotProps.scopeData)">{{slotProps.scopeData.index}}</el-link>
        </template>
        <template v-slot:partId="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showPartDetail(slotProps.scopeData)">{{slotProps.scopeData.partId}}</el-link>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-edit"
            @click="handleEdit(slotProps.scopeData)">编辑
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      key="product-edit"
      @dialog-submit="editSubmit"></ProductAdd>
    <ProductDetail :visible="detailVisible"
      @close="detailVisible = false"
      key="detail"
      :itemData="editItemData"></ProductDetail>
    <PartDetail :visible="partDetailVisible"
      @close="partDetailVisible = false"
      key="detail"
      :partId="detailPartId"></PartDetail>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../api/index'
import BaseTable from '@/components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import PartDetail from './PartDetail.vue'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
    PartDetail
  },
  name: 'product-manage',
  setup() {
    const query = reactive({
      address: '',
      name: '',
      pageIndex: 1,
      pageSize: 10,
    })
    const tableData = ref([])
    const pageTotal = ref(0)
    // 获取表格数据
    const getData = () => {
      fetchData(query).then((res) => {
        tableData.value = res.list
        pageTotal.value = res.pageTotal || 50
      })
    }
    getData()

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1
      getData()
    }
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val
      getData()
    }

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          ElMessage.success('删除成功')
          tableData.value.splice(index, 1)
        })
        .catch(() => {})
    }

    const editVisible = ref(false)
    const editItemData = ref(null)
    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = null
    }
    // 表格编辑时弹窗和保存
    const handleEdit = (row) => {
      editVisible.value = true
      editItemData.value = row
    }
    const editSubmit = (row) => {
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      detailVisible.value = true
      editItemData.value = row
    }

    // 零件生产详情
    const partDetailVisible = ref(false)
    const detailPartId = ref('')
    const showPartDetail = (row) => {
      partDetailVisible.value = true
      detailPartId.value = row.partId
    }
    return {
      columns: [
        {
          label: '序号',
          prop: 'index',
          slot: 'index',
        },
        {
          label: '任务号',
          prop: 'taskId'
        },
        {
          label: '产品代号',
          prop: 'productId',
        },
        {
          label: '零件代号',
          prop: 'partId',
          slot: 'partId',
        },
        {
          label: '零件名称',
          prop: 'partName',
        },
        {
          label: '图纸工序',
          prop: 'blueprintProcess',
        },
        {
          label: '本厂实际工序',
          prop: 'factoryProcess',
        },
        {
          label: '回厂数量',
          prop: 'backFactoryNum',
        },
        {
          label: '回厂日期',
          prop: 'backFactoryTime',
        },
        {
          label: '调度备注',
          prop: 'dispatchRemark',
        },
        {
          label: '甲方要求回厂时间',
          prop: 'customerBackFactoryTime',
        },
        {
          label: '状态',
          prop: 'status',
          slot: 'status',
        },
        {
          label: '备注',
          prop: 'remark',
        },
        {
          label: '出厂数量',
          prop: 'outFactoryNum',
        },
        {
          label: '出厂时间',
          prop: 'outFactoryTime',
        },
        {
          label: '最终甲方检验合格数',
          prop: 'finalCustomerQualifiedNum',
        },
      ],
      formItems: [
        { label: '序号', key: 'index', required: true },
        { label: '任务号', key: 'taskId', required: true },
        { label: '产品代号', key: 'productId', required: true },
        { label: '零件代号', key: 'partId', required: true },
        { label: '名称', key: 'name', required: true },
        { label: '图纸工序', key: 'blueprintProcess', required: true },
        { label: '本厂实际工序', key: 'factoryProcess', required: true },
        { label: '回厂数量', key: 'backFactoryNum', required: true },
        {
          label: '回厂日期',
          key: 'backFactoryTime',
          required: true,
          type: 'date',
        },
        { label: '调度备注', key: 'dispatchRemark', required: true },
        {
          label: '甲方要求回厂时间',
          key: 'customerBackFactoryTime',
          required: true,
          type: 'date',
        },
        { label: '状态', key: 'status', required: true },
        { label: '备注', key: 'remark', required: true },
        { label: '出厂数量', key: 'outFactoryNum', required: true },
        {
          label: '出厂时间',
          key: 'outFactoryTime',
          required: true,
          type: 'date',
        },
        {
          label: '最终甲方检验合格数',
          key: 'finalCustomerQualifiedNum',
          required: true,
        },
      ],
      query,
      tableData,
      pageTotal,
      editVisible,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      showDetail,
      editItemData,
      editSubmit,
      handleAdd,
      detailVisible,
      partDetailVisible,
      detailPartId,
      showPartDetail
    }
  },
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
