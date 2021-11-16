<template>
  <div>
    <!-- <el-dropdown style="float:right;margin-bottom:10px" v-if="needExport">
      <el-button type="primary"
        size="small">
        导出表格<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>导出当页</el-dropdown-item>
          <el-dropdown-item>导出全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
    <el-button type="primary" v-if="needExport" style="float:right;margin-bottom:10px"
      size="small" @click="exportTable">
      导出表格
    </el-button>
    <el-table :data="url ? tableData : tableRealData"
      :border="!noBorder"
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header">
      <el-table-column v-for="col in cols"
        :key="col.prop"
        :prop="col.prop"
        :width="col.width || ''"
        :label="col.label">
        <template #default="scope">
          <slot :name="col.slot"
            v-bind:scopeData="scope.row"
            v-if="col.slot"></slot>
          <span v-else>{{ scope.row[col.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="needOperation"
        label="操作"
        width="140">
        <template #default="scope">
          <slot name="operation"
            v-bind:scopeData="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination"
      v-if="!noPager">
      <el-pagination background
        layout="total, prev, pager, next"
        :current-page="query.pageNo"
        :page-size="query.pageSize"
        :total="pageTotal"
        @current-change="handlePageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { getExcel, getList } from '../api/index'

export default {
  name: 'basetable',
  props: {
    cols: {
      type: Array,
      required: true,
    },
    url: {
      type: String,
    },
    tableRealData: {
      type: Array,
    },
    needOperation: {
      type: Boolean,
      default: true,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    noPager: {
      type: Boolean,
      default: false,
    },
    needExport: {
      type: Boolean,
      default: false,
    },
    queryBase: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const query = reactive({
      pageNo: 1,
      pageSize: 10,
    })
    const tableData = ref([])
    const pageTotal = ref(0)
    // 获取表格数据
    const getData = () => {
      if (props.url) {
        getList(props.url, { ...query, ...props.queryBase }).then((res) => {
          tableData.value = res.data.records
          pageTotal.value = res.data.total || 0
        })
      }
    }
    getData()
    // 查询操作
    const handleSearch = () => {
      query.pageNo = 1
      getData()
    }
    // 分页导航
    const handlePageChange = (val) => {
      query.pageNo = val
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
    let form = reactive({
      name: '',
      address: '',
    })
    const handleEdit = (row) => {
      context.emit('edit', row)
    }
    const refresh = (searchData) => {
      query.pageNo = 1
      for (const key in searchData) {
        // if (searchData[key] !== '') {
        query[key] = searchData[key]
        // }
      }
      getData()
    }
    const exportTable = () => {
      getExcel(props.url, { ...query, ...props.queryBase })
    }
    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      refresh,
      exportTable
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
.red {
  color: #ff0000;
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
