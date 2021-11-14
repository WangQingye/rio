<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="采购单位">
          <el-input v-model="query.purchaseUnit"
            placeholder="采购单位"></el-input>
        </el-form-item>
        <el-form-item label="刀具名称">
          <el-input v-model="query.name"
            placeholder="刀具名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="query.specification"
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
        ref="cutterTable"
        :url="'/cutter-manage/pages'">
        <template v-slot:specification="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="handleLendingRecords(slotProps.scopeData, true)">{{slotProps.scopeData.specification}}</el-link>
        </template>
        <template v-slot:purchaseUnit="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="handBuyRecords(slotProps.scopeData)">{{slotProps.scopeData.purchaseUnit}}</el-link>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-document"
            class="color-success"
            @click="handleLendingRecords(slotProps.scopeData, false)">领用记录
          </el-button>
          <el-button type="text"
            icon="el-icon-goods"
            style="margin-left:0"
            @click="showAddBuy(slotProps.scopeData)">
            添加购买记录
          </el-button>
          <!-- <el-button type="text"
            icon="el-icon-edit"
            style="margin-left:0"
            @click="handleEdit(slotProps.scopeData)">编辑
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleDelete(slotProps.scopeData)">删除</el-button> -->
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      :propTitle="'添加刀具'"
      @dialog-submit="editSubmit"></ProductAdd>
    <el-dialog :title="`领用记录 - ${editItemData && editItemData.specification}` "
      v-model="lendingRecordsVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-form :inline="true"
        :model="lendQuery"
        class="demo-form-inline">
        <el-form-item label="领用人">
          <UserSelect v-model:userData="lendQuery.user"
            style="width: 200px">
          </UserSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleLendSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        v-if="!lendDialogTypeFlag"
        @click="showAddLend">
        领用
      </el-button>
      <BaseTable :cols="lendingRecordsColumns"
        ref="cutterLendRecordTable"
        :url="'/cutter-manage/claims/pages'"
        :queryBase="lendDialogTypeFlag ? {'specification':editItemData.specification} : {'cutters':editItemData.id}">
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            @click="showReturnMesuring(slotProps.scopeData)">归还
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleLendRecordDelete(slotProps.scopeData)">删除</el-button>
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
    <el-dialog :title="`采购记录 - ${editItemData && editItemData.purchaseUnit}` "
      v-model="buyRecordsVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-form :inline="true"
        :model="buyQuery"
        class="demo-form-inline">
        <el-form-item label="刀具名称">
          <el-input v-model="buyQuery.name"
            placeholder="刀具名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="buyQuery.specification"
            placeholder="规格型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleBuySearch">查询</el-button>
        </el-form-item>
      </el-form>
      <BaseTable :cols="buyRecordsColumns"
        ref="cutterBuyTable"
        :queryBase="{'companyName':editItemData.purchaseUnit}"
        :url="'/cutter-manage/buy/record/pages'">
        <template v-slot:operation="slotProps">
          <!-- <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            @click="showEditBuy(slotProps.scopeData)">编辑
          </el-button> -->
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleDeleteBuyRecord(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="buyRecordsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <ProductAdd :visible="addBuyVisible"
      @close="addBuyVisible = false"
      :formItems="addBuyFormItems"
      :propTitle="`${editBuyRecordItem ? '编辑' : '添加'}购买记录 - ${editItemData?.purchaseUnit} - ${editItemData?.name} - ${editItemData?.specification}` "
      @dialog-submit="addBuySubmit"></ProductAdd>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../api/index'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import UserSelect from '@/components/UserSelect.vue'
import ProductDetail from './ProductDetail.vue'
import {
  addCutter,
  editCutterBuyRecord,
  delCutterBuyRecord,
  lendCutter,
  returnCutter,
  delCutterLendRecords,
} from '@/api/cutter'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
    UserSelect,
  },
  name: 'product-manage',
  setup() {
    const query = reactive({
      purchaseUnit: '',
      name: '',
      specification: '',
      pageIndex: 1,
      pageSize: 10,
    })
    // 查询操作
    const cutterTable = ref()
    const handleSearch = () => {
      cutterTable.value.refresh(query)
    }
    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          ElMessage.success('删除成功')
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
    const editSubmit = async (formData) => {
      await addCutter({ id: editItemData.value?.id, ...formData })
      ElMessage.success('添加成功')
      editVisible.value = false
      handleSearch()
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      editItemData.value = row
      detailVisible.value = true
    }

    // 借出记录相关
    const lendingRecordsVisible = ref(false)
    // 型号为true，刀具为false
    const lendDialogTypeFlag = ref(false)
    const handleLendingRecords = (row, flag) => {
      lendingRecordsVisible.value = true
      lendDialogTypeFlag.value = flag
      editItemData.value = row
    }
    const lendQuery = reactive({
      user: '',
    })
    const cutterLendRecordTable = ref({})
    const handleLendSearch = () => {
      cutterLendRecordTable.value.refresh(lendQuery)
    }
    // 添加借出记录
    const addLendVisible = ref(false)
    const showAddLend = (row) => {
      addLendVisible.value = true
    }
    const addLendFormItems = [
      { label: '领用人', key: 'user', required: true, type: 'user' },
      { label: '领用数量', key: 'nums', required: true, type: 'number' },
      {
        label: '领用类型',
        key: 'useStatus',
        required: true,
        type: 'select',
        options: [
          { label: '全新', value: 'NEW_CUTTER' },
          { label: '二次使用', value: 'OLD_CUTTER' },
        ],
      },
      {
        label: '归属序号',
        key: 'serial',
        required: true,
        placeholder: '用于加工哪个序号',
      },
      { label: '备注', key: 'remark', required: true, type: 'textarea' },
    ]
    const addLendSubmit = async (formData) => {
      await lendCutter({
        cutter: editItemData.value?.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      addLendVisible.value = false
      handleLendSearch()
    }
    // 归还
    const returnMesuringVisible = ref(false)
    const editLendRecord = ref(null)
    const returnMesuringItems = [
      { label: '归还数量', key: 'retNum', required: true, type: 'number' },
      {
        label: '归还后可二次使用数量',
        key: 'availableNum',
        required: true,
        type: 'number',
      },
      { label: '废品数量', key: 'badNum', required: true, type: 'number' },
    ]
    const showReturnMesuring = (row) => {
      returnMesuringVisible.value = true
      editLendRecord.value = row
    }
    const returnMesuringSubmit = async (formData) => {
      await returnCutter({
        id: editLendRecord.value?.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      returnMesuringVisible.value = false
      handleLendSearch()
    }
    const handleLendRecordDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delCutterLendRecords({
            recordId: row.id,
          })
          ElMessage.success('删除成功')
          handleLendSearch()
        })
        .catch(() => {})
    }

    // 购买记录相关
    const buyRecordsVisible = ref(false)
    const handBuyRecords = (row) => {
      buyRecordsVisible.value = true
      editItemData.value = row
    }
    const buyQuery = reactive({
      name: '',
      specification: '',
    })
    const cutterBuyTable = ref({})
    const handleBuySearch = () => {
      cutterBuyTable.value.refresh(buyQuery)
    }
    const addBuyVisible = ref(false)
    const editBuyRecordItem = ref(null)
    const showAddBuy = (row) => {
      addBuyVisible.value = true
      editItemData.value = row
      editBuyRecordItem.value = null
    }
    const showEditBuy = (row) => {
      addBuyVisible.value = true
      editBuyRecordItem.value = row
    }
    const addBuySubmit = async (formData) => {
      await editCutterBuyRecord({
        cutters: editItemData.value?.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      addBuyVisible.value = false
      handleSearch()
    }
    const handleDeleteBuyRecord = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？删除后库存将减少', '提示', {
        type: 'danger',
      })
        .then(async () => {
          await delCutterBuyRecord({
            recordId: row.id,
          })
          ElMessage.success('删除成功')
          handleBuySearch()
        })
        .catch(() => {})
    }
    return {
      columns: [
        {
          label: '采购单位',
          prop: 'purchaseUnit',
          slot: 'purchaseUnit',
        },
        {
          label: '刀具名称',
          prop: 'name',
        },
        {
          label: '规格型号',
          prop: 'specification',
          slot: 'specification',
        },
        {
          label: '库房存放点',
          prop: 'locations',
        },
        {
          label: '库房剩余数量',
          prop: 'surplus',
        },
        {
          label: '总购数量',
          prop: 'totalBuy',
        },
        {
          label: '归还后可二次使用数量',
          prop: 'returnNums',
        },
        {
          label: '废品数量',
          prop: 'waste',
        },
      ],
      formItems: [
        { label: '采购单位', key: 'purchaseUnit' },
        { label: '刀具名称', key: 'name' },
        { label: '规格型号', key: 'specification' },
        { label: '库房存放点', key: 'locations' },
        {
          label: '总购数量',
          key: 'totalBuy',
        },
        {
          label: '库房剩余数量',
          key: 'surplus',
        },
        {
          label: '归还后可二次使用数量',
          key: 'returnNums',
        },
        {
          label: '废品数量',
          key: 'waste',
        },
      ],
      query,
      cutterTable,
      editVisible,
      handleSearch,
      handleDelete,
      handleEdit,
      showDetail,
      editItemData,
      editSubmit,
      handleAdd,
      detailVisible,
      handleLendingRecords,
      handleLendRecordDelete,
      lendingRecordsColumns: [
        {
          label: '领用人',
          prop: 'userName',
        },
        {
          label: '领用数量',
          prop: 'useNumber',
        },
        {
          label: '归还数量',
          prop: 'retNum',
        },
        {
          label: '领用日期',
          prop: 'created',
        },
        {
          label: '归还后可二次使用数量',
          prop: 'retUseNum',
        },
        {
          label: '废品数量',
          prop: 'waste',
        },
        {
          label: '还回日期',
          prop: 'retTime',
        },
        {
          label: '归属序号',
          prop: 'serial',
        },
        {
          label: '零件代号',
          prop: 'partCode',
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
      cutterLendRecordTable,
      showAddLend,
      lendDialogTypeFlag,
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
      cutterBuyTable,
      handleBuySearch,
      addBuyVisible,
      showAddBuy,
      addBuySubmit,
      buyRecordsColumns: [
        {
          label: '生产厂家',
          prop: 'makeCompany',
        },
        {
          label: '刀具名称',
          prop: 'cutterName',
        },
        {
          label: '规格型号',
          prop: 'specification',
        },
        {
          label: '采购时间',
          prop: 'buyDate',
        },
        {
          label: '采购数量',
          prop: 'nums',
        },
        {
          label: '采购单价',
          prop: 'price',
        },
        {
          label: '回厂时间',
          prop: 'returnDate',
        },
      ],
      addBuyFormItems: [
        {
          label: '采购时间',
          key: 'buyDate',
          type: 'date',
          required: true,
        },
        {
          label: '采购数量',
          key: 'nums',
          required: true,
        },
        {
          label: '采购单价',
          key: 'price',
          required: true,
        },
        {
          label: '回厂时间',
          key: 'returnDate',
          type: 'date',
          required: true,
        },
      ],
      handleDeleteBuyRecord,
      showEditBuy,
      editBuyRecordItem,
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
