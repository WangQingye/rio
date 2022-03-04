<template v-if="toolTypeInfo">
  <div :key="toolTypeId">
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="query.name"
            placeholder="名称"></el-input>
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
        @click="handleAdd">{{`添加${toolTypeInfo?.name}`}}</el-button>
      <!-- <BaseTable :cols="columns"
        :url="'/tool-manage/tool/pages'"
        ref="toolTable"
        :queryBase="{'toolType': toolTypeId}"
        @edit="handleEdit">
        <template v-slot:purchaseUnit="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="handBuyRecords(slotProps.scopeData)">{{slotProps.scopeData.purchaseUnit}}</el-link>
        </template>
        <template v-for="(specialF,index) in specialFields"
          :key="index"
          v-slot:[specialF.slot]="slotProps">
          {{getSpecialFieldData(slotProps.scopeData.specialField, specialF.label)}}
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-document"
            class="color-success"
            @click="handleLendingRecords(slotProps.scopeData)">领用记录
          </el-button>
          <el-button type="text"
            icon="el-icon-goods"
            style="margin-left:0"
            @click="showAddBuy(slotProps.scopeData)">添加采购记录
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            style="margin-left:0"
            class="color-danger"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable> -->
      
    <el-table :data="tableData" border
      class="table">
      <el-table-column prop="purchaseUnit" label="采购单位">
        <template #default="scope">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="handBuyRecords(scope.row)">{{scope.row.purchaseUnit}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="specification" label="规格型号"></el-table-column>
      <el-table-column prop="locations" label="库房存放点"></el-table-column>
      <el-table-column prop="availableNum" label="库房剩余数量"></el-table-column>
      <el-table-column prop="totalBuy" label="总购数量"></el-table-column>
      <el-table-column prop="waste" label="报废数量"></el-table-column>
      <el-table-column v-for="col in specialFields"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label">
        <template #default="scope">
          {{getSpecialFieldData(scope.row.specialField, col.label)}}
          <!-- <span>111</span> -->
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="140">
        <template #default="scope">
          <el-button type="text"
            icon="el-icon-document"
            class="color-success"
            @click="handleLendingRecords(scope.row)">领用记录
          </el-button>
          <el-button type="text"
            icon="el-icon-goods"
            style="margin-left:0"
            @click="showAddBuy(scope.row)">添加采购记录
          </el-button>
          <el-button type="text"
            icon="el-icon-edit"
            style="margin-left:0; margin-right:10px"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text"
            icon="el-icon-delete"
            style="margin-left:0"
            class="color-danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
    class="pagination"
      layout="total, prev, pager, next"
      :current-page="query.pageNo"
      :page-size="query.pageSize"
      :total="toolPageTotal"
      @current-change="handleToolPageChange"></el-pagination>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      @dialog-submit="editSubmit"></ProductAdd>
    <ProductAdd :visible="addBuyVisible"
      @close="addBuyVisible = false"
      :formItems="addBuyFormItems"
      :propTitle="'添加购买记录'"
      @dialog-submit="addBuySubmit"></ProductAdd>
    <el-dialog :title="`领用记录 - ${editItemData && editItemData.name}` "
      v-model="lendingRecordsVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%">
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom:20px"
        @click="showAddLend">
        领用
      </el-button>
      <BaseTable :cols="lendingRecordsColumns"
        ref="lendRecordTable"
        :queryBase="{'tool': editItemData.id}"
        :url="'/tool-manage/claims/page'">
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            v-show="!slotProps.scopeData.retNum || (slotProps.scopeData.useNumber > slotProps.scopeData.retNum)"
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
      <ProductAdd :visible="addLendVisible"
        @close="addLendVisible = false"
        :formItems="addLendFormItems"
        :propTitle="'领用工具'"
        @dialog-submit="addLendSubmit"></ProductAdd>
      <ProductAdd :visible="returnMesuringVisible"
        @close="returnMesuringVisible = false"
        :formItems="returnMesuringItems"
        :propTitle="'归还工具'"
        @dialog-submit="returnMesuringSubmit"></ProductAdd>
    </el-dialog>
    <el-dialog :title="`采购记录 - ${editItemData && editItemData.purchaseUnit}` "
      v-model="buyRecordsVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-form :inline="true"
        :model="buyQuery"
        class="demo-form-inline">
        <el-form-item label="工具名称">
          <el-input v-model="buyQuery.name"
            placeholder="工具名称"></el-input>
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
        ref="buyRecordTable"
        :queryBase="{'toolType': toolTypeId, 'companyName': editItemData.purchaseUnit}"
        :url="'/tool-manage/buy/record/pages'">
        <template v-slot:operation="slotProps">
          <!-- <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            @click="showReturnMesuring(slotProps.scopeData)">编辑
          </el-button> -->
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleBuyRecordDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="buyRecordsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, watch, computed, ref, reactive, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import { useStore } from 'vuex'
import {
  editTool,
  delTool,
  editToolBuyRecord,
  lendTool,
  returnTool,
  delToolLendRecords,
  delToolBuyRecord,
} from '@/api/tool'

import { getList } from '@/api/index'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
  },
  name: 'tool-manage',
  setup() {
    const route = useRoute()
    const store = useStore()
    const columns = ref()
    const formItems = ref()
    const toolTypeId = ref(null)
    const toolTypeInfo = ref(null)
    const initToolInfo = () => {
      if (!toolTypeId.value) toolTypeId.value = route.query.id
      columns.value = [
        { label: '采购单位', prop: 'purchaseUnit', slot: 'purchaseUnit' },
        { label: '名称', prop: 'name' },
        { label: '规格型号', prop: 'specification' },
        { label: '库房存放点', prop: 'locations' },
        { label: '库房剩余数量', prop: 'availableNum' },
        { label: '总购数量', prop: 'totalBuy' },
      ]
      formItems.value = [
        { label: '采购单位', key: 'purchaseUnit', required: true },
        { label: '名称', key: 'name', required: true },
        { label: '规格型号', key: 'specification', required: true },
        { label: '库房存放点', key: 'locations', required: true },
        { label: '库房剩余数量', key: 'availableNum', required: true },
        { label: '总购数量', key: 'totalBuy', required: true },
      ]
      nextTick(() => {
        toolTypeInfo.value = store.state.toolTypes.find(
          (t) => t.id == route.query.id
        )
        if (toolTypeInfo.value?.specField) {
          toolTypeInfo.value.specField.split('|').forEach((f, index) => {
            columns.value.push({
              label: f,
              prop: 'key' + index,
              slot: 'key' + index,
            })
            formItems.value.push({
              label: f,
              key: 'key' + index,
              required: false,
            })
          })
        }
        handleSearch()
      })
    }
    const specialFields = computed(() => {
      if (toolTypeInfo.value?.specField) {
        return toolTypeInfo.value.specField.split('|').map((f, index) => {
          return {
            label: f,
            prop: 'key' + index,
            slot: 'key' + index
          }
        })
      } else {
        return []
      }
    })
    const getSpecialFieldData = (specialRowData, label) => {
      if (!specialRowData) return ''
      let specialData = JSON.parse(specialRowData)
      if (specialData[label] !== undefined) {
        return specialData[label]
      }
      return ''
    }
    console.log('setup run')
    onMounted(() => {
      initToolInfo()
    })
    const toolTable = ref({})
    const query = reactive({
      name: '',
      specification: '',
      pageNo: 1,
      pageSize: 20
    })
    const tableData = ref([])
    const toolPageTotal = ref(0)
    // 分页导航
    const handleToolPageChange = (val) => {
      query.pageNo = val
      handleSearch(true)
    }
    // 查询操作
    const handleSearch = (keepNowPage) => {
      if (!keepNowPage) query.pageNo = 1
      getList('/tool-manage/tool/pages', {...query, toolType: toolTypeId.value }).then((res) => {
        tableData.value = res.data.records
        toolPageTotal.value = res.data.total || 0
      })
    }

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delTool({ toolId: row.id })
          ElMessage.success('删除成功')
          handleSearch()
        })
        .catch(() => {})
    }

    // 表格编辑时弹窗和保存
    const editVisible = ref(false)
    let editItemData = ref(null)
    const handleEdit = (row) => {
      let disArr = ['purchaseUnit', 'availableNum', 'totalBuy']
      formItems.value.forEach(item => {
        if (disArr.includes(item.key)) {
          item.disabled = true
        }
      })
      let editData = JSON.parse(JSON.stringify(row))
      let specialData = JSON.parse(row.specialField)
      specialFields.value.forEach((f) => {
        editData[f.prop] = specialData[f.label]
      })
      // console.log(row)
      // console.log(formItems.value)
      editVisible.value = true
      editItemData.value = editData
    }

    const handleAdd = () => {      
      formItems.value.forEach(item => {
          item.disabled = false
      })
      editVisible.value = true
      editItemData.value = null
    }
    const editSubmit = async (formData) => {
      let specialField = {}
      toolTypeInfo.value.specField.split('|').forEach((f, index) => {
        specialField[f] = formData['key' + index]
        delete formData['key' + index]
      })
      await editTool({
        toolType: toolTypeId.value,
        id: editItemData.value?.id,
        ...formData,
        specialField: JSON.stringify(specialField),
      })
      ElMessage.success('添加成功')
      editVisible.value = false
      handleSearch(true)
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      editItemData.value = row
      detailVisible.value = true
    }

    // 领用记录相关
    const lendingRecordsVisible = ref(false)
    const lendRecordTable = ref({})
    const handleLendingRecords = (row) => {
      lendingRecordsVisible.value = true
      editItemData.value = row
    }
    // 添加领用记录
    const addLendVisible = ref(false)
    const showAddLend = (row) => {
      addLendVisible.value = true
    }
    const addLendSubmit = async (formData) => {
      await lendTool({
        tool: editItemData.value?.id,
        ...formData,
      })
      ElMessage.success('领用成功')
      addLendVisible.value = false
      lendRecordTable.value.refresh({}, true)
    }
    // 归还
    const returnMesuringVisible = ref(false)
    const editLendRecord = ref(null)
    const returnMesuringItems = [
      { label: '归还入库数量', key: 'nums', required: false, type: 'number' },
      { label: '报废数量', key: 'waste', required: false, type: 'number' },
    ]
    const showReturnMesuring = (row) => {
      returnMesuringVisible.value = true
      editLendRecord.value = row
    }
    const returnMesuringSubmit = async (formData) => {
      if (!formData.nums && !formData.waste) {
        ElMessage.error('入库数量和报废数量不能同时为空')
      }
      await returnTool({
        id: editLendRecord.value?.id,
        ...formData,
      })
      ElMessage.success('归还成功')
      returnMesuringVisible.value = false
      lendRecordTable.value.refresh({}, true)
    }
    // 删除领用记录
    const handleLendRecordDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delToolLendRecords({ recordId: row.id })
          ElMessage.success('删除成功')
          lendRecordTable.value.refresh()
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
    const buyRecordTable = ref({})
    const handleBuySearch = () => {
      buyRecordTable.value.refresh(buyQuery)
    }
    const addBuyVisible = ref(false)
    const showAddBuy = (row) => {
      addBuyVisible.value = true
      editItemData.value = row
    }
    const addBuySubmit = async (formData) => {
      // return
      await editToolBuyRecord({
        tool: editItemData.value?.id,
        ...formData,
      })
      ElMessage.success('添加成功')
      addBuyVisible.value = false
      handleSearch(true)
    }
    // 删除领用记录
    const handleBuyRecordDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delToolBuyRecord({ recordId: row.id })
          ElMessage.success('删除成功')
          handleBuySearch()
          handleSearch(true)
        })
        .catch(() => {})
    }
    return {
      toolTypeId,
      toolTypeInfo,
      columns,
      formItems,
      query,
      toolTable,
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
      lendingRecordsColumns: [
        {
          label: '领用人',
          prop: 'userName',
        },
        {
          label: '领用日期',
          prop: 'created',
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
          label: '报废数量',
          prop: 'waste',
        },
        {
          label: '归还时间',
          prop: 'retTime',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ],
      lendingRecordsVisible,
      showAddLend,
      addLendVisible,
      lendRecordTable,
      addLendFormItems: [
        { label: '领用人', key: 'user', required: true, type: 'user' },
        { label: '领用数量', key: 'number', required: true, type: 'number' },
        { label: '备注', key: 'remark', required: true, type: 'textarea' },
      ],
      addLendSubmit,
      showReturnMesuring,
      returnMesuringVisible,
      returnMesuringItems,
      returnMesuringSubmit,
      handleLendRecordDelete,
      handBuyRecords,
      handBuyRecords,
      buyQuery,
      buyRecordTable,
      handleBuySearch,
      addBuyVisible,
      showAddBuy,
      addBuySubmit,
      buyRecordsVisible,
      handleBuyRecordDelete,
      buyRecordsColumns: [
        {
          label: '采购单位',
          prop: 'makeCompany',
        },
        {
          label: '名称',
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
          required: true,
          type: 'date',
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
          required: true,
          type: 'date',
        },
      ],
      initToolInfo,
      specialFields,
      getSpecialFieldData,
      tableData,
      toolPageTotal,
      handleToolPageChange
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
