<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="用户姓名">
          <el-input v-model="query.userName"
            placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="query.roleId"
            placeholder="用户角色"
            clearable
            class="handle-select mr10">
            <el-option v-for="role in roleList"
              :label="role.roleName"
              :key="role.id"
              :value="role.id"></el-option>
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
      <BaseTable :cols="columns"
        ref="userTable"
        :url="'/rui_ao/users'">
        <template v-slot:role="slotProps">
          <span>{{ {'SYS_ADMIN':'系统管理员', 'SYS_EMPLOYEE':'普通员工', 'SYS_CONTACT': '外协联络员', 'SYS_PRODUCT': '生产管理员', 'SYS_STORE': '仓库管理员'}[slotProps.scopeData.roles[0].roleCode] }}</span>
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
import { editUser, getRoleList, delUser } from '@/api/user'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
  },
  name: 'product-manage',
  setup() {
    const query = reactive({
      userName: '',
      roleId: '',
    })
    const tableData = ref([])
    const pageTotal = ref(0)

    // 查询操作
    const userTable = ref()
    const handleSearch = () => {
      userTable.value.refresh(query)
    }

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delUser({ userId: row.id})
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
      editItemData.value.role = row.roles[0].id
    }
    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = null
    }
    const editSubmit = async (row) => {
      await editUser({
        id: editItemData.value?.id,
        ...row,
        password: row.phone,
      })
      ElMessage.success('操作成功')
      editVisible.value = false
      handleSearch()
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      editItemData.value = row
      detailVisible.value = true
    }

    // 用户字段
    const roleList = ref(null)
    const formItems = ref(null)
    getRoleList().then((res) => {
      roleList.value = res.data
      formItems.value = [
        { label: '用户姓名', key: 'realName', required: true },
        {
          label: '用户角色',
          key: 'role',
          required: true,
          type: 'select',
          options: res.data.map((r) => {
            return {
              label: r.roleName,
              value: r.id,
            }
          }),
        },
        {
          label: '手机号(登录账号)',
          key: 'phone',
          required: true,
          placeholder: '',
        },
      ]
    })
    return {
      roleList,
      columns: [
        {
          label: '用户姓名',
          prop: 'realName',
        },
        {
          label: '手机号',
          prop: 'phone',
        },
        {
          label: '用户角色',
          prop: 'role',
          slot: 'role',
        },
      ],
      formItems,
      query,
      tableData,
      pageTotal,
      editVisible,
      handleSearch,
      handleDelete,
      handleEdit,
      showDetail,
      editItemData,
      editSubmit,
      handleAdd,
      detailVisible,
      userTable,
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
