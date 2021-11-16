<template>
  <div class="container">
    <el-form :inline="true"
      :model="query"
      class="demo-form-inline">
      <el-form-item label="量具名称">
        <el-input v-model="query.name"
          placeholder="量具名称"></el-input>
      </el-form-item>
      <el-form-item label="量具规格">
        <el-input v-model="query.specification"
          placeholder="量具规格"></el-input>
      </el-form-item>
      <el-form-item label="量具编号">
        <el-input v-model="query.code"
          placeholder="量具编号"></el-input>
      </el-form-item>
      <el-form-item label="归属序号">
        <el-input v-model="query.serialNum"
          placeholder="归属序号"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="query.numbers"
          placeholder="数量"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status"
          placeholder="状态"
          clearable
          class="handle-select mr10">
          <!-- <el-option key="1"
              label="在库房"
              value="STORAGE"></el-option> -->
          <el-option key="2"
            label="在厂使用"
            value="USE"></el-option>
          <el-option key="3"
            label="已归还甲方"
            value="RETURN"></el-option>
        </el-select>
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
      specification: '',
      name: '',
      code: '',
      serialNum: '',
      numbers: '',
      status: '',
    })
    // 查询操作
    let mesuringTable = ref(null)
    const handleSearch = () => {
      mesuringTable.value.handleSearch(query)
    }
    const handleAdd = () => {
      mesuringTable.value.handleAdd()
    }

    return {
      query,
      handleSearch,
      mesuringTable,
      handleAdd,
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
