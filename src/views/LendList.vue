<template>
  <div>
    <div :class="[!userId ? 'container' : '']">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="物品名称">
          <el-input v-model="query.name"
            placeholder="物品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <BaseTable :cols="columns"
        ref="lendTable"
        :queryBase="userId ? {'user': userId } : {}"
        :needOperation="false"
        :url="'/claim-list-manage/claim/pages'">
      </BaseTable>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
  },
  name: 'lend-list',
  props: {
    userId: {
      type: String,
      default: undefined
    }
  },
  setup() {
    const query = reactive({
      name: '',
    })
    const lendTable = ref({})
    const handleSearch = () => {
      lendTable.value.refresh(query)
    }
    return {
      columns: [
        {
          label: '物品名称',
          prop: 'name',
        },
        {
          label: '规格型号',
          prop: 'specification',
        },
        {
          label: '领用时间',
          prop: 'created',
        },
        {
          label: '领用数量',
          prop: 'num',
        },
        {
          label: '归还数量',
          prop: 'retNum',
        },
        {
          label: '最近归还时间',
          prop: 'retDate',
        },
      ],
      query,
      lendTable,
      handleSearch,
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
