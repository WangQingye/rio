<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="工具类名称">
          <el-input v-model="query.name"
            placeholder="工具类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px;"
        @click="handleAdd">添加工具种类</el-button>
      <BaseTable :cols="columns"
        ref="toolTypeTable"
        :url="'/tool-manage/tool/list'">
        <template v-slot:stableField="slotProps">
          <span>采购单位 | 名称 | 规格型号 | 库房存放点 | 库房剩余数量 | 总购数量</span>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="text"
            icon="el-icon-edit"
            style="margin-left:0"
            @click="handleEdit(slotProps.scopeData)">编辑
          </el-button>
          <el-button type="text"
            icon="el-icon-delete"
            class="color-danger"
            @click="handleDelete(slotProps.scopeData)">删除</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="editVisible"
      @close="editVisible = false"
      :itemData="editItemData"
      :formItems="formItems"
      @dialog-submit="editSubmit"></ProductAdd>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import { addToolType, delToolType } from '@/api/tool'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
  },
  name: 'tool-add-manage',
  setup() {
    const query = reactive({
      name: '',
    })
    const toolTypeTable = ref({})
    // 查询操作
    const handleSearch = (keepNowPage) => {
      toolTypeTable.value.refresh(query, keepNowPage)
    }

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delToolType({
            toolId: row.id
          })
          ElMessage.success('删除成功')
          window.location.reload()
          handleSearch()
        })
        .catch(() => {})
    }

    // 表格编辑时弹窗和保存
    const editVisible = ref(false)
    let editItemData = ref(null)
    const handleEdit = (row) => {
      editVisible.value = true
      editItemData.value = JSON.parse(JSON.stringify(row))
      editItemData.value.toolProps = editItemData.value.toolProps
        .map((p) => p.label)
        .join('|')
    }

    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = null
    }
    const editSubmit = async (formData) => {
      await addToolType({ id: editItemData.value?.id, ...formData })
      ElMessage.success('添加成功')
      window.location.reload()
      editVisible.value = false
      handleSearch(true)
    }

    return {
      columns: [
        {
          label: '工具名称',
          prop: 'name',
        },
        {
          label: '固定展示字段',
          prop: 'stableField',
          slot: 'stableField',
        },
        {
          label: '特殊展示字段',
          prop: 'specField',
        },
      ],
      formItems: [
        { label: '工具类名称', key: 'name', required: true, width: '100%' },
        {
          label: '特殊展示字段',
          key: 'specField',
          required: false,
          placeholder: '多个字段使用|隔开',
          width: '100%',
        },
      ],
      toolTypeTable,
      query,
      editVisible,
      handleSearch,
      handleDelete,
      handleEdit,
      editItemData,
      editSubmit,
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
