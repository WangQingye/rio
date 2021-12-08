<template>
  <div>
    <BaseTable :cols="columns"
      ref="mesureTable"
      :needExport="!serialNum"
      :url="'/measures-manage/list'"
      :queryBase="serialNum? {'serialNum':serialNum} : {}"
      @edit="handleEdit">
      <template v-slot:status="slotProps">
        <el-tag :type="{'USE':'danger', 'STORAGE': 'primary', 'RETURN':'success'}[slotProps.scopeData.status]">{{ {'USE':'在厂使用', 'STORAGE': '在库房', 'RETURN':'已归还甲方'}[slotProps.scopeData.status] }}</el-tag>
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
      </template>
    </BaseTable>
    <el-dialog :title="`领用记录 - ${editItemData && editItemData.name}` "
      v-model="lendingRecordsVisible"
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
        ref="lendRecordsTable"
        :queryBase="{'measure':editItemData?.id}"
        :url="'/measures-manage/claims'">
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-download"
            class="color-success"
            v-if="!slotProps.scopeData.returnDate"
            @click="showReturnMesuring(slotProps.scopeData)">归还
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleLendRecordsDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="lendingRecordsVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      key="product-edit"
      @dialog-submit="editSubmit"></ProductAdd>
    <ProductAdd :visible="addLendVisible"
      @close="addLendVisible = false"
      :formItems="addLendFormItems"
      key="lend-add"
      :propTitle="'领用量具'"
      @dialog-submit="addLendSubmit"></ProductAdd>
    <ProductAdd :visible="returnMesuringVisible"
      @close="returnMesuringVisible = false"
      :formItems="returnMesuringItems"
      :propTitle="'归还量具'"
      @dialog-submit="returnMesuringSubmit"></ProductAdd>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import { useStore } from 'vuex'
import {
  editMesure,
  delMesure,
  lendMesure,
  returnMesure,
  delMesureLendRecords,
} from '@/api/mesure'

export default {
  components: {
    BaseTable,
    ProductAdd,
  },
  props: {
    serialNum: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore()
    const mesureTable = ref({})
    // 查询操作
    const handleSearch = (query) => {
      mesureTable.value.refresh(query)
    }

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delMesure({ mesureId: row.id })
          ElMessage.success('删除成功')
          handleSearch()
        })
        .catch(() => {})
    }

    // 表格编辑时弹窗和保存
    const editVisible = ref(false)
    let editItemData = ref(null)
    const handleEdit = (row) => {
      editVisible.value = true
      editItemData.value = row
      console.log(editItemData.value)
    }

    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = store.state.lastMesureData || {}
    }
    const editSubmit = async (formData) => {
      await editMesure({
        id: editItemData.value?.id,
        ...formData,
        availableNums: formData.numbers,
      })
      // 如果是添加，那么记录一下这次添加的数据，方便下次输入
      if (!editItemData.value.id) {
        store.commit('setLastMesureData', JSON.parse(JSON.stringify(formData)))
      }
      ElMessage.success('操作成功')
      editVisible.value = false
      handleSearch()
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      editItemData.value = row
      detailVisible.value = true
    }

    // 领用记录相关
    const lendRecordsTable = ref({})
    const lendingRecordsVisible = ref(false)
    const handleLendingRecords = (row) => {
      editItemData.value = row
      lendingRecordsVisible.value = true
    }
    // 添加领用记录
    const addLendVisible = ref(false)
    const showAddLend = () => {
      addLendVisible.value = true
    }
    const addLendSubmit = async (formData) => {
      await lendMesure({
        measure: editItemData.value.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      addLendVisible.value = false
      lendRecordsTable.value.refresh()
    }
    // 归还
    const returnMesuringVisible = ref(false)
    const editLendRecord = ref(null)
    const returnMesuringItems = [
      { label: '归还数量', key: 'nums', required: true, type: 'number' },
    ]
    const showReturnMesuring = (row) => {
      returnMesuringVisible.value = true
      editLendRecord.value = row
    }
    const returnMesuringSubmit = async (formData) => {
      await returnMesure({
        id: editLendRecord.value.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      returnMesuringVisible.value = false
      lendRecordsTable.value.refresh()
    }
    // 删除领用记录
    const handleLendRecordsDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delMesureLendRecords({ recordId: row.id })
          ElMessage.success('删除成功')
          lendRecordsTable.value.refresh()
        })
        .catch(() => {})
    }

    return {
      columns: [
        {
          label: '量具名称',
          prop: 'name',
        },
        {
          label: '量具规格',
          prop: 'specification',
        },
        {
          label: '量具编号',
          prop: 'code',
        },
        {
          label: '归属序号',
          prop: 'serialNum',
        },
        {
          label: '数量',
          prop: 'numbers',
        },
        {
          label: '库房存放点',
          prop: 'storage',
        },
        {
          label: '库房剩余数量',
          prop: 'availableNums',
        },
        {
          label: '状态',
          prop: 'status',
          slot: 'status',
        },
        {
          label: '入库时间',
          prop: 'putDate',
        },
        {
          label: '归还时间',
          prop: 'returnDate',
        },
      ],
      formItems: [
        {
          label: '量具名称',
          key: 'name',
          required: true,
          type: 'select',
          options: ['光面塞规', '空心光面塞规', '卡规', '螺纹塞规', '螺纹环规', '同轴度塞规', '航空螺纹塞规', '航空螺纹环规'].map((s) => {
            return {
              label: s,
              value: s
            }
          }),
          allowCreate: true,
          watchChange: true
        },
        { label: '量具规格', key: 'specification', required: true },
        { label: '量具编号', key: 'code', required: false },
        {
          label: '归属序号',
          key: 'serialNum',
          required: true,
          placeholder: '请关联已存在的序号',
        },
        { label: '数量', type: 'number', key: 'numbers', required: false },
        {
          label: '状态',
          key: 'status',
          required: true,
          type: 'select',
          options: [
            {
              label: '在厂使用',
              value: 'USE',
            },
            // {
            //   label: '在库房',
            //   value: 'STORAGE',
            // },
            {
              label: '已归还甲方',
              value: 'RETURN',
            },
          ],
        },
        { label: '入库时间', key: 'putDate', type: 'date', required: false },
        { label: '库房存放点', key: 'storage', required: false },
        {
          label: '归还时间',
          key: 'returnDate',
          type: 'date',
          required: false,
        },
      ],
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
          label: '还回日期',
          prop: 'returnDate',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ],
      lendingRecordsVisible,
      showAddLend,
      addLendVisible,
      addLendFormItems: [
        { label: '领用人', key: 'user', required: true, type: 'user' },
        { label: '领用数量', key: 'nums', required: true, type: 'number' },
        { label: '备注', key: 'remark', required: true, type: 'textarea' },
      ],
      addLendSubmit,
      showReturnMesuring,
      returnMesuringVisible,
      returnMesuringItems,
      returnMesuringSubmit,
      mesureTable,
      lendRecordsTable,
      handleLendRecordsDelete,
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
