<template>
  <div>
    <div class="container">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="序号">
          <el-input v-model="query.serial"
            placeholder="序号"></el-input>
        </el-form-item>
        <el-form-item label="任务号">
          <el-input v-model="query.code"
            placeholder="任务号"></el-input>
        </el-form-item>
        <el-form-item label="产品代号">
          <el-input v-model="query.productCode"
            placeholder="产品代号"></el-input>
        </el-form-item>
        <el-form-item label="零件代号">
          <el-input v-model="query.partCode"
            placeholder="零件代号"></el-input>
        </el-form-item>
        <el-form-item label="零件名称">
          <el-input v-model="query.partName"
            placeholder="零件名称"></el-input>
        </el-form-item>
        <el-form-item label="调度备注">
          <el-input v-model="query.remark"
            placeholder="调度备注"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status"
            placeholder="状态"
            clearable
            class="handle-select mr10">
            <el-option label="未开工"
              value="NOT_STARTED"></el-option>
            <el-option label="生产中"
              value="PROCESSING"></el-option>
            <el-option label="已完工"
              value="COMPLETED"></el-option>
            <el-option label="已完结"
              value="CLOSED"></el-option>
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
        @click="handleAdd">添加批次</el-button>
      <BaseTable :cols="columns"
        ref="productTable"
        :url="'/products-manage/product/list'">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === 'COMPLETED'? 'success': slotProps.scopeData.status === 'NOT_STARTED'? 'danger': ''">{{ {'NOT_STARTED':'未开工', 'PROCESSING': '生产中', 'COMPLETED': '已完工', 'CLOSED': '已完结'}[slotProps.scopeData.status] }}</el-tag>
        </template>
        <template v-slot:factoryProcess="slotProps">
          <el-link href="javascript:void(0)"
            style="display: block"
            v-for="work in slotProps.scopeData.workings"
            :key="work.id"
            :type="{'NORMAL': 'danger', 'RUNNING':'success', 'CLOSED': 'primary'}[work.status]">{{`${work.workingName}-${{'NORMAL': '未开工', 'RUNNING':'进行中', 'CLOSED': '已完工'}[work.status]}`}}</el-link>
        </template>
        <template v-slot:serial="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showDetail(slotProps.scopeData)">{{slotProps.scopeData.serial}}</el-link>
        </template>
        <template v-slot:partCode="slotProps">
          <el-link href="javascript:void(0)"
            type="primary"
            @click="showPartDetail(slotProps.scopeData)">{{slotProps.scopeData.partCode}}</el-link>
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
      key="product-edit"
      @dialog-submit="editSubmit"></ProductAdd>
    <ProductDetail :visible="detailVisible"
      @close="detailVisible = false"
      key="detail"
      v-if="editItemData?.id"
      :serialId="editItemData?.id"
      :serial="editItemData?.serial"></ProductDetail>
    <PartDetail :visible="partDetailVisible"
      @close="partDetailVisible = false"
      key="detail1"
      v-if="editItemData"
      :serialId="editItemData?.id"
      :partCode="editItemData?.partCode"></PartDetail>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../api/index'
import BaseTable from '@/components/BaseTable.vue'
// import MyButton from '@/components/MyButton.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import PartDetail from './PartDetail.vue'
import { editProduct, delProduct } from '@/api/product'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
    PartDetail,
    // MyButton,
  },
  name: 'product-manage',
  setup() {
    const query = reactive({
      serial: '',
      code: '',
      productCode: '',
      partCode: '',
      partName: '',
      remark: '',
      status: '',
    })

    // 查询操作
    const productTable = ref()
    const handleSearch = () => {
      productTable.value.refresh(query)
    }

    // 删除操作
    const handleDelete = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delProduct({ id: row.id })
          ElMessage.success('删除成功')
          handleSearch()
        })
        .catch(() => {})
    }

    const editVisible = ref(false)
    const editItemData = ref({})
    const handleAdd = () => {
      editVisible.value = true
      editItemData.value = null
    }
    // 表格编辑时弹窗和保存
    const handleEdit = (row) => {
      editVisible.value = true
      editItemData.value = row
    }
    const editSubmit = async (formData) => {
      console.log(formData)
      await editProduct({ id: editItemData.value?.id, ...formData })
      ElMessage.success('添加成功')
      editVisible.value = false
      handleSearch()
    }

    const detailVisible = ref(false)
    const showDetail = (row) => {
      detailVisible.value = true
      editItemData.value = row
    }

    // 零件生产详情
    const partDetailVisible = ref(false)
    const showPartDetail = (row) => {
      partDetailVisible.value = true
      editItemData.value = row
    }
    return {
      columns: [
        {
          label: '序号',
          prop: 'serial',
          slot: 'serial',
        },
        {
          label: '任务号',
          prop: 'code',
        },
        {
          label: '产品代号',
          prop: 'productCode',
        },
        {
          label: '零件代号',
          prop: 'partCode',
          slot: 'partCode',
        },
        {
          label: '零件名称',
          prop: 'partName',
        },
        {
          label: '图纸工序',
          prop: 'processes',
        },
        {
          label: '本厂实际工序',
          prop: 'factoryProcess',
          width: '130',
          slot: 'factoryProcess',
        },
        {
          label: '回厂数量',
          prop: 'returnQuantity',
        },
        {
          label: '回厂日期',
          prop: 'returnDate',
        },
        {
          label: '调度备注',
          prop: 'remark',
        },
        {
          label: '甲方要求回厂时间',
          prop: 'requiredReturnDate',
        },
        {
          label: '状态',
          prop: 'status',
          slot: 'status',
        },
        {
          label: '上账备注',
          prop: 'remark1',
        },
        {
          label: '出厂数量',
          prop: 'exQuantity',
        },
        {
          label: '出厂时间',
          prop: 'deliveryTime',
        },
        {
          label: '最终甲方检验合格数',
          prop: 'requiredQualified',
        },
      ],
      formItems: [
        { label: '序号', key: 'serial', required: true, editDisabled: true },
        { label: '任务号', key: 'code', required: true, editDisabled: true },
        {
          label: '产品代号',
          key: 'productCode',
          required: true,
          editDisabled: true,
        },
        {
          label: '零件代号',
          key: 'partCode',
          required: true,
          editDisabled: true,
        },
        {
          label: '零件名称',
          key: 'partName',
          required: true,
          editDisabled: true,
        },
        { label: '图纸工序', key: 'processes', required: false },
        { label: '回厂数量', key: 'returnQuantity', required: false },
        {
          label: '回厂日期',
          key: 'returnDate',
          required: false,
          type: 'date',
        },
        { label: '调度备注', key: 'remark', required: false },
        {
          label: '甲方要求回厂时间',
          key: 'requiredReturnDate',
          required: false,
          type: 'date',
        },
        {
          label: '状态',
          key: 'status',
          required: true,
          type: 'select',
          options: [
            {
              label: '未开工',
              value: 'NOT_STARTED',
            },
            {
              label: '生产中',
              value: 'PROCESSING',
            },
            {
              label: '已完工',
              value: 'COMPLETED',
            },
            {
              label: '已完结',
              value: 'CLOSED',
            },
          ],
        },
        { label: '上账备注', key: 'remark1', required: false },
        { label: '出厂数量', key: 'exQuantity', required: false },
        {
          label: '出厂时间',
          key: 'deliveryTime',
          required: false,
          type: 'date',
        },
        {
          label: '最终甲方检验合格数',
          key: 'requiredQualified',
          required: false,
        },
      ],
      query,
      editVisible,
      handleSearch,
      handleDelete,
      handleEdit,
      showDetail,
      editItemData,
      editSubmit,
      handleAdd,
      detailVisible,
      partDetailVisible,
      showPartDetail,
      productTable,
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
