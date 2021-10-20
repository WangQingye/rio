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
            @click="handleEdit(slotProps.scopeData)">开工
          </el-button>
          <el-button type="success"
            icon="el-icon-finished"
            v-if="slotProps.scopeData.status == '进行中'"
            @click="handleDelete(slotProps.scopeData)">完成</el-button>
        </template>
      </BaseTable>
    </div>
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
          label: '开始日期',
          prop: 'startTime'
        },
        {
          label: '结束日期',
          prop: 'endTime'
        },
      ],
      query,
      handleDelete
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
