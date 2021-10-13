<template>
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
      <el-form-item label="归属序号">
        <el-input v-model="query.address"
          placeholder="归属序号"></el-input>
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
      <MesuringTable ref="mesuringTable"></MesuringTable>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import MesuringTable from './MesuringTable.vue'

export default {
  components: {
    MesuringTable,
  },
  name: 'mesuring-manage',
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
    let mesuringTable = ref(null)
    const handleAdd = () => {
      mesuringTable.value.handleAdd()
    }

    return {
      query,
      handleSearch,
      mesuringTable,
      handleAdd
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
