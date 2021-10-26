<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
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
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <BaseTable :cols="columns"
      :url="'/worklist'">
        <template v-slot:status="slotProps">
          <span>{{slotProps.scopeData.status}}</span>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="primary"
            icon="el-icon-video-play"
            style="margin-left:0"
            v-if="slotProps.scopeData.status == '未开始'"
            @click="handleWorkStatus(slotProps.scopeData, 'start')">开工
          </el-button>
          <el-button type="success"
            icon="el-icon-finished"
            v-if="slotProps.scopeData.status == '进行中'"
            @click="handleWorkStatus(slotProps.scopeData, 'finish')">完成</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="finishEditVisible"
      @close="finishEditVisible = false"
      :title="'完工填报'"
      :formItems="[{
        label: '合格产品数量',
        key: 'qualifiedNum',
        required: true
      }]"
      key="product-edit"
      @dialog-submit="finishEditSubmit"></ProductAdd>
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
    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1
    }

    // 删除操作
    const editItemData = ref(null)
    const finishEditVisible = ref(false)
    const handleWorkStatus = (row, status) => {
      editItemData.value = row
      if (status === 'start') {
        ElMessageBox.confirm('确定开始本工序吗？', '提示')
        .then(() => {
          ElMessage.success('操作成功')
        })
      } else if (status === 'finish') {
        finishEditVisible.value = true
      }
    }
    const finishEditSubmit = (formData) => {
      console.log(formData)
    }
    return {
      columns: [
        {
          label: '产品代号',
          prop: 'productId',
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
          label: '工序',
          prop: 'stepName',
        },
        {
          label: '操作设备',
          prop: 'equipment',
        },
        {
          label: '状态',
          prop: 'status',
          slot: 'status',
        },
        {
          label: '要求完工时间',
          prop: 'planFinishTime'
        },
        {
          label: '开工时间',
          prop: 'startTime'
        },
        {
          label: '完工时间',
          prop: 'endTime'
        },
        {
          label: '接受产品数量',
          prop: 'receiveNum'
        },
        {
          label: '合格产品数量',
          prop: 'qualifiedNum'
        },
        {
          label: '工序单价（元）',
          prop: 'stepPrice'
        },
      ],
      query,
      handleWorkStatus,
      finishEditVisible,
      finishEditSubmit
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
