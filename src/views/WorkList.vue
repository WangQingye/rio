<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="产品代号">
          <el-input v-model="query.productCode"
            placeholder="产品代号"></el-input>
        </el-form-item>
        <el-form-item label="零件代号">
          <el-input v-model="query.partCode"
            placeholder="零件代号"></el-input>
        </el-form-item>
        <el-form-item label="零件名称">
          <el-input v-model="query.partName"
            placeholder="零件名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <BaseTable :cols="columns"
        ref="worklistTable"
        :url="'/work-shop-manage/work/pages'">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === 'NORMAL'? 'warning': slotProps.scopeData.status === 'RUNNING'? 'primary': 'success'">{{ {'NORMAL':'未开工', 'RUNNING': '已开工', 'CLOSED': '已完工'}[slotProps.scopeData.status] }}</el-tag>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="primary"
            icon="el-icon-video-play"
            style="margin-left:0"
            v-if="slotProps.scopeData.status == 'NORMAL'"
            @click="handleWorkStatus(slotProps.scopeData, 'start')">开工
          </el-button>
          <el-button type="success"
            icon="el-icon-finished"
            v-if="slotProps.scopeData.status == 'RUNNING'"
            @click="handleWorkStatus(slotProps.scopeData, 'finish')">完成</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="finishStartVisible"
      @close="finishStartVisible = false"
      :title="'开工填报'"
      :formItems="[{
        label: '接受产品数量',
        key: 'acceptAmt',
        required: false
      }]"
      key="product-edit"
      @dialog-submit="finishStartSubmit"></ProductAdd>
    <ProductAdd :visible="finishEditVisible"
      @close="finishEditVisible = false"
      :title="'完工填报'"
      :formItems="[{
        label: '合格产品数量',
        key: 'qualAmt',
        required: false
      }]"
      key="product-edit"
      @dialog-submit="finishEditSubmit"></ProductAdd>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import { finishWork, startWork } from '@/api/worklist'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
  },
  name: 'product-manage',
  setup() {
    const query = reactive({
      partName: '',
      productCode: '',
      partCode: '',
    })
    // 查询操作
    const worklistTable = ref({})
    const handleSearch = () => {
      worklistTable.value.refresh(query)
    }

    // 删除操作
    const editItemData = ref(null)
    const finishEditVisible = ref(false)
    const finishStartVisible = ref(false)
    const handleWorkStatus = (row, status) => {
      editItemData.value = row
      if (status === 'start') {
        finishStartVisible.value = true
      } else if (status === 'finish') {
        finishEditVisible.value = true
      }
    }
    const finishStartSubmit = async (formData) => {
      await startWork({ workId: editItemData.value.id, ...formData })
      ElMessage.success('操作成功')
      finishStartVisible.value = false
      handleSearch()
    }
    const finishEditSubmit = async (formData) => {
      await finishWork({ workId: editItemData.value.id, ...formData })
      ElMessage.success('操作成功')
      finishEditVisible.value = false
      handleSearch()
    }
    return {
      columns: [
        {
          label: '产品代号',
          prop: 'productCode',
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
          label: '工序',
          prop: 'workingName',
        },
        {
          label: '操作设备',
          prop: 'deviceName',
        },
        {
          label: '状态',
          prop: 'status',
          slot: 'status',
        },
        {
          label: '要求完工时间',
          prop: 'needFinalDate',
        },
        {
          label: '开工时间',
          prop: 'startDate',
        },
        {
          label: '完工时间',
          prop: 'finalDate',
        },
        {
          label: '接受产品数量',
          prop: 'acceptAmt',
        },
        {
          label: '合格产品数量',
          prop: 'qualAmt',
        },
        {
          label: '工序单价（元）',
          prop: 'price',
        },
      ],
      query,
      handleSearch,
      handleWorkStatus,
      worklistTable,
      finishEditVisible,
      finishEditSubmit,
      finishStartVisible,
      finishStartSubmit,
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
