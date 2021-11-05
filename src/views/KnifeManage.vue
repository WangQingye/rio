<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="采购单位">
          <el-input v-model="query.address"
            placeholder="采购单位"></el-input>
        </el-form-item>
        <el-form-item label="刀具名称">
          <el-input v-model="query.address"
            placeholder="刀具名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="query.address"
            placeholder="规格型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px;"
        @click="handleAdd">添加刀具</el-button>
      <BaseTable :cols="columns"
        :needOperation="false"
        :url="'/knife'">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === '成功'? 'success': slotProps.scopeData.status === '失败'? 'danger': ''">{{ slotProps.scopeData.status }}</el-tag>
        </template>
        <template v-slot:type="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="handleLendingRecords(slotProps.scopeData)">{{slotProps.scopeData.type}}</el-link>
        </template>
        <template v-slot:company="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="handBuyRecords(slotProps.scopeData)">{{slotProps.scopeData.company}}</el-link>
        </template>
        <!-- <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-document"
            class="color-success"
            @click="handleLendingRecords(slotProps.scopeData)">领用记录
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
        </template> -->
      </BaseTable>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      :propTitle="'添加刀具'"
      @dialog-submit="editSubmit"></ProductAdd>
    <el-dialog :title="`领用记录 - ${editItemData && editItemData.type}` "
      v-model="lendingRecordsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-form :inline="true"
        :model="lendQuery"
        class="demo-form-inline">
        <el-form-item label="领用人">
          <el-input v-model="lendQuery.user"
            placeholder="领用人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleLendSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="showAddLend">
        领用
      </el-button>
      <BaseTable :cols="lendingRecordsColumns"
        :url="'/knifeLendRecords'">
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
      :propTitle="'领用刀具'"
      @dialog-submit="addLendSubmit"></ProductAdd>
    <ProductAdd :visible="returnMesuringVisible"
      @close="returnMesuringVisible = false"
      :formItems="returnMesuringItems"
      :propTitle="'归还刀具'"
      @dialog-submit="returnMesuringSubmit"></ProductAdd>
    <el-dialog :title="`采购记录 - ${editItemData && editItemData.company}` "
      v-model="buyRecordsVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-form :inline="true"
        :model="buyQuery"
        class="demo-form-inline">
        <el-form-item label="刀具名称">
          <el-input v-model="buyQuery.knifeName"
            placeholder="刀具名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="buyQuery.knifeType"
            placeholder="规格型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleBuySearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="showAddBuy">
        添加记录
      </el-button>
      <BaseTable :cols="buyRecordsColumns"
        :url="'/knifeBuyRecords'">
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            @click="showReturnMesuring(slotProps.scopeData)">编辑
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="buyRecordsVisible = false">关 闭</el-button>
        </span>
      </template>
      <ProductAdd :visible="addBuyVisible"
        @close="addBuyVisible = false"
        :formItems="addBuyFormItems"
        :propTitle="'添加购买记录'"
        @dialog-submit="addBuySubmit"></ProductAdd>
    </el-dialog>
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
    const lendQuery = ref({
      user: '',
    })
    const handleLendSearch = () => {}
    // 添加借出记录
    const addLendVisible = ref(false)
    const showAddLend = (row) => {
      addLendVisible.value = true
    }
    const addLendFormItems = [
      { label: '领用人', key: 'lendUser', required: true },
      { label: '领用数量', key: 'lendNum', required: true, type: 'number' },
      {
        label: '领用类型',
        key: 'lendType',
        required: true,
        type: 'select',
        options: [
          { label: '全新', value: 'new' },
          { label: '二次使用', value: 'reuse' },
        ],
      },
      { label: '备注', key: 'remark', required: true, type: 'textarea' },
    ]
    const addLendSubmit = (formData) => {
      console.log(formData)
    }
    // 归还
    const returnMesuringVisible = ref(false)
    const editLendRecord = ref(null)
    const returnMesuringItems = [
      { label: '归还数量', key: 'num', required: true, type: 'returnNum' },
      {
        label: '归还后可二次使用数量',
        key: 'num',
        required: true,
        type: 'reuseNum',
      },
      { label: '废品数量', key: 'num', required: true, type: 'disuseNum' },
    ]
    const showReturnMesuring = (row) => {
      returnMesuringVisible.value = true
      editLendRecord.value = row
    }
    const returnMesuringSubmit = (formData) => {
      console.log(formData)
    }

    // 购买记录相关
    const buyRecordsVisible = ref(false)
    const handBuyRecords = (row) => {
      buyRecordsVisible.value = true
      editItemData.value = row
    }
    const buyQuery = ref({
      knifeName: '',
      knifeType: '',
    })
    const handleBuySearch = () => {}
    const addBuyVisible = ref(false)
    const showAddBuy = (row) => {
      addLendVisible.value = true
    }
    const addBuySubmit = () => {
      console.log()
    }
    return {
      columns: [
        {
          label: '采购单位',
          prop: 'company',
          slot: 'company',
        },
        {
          label: '刀具名称',
          prop: 'name',
        },
        {
          label: '规格型号',
          prop: 'type',
          slot: 'type',
        },
        {
          label: '库房存放点',
          prop: 'storePlace',
        },
        {
          label: '库房剩余数量',
          prop: 'restNum',
        },
        {
          label: '总购数量',
          prop: 'totalNum',
        },
        {
          label: '归还后可二次使用数量',
          prop: 'reuseNum',
        },
        {
          label: '废品数量',
          prop: 'disuseNum',
        },
      ],
      formItems: [
        { label: '采购单位', key: 'company' },
        { label: '刀具名称', key: 'knifeName' },
        { label: '规格型号', key: 'knifeType' },
        { label: '库房存放点', key: 'storePlace' },
        {
          label: '总购数量',
          key: 'totalNum',
        },
        {
          label: '归还后可二次使用数量',
          key: 'reuseNum',
        },
        {
          label: '废品数量',
          key: 'disuseNum',
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
      handleLendingRecords,
      lendingRecordsColumns: [
        {
          label: '领用人',
          prop: 'lendUser',
        },
        {
          label: '领用数量',
          prop: 'lendNum',
        },
        {
          label: '领用日期',
          prop: 'lendTime',
        },
        {
          label: '归还数量',
          prop: 'returnNum',
        },
        {
          label: '归还后可二次使用数量',
          prop: 'reuseNum',
        },
        {
          label: '废品数量',
          prop: 'disuseNum',
        },
        {
          label: '还回日期',
          prop: 'returnTime',
        },
        {
          label: '归属序号',
          prop: 'fromIndex',
        },
        {
          label: '零件代号',
          prop: 'partId',
        },
        {
          label: '零件名称',
          prop: 'partName',
        },
        {
          label: '采购单价',
          prop: 'price',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ],
      lendingRecordsVisible,
      lendQuery,
      handleLendSearch,
      showAddLend,
      addLendVisible,
      addLendFormItems,
      addLendSubmit,
      showReturnMesuring,
      returnMesuringVisible,
      returnMesuringItems,
      returnMesuringSubmit,
      buyRecordsVisible,
      handBuyRecords,
      buyQuery,
      handleBuySearch,
      addBuyVisible,
      showAddBuy,
      addBuySubmit,
      buyRecordsColumns: [
        {
          label: '生产厂家',
          prop: 'company',
        },
        {
          label: '刀具名称',
          prop: 'knifeName',
        },
        {
          label: '规格型号',
          prop: 'knifeType',
        },
        {
          label: '采购时间',
          prop: 'buyTime',
        },
        {
          label: '采购数量',
          prop: 'buyNum',
        },
        {
          label: '采购单价',
          prop: 'price',
        },
        {
          label: '回厂时间',
          prop: 'backTime',
        },
      ],
      addBuyFormItems: [
        {
          label: '采购单位',
          key: 'company',
          required: true,
        },
        {
          label: '刀具名称',
          key: 'knifeName',
          required: true,
        },
        {
          label: '规格型号',
          key: 'knifeType',
        },
        {
          label: '采购时间',
          key: 'buyTime',
          required: true,
        },
        {
          label: '采购数量',
          key: 'buyNum',
          required: true,
        },
        {
          label: '采购单价',
          key: 'price',
          required: true,
        },
        {
          label: '回厂时间',
          key: 'backTime',
          required: true,
        },
      ],
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
