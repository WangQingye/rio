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
        <template v-slot:realName="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showUserDetail(slotProps.scopeData)">{{slotProps.scopeData.realName}}</el-link>
        </template>
        <template v-slot:role="slotProps">
          <span>{{ {'SYS_ADMIN':'系统管理员', 'SYS_EMPLOYEE':'普通员工', 'SYS_CONTACT': '外协联络员', 'SYS_PRODUCT': '生产管理员', 'SYS_STORE': '仓库管理员', 'SYS_FINANCIAL': '财务管理员', 'SYS_QUALITY': '质量管理员'}[slotProps.scopeData.roles[0].roleCode] }}</span>
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

    <!-- 用户详情 -->
    <el-dialog :append-to-body="true"
      :title="`用户详情 - ${userDetailInfo.realName}` "
      v-model="userDetailVisible"
      :destroy-on-close="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-tabs v-model="detailActive">
        <el-tab-pane label="工作列表"
          name="worklist">
          <WorkList :userId="userDetailInfo.id"></WorkList>
        </el-tab-pane>
        <el-tab-pane label="领用清单"
          name="lendlist">
          <LendList :userId="userDetailInfo.id"></LendList>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDetailVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import WorkList from './WorkList.vue'
import LendList from './LendList.vue'
import { editUser, getRoleList, delUser } from '@/api/user'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
    LendList,
    WorkList
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
          await delUser({ userId: row.id })
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
    const userDetailVisible = ref(false)
    const userDetailInfo = ref({})
    const showUserDetail = (row) => {
      userDetailInfo.value = row
      userDetailVisible.value = true
    }
    const detailActive = ref('worklist')
    return {
      roleList,
      columns: [
        {
          label: '用户姓名',
          prop: 'realName',
          slot: 'realName',
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
      userDetailVisible,
      userDetailInfo,
      showUserDetail,
      detailActive
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
