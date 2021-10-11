<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="量具编号">
          <el-input v-model="query.address"
            placeholder="量具编号"></el-input>
        </el-form-item>
        <el-form-item label="量具名称">
          <el-input v-model="query.address"
            placeholder="量具名称"></el-input>
        </el-form-item>
        <el-form-item label="归属批次号">
          <el-input v-model="query.address"
            placeholder="归属批次号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px;"
        @click="handleAdd">添加量具</el-button>
      <BaseTable :cols="columns"
        :url="'/mesuring'"
        @edit="handleEdit">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === '成功'? 'success': slotProps.scopeData.status === '失败'? 'danger': ''">{{ slotProps.scopeData.status }}</el-tag>
        </template>
        <template v-slot:taskId="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showDetail(slotProps.scopeData)">{{slotProps.scopeData.taskId}}</el-link>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-document"
            class="color-success"
            @click="handleLendingRecords(slotProps.scopeData)">出借记录
          </el-button>
          <el-button type="text"
            icon="el-icon-edit"
            style="margin-left:0"
            @click="handleEdit(slotProps.scopeData)">编辑
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      @dialog-submit="editSubmit"></ProductAdd>
    <el-dialog :title="`出借记录 - ${editItemData && editItemData.mesuringId}` "
      v-model="lendingRecordsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%">
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="showAddLend">
        借出
      </el-button>
      <BaseTable :cols="lendingRecordsColumns"
        :url="'/lendRecords'">
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            @click="showReturnMesuring(slotProps.scopeData)">归还
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="lendingRecordsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <ProductAdd :visible="addLendVisible"
      @close="addLendVisible = false"
      :formItems="addLendFormItems"
      :propTitle="'借出量具'"
      @dialog-submit="addLendSubmit"></ProductAdd>
    <ProductAdd :visible="returnMesuringVisible"
      @close="returnMesuringVisible = false"
      :formItems="returnMesuringItems"
      :propTitle="'归还量具'"
      @dialog-submit="returnMesuringSubmit"></ProductAdd>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../api/index'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
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

    // 表格编辑时弹窗和保存
    const editVisible = ref(false)
    let editItemData = ref(null)
    const handleEdit = (row) => {
      editVisible.value = true
      editItemData.value = row
    }

    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = null
    }
    const editSubmit = (row) => {
      console.log(row)
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      editItemData.value = row
      detailVisible.value = true
    }

    // 借出记录相关
    const lendingRecordsVisible = ref(false)
    const handleLendingRecords = (row) => {
      lendingRecordsVisible.value = true
      editItemData.value = row
    }
    // 添加借出记录
    const addLendVisible = ref(false)
    const showAddLend = (row) => {
      addLendVisible.value = true
    }
    const addLendFormItems = [
      { label: '出借人', key: 'lendUser', required: true },
      { label: '出借数量', key: 'num', required: true, type: 'number' },
      { label: '备注', key: 'remark', required: true, type: 'textarea' },
    ]
    const addLendSubmit = (formData) => {
      console.log(formData)
    }
    // 归还
    const returnMesuringVisible = ref(false)
    const editLendRecord = ref(null)
    const returnMesuringItems = [
      { label: '归还数量', key: 'num', required: true, type: 'number' },
    ]
    const showReturnMesuring = (row) => {
      returnMesuringVisible.value = true
      editLendRecord.value = row
    }
    const returnMesuringSubmit = (formData) => {
      console.log(formData)
    }

    return {
      columns: [
        {
          label: '量具规格',
          prop: 'mesuringSpecs',
        },
        {
          label: '量具编号',
          prop: 'mesuringId',
        },
        {
          label: '归属任务号',
          prop: 'taskId',
          slot: 'taskId',
        },
        {
          label: '状态',
          prop: 'status',
        },
        {
          label: '剩余数量',
          prop: 'restNum',
        },
        {
          label: '总数',
          prop: 'totalNum',
        },
      ],
      formItems: [
        { label: '量具规格', key: 'mesuringSpecs', required: true },
        { label: '量具编号', key: 'mesuringId', required: true },
        {
          label: '归属任务号',
          key: 'taskId',
          required: true,
          type: 'select',
          options: [
            {
              label: 'J2101-1050D(E)',
              value: 'J2101-1050D(E)',
            },
          ],
        },
        { label: '状态', key: 'status', required: true },
        { label: '总数量', key: 'totalNum', required: true },
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
      handleLendingRecords,
      lendingRecordsColumns: [
        {
          label: '领用人',
          prop: 'lendUser',
        },
        {
          label: '领用时间',
          prop: 'lendTime',
        },
        {
          label: '领用数量',
          prop: 'lendnum',
        },
        {
          label: '当前状态',
          prop: 'status',
        },
        {
          label: '归还时间',
          prop: 'returnTime',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ],
      lendingRecordsVisible,
      showAddLend,
      addLendVisible,
      addLendFormItems,
      addLendSubmit,
      showReturnMesuring,
      returnMesuringVisible,
      returnMesuringItems,
      returnMesuringSubmit,
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
