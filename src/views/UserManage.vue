<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="query.address"
            placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="query.address"
            placeholder="用户角色"
            class="handle-select mr10">
            <el-option key="1"
              label="管理员"
              value="admin"></el-option>
            <el-option key="2"
              label="仓库管理员"
              value="storeAdmin"></el-option>
            <el-option key="3"
              label="普通员工"
              value="employee"></el-option>
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
        @click="handleAdd">添加用户</el-button>
      <BaseTable :cols="columns" :url="'/user'">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === '成功'? 'success': slotProps.scopeData.status === '失败'? 'danger': ''">{{ slotProps.scopeData.status }}</el-tag>
        </template>
        <template v-slot:taskId="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showDetail(slotProps.scopeData)">{{slotProps.scopeData.taskId}}</el-link>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-edit"
            @click="handleEdit(slotProps.scopeData)">编辑
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      @dialog-submit="editSubmit"></ProductAdd>
    <ProductDetail :visible="detailVisible"
      @close="detailVisible = false"
      :itemData="editItemData"></ProductDetail>
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
    const tableData = ref([])
    const pageTotal = ref(0)
    // 获取表格数据
    const getData = () => {
      fetchData(query).then((res) => {
        tableData.value = res.list
        pageTotal.value = res.pageTotal || 50
      })
    }
    getData()

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1
      getData()
    }
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val
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
    let editItemData = ref(null)
    const handleEdit = (row) => {
      editVisible.value = true
      editItemData.value = row
    }
    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = null
    }
    const editSubmit = (row) => {
      console.log(row)
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      editItemData.value = row
      detailVisible.value = true
    }
    return {
      columns: [
        {
          label: '用户名',
          prop: 'userName',
        },
        {
          label: '用户角色',
          prop: 'role',
        },
        {
          label: '联系方式',
          prop: 'contact',
        }
      ],
      formItems:[
        { label: '用户名', key: 'userName', required: true },
        {
          label: '用户角色',
          key: 'role',
          required: true,
          type: 'select',
          options: [
            {
              label: '管理员',
              value: 'admin',
            },
            {
              label: '仓库管理员',
              value: 'storeAdmin',
            },
            {
              label: '普通员工',
              value: 'employee',
            },
          ],
        },
        { label: '联系方式', key: 'contact', required: true, placeholder: '联系方式即为登录账号' }
      ],
      query,
      tableData,
      pageTotal,
      editVisible,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      showDetail,
      editItemData,
      editSubmit,
      handleAdd,
      detailVisible,
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
