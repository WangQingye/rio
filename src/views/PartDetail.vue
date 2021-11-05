<template>
  <!-- 编辑弹出框 -->
  <el-dialog :append-to-body="true"
    :title="`零件生产详情 - ${partCode}` "
    v-model="visible"
    :show-close="false"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%">
    <el-tabs v-model="activeName">
      <el-tab-pane label="生产情况"
        name="process"
        class="part-info">
        <el-form :inline="true"
          :model="processQuery"
          class="demo-form-inline">
          <el-form-item label="序号">
            <el-input v-model="processQuery.serial"
              placeholder="序号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="handleProcessSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-card class="part-card"
          v-for="p in processesList"
          :key="p.id"
          style="padding: 0; margin-bottom:10px">
          <ProcessPriceTag :fromIndex="p.serial"></ProcessPriceTag>
          <BaseTable noBorder
            noPager
            :cols="stepColumns"
            :needOperation="false"></BaseTable>
        </el-card>
        <div class="pagination">
          <el-pagination background
            layout="total, prev, pager, next"
            :current-page="processQuery.pageNo"
            :page-size="processQuery.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="工序设置"
        name="mesuring">
        <el-button type="primary"
          icon="el-icon-plus"
          style="margin-bottom:10px"
          @click="handleAddStep">添加工序</el-button>
        <BaseTable :cols="partStepColumns" :url="'/products-manage/query/workings'"
          :queryBase="{'partCode':partCode}"
        >
          <template v-slot:operation="slotProps">
            <el-button type="text"
              icon="el-icon-edit"
              @click="handleEditStep(slotProps.scopeData)">编辑
            </el-button>
            <el-button type="text"
              icon="el-icon-delete"
              class="color-warning"
              @click="handleDeleteStep(slotProps.scopeData)">删除</el-button>
          </template>
        </BaseTable>
        <ProductAdd :visible="partStepEditVisible"
          @close="partStepEditVisible = false"
          :title="'工序设置'"
          :itemData="editPartStepItemData"
          :formItems="editPartStepFormItems"
          key="product-edit"
          @dialog-submit="editPartStepSubmit"></ProductAdd>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import MesuringTable from './MesuringTable.vue'
import ProcessPriceTag from './ProcessPriceTag.vue'
import ProductAdd from './ProductAdd.vue'
import { ElMessage } from 'element-plus'
import { getProcessDetailList, editPartStep } from '@/api/product'
export default {
  components: { BaseTable, MesuringTable, ProcessPriceTag, ProductAdd },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    partCode: {
      type: String,
    },
    serialId: {
      type: String,
    },
  },
  emits: ['close', 'dialog-submit'],
  name: 'product-add',
  setup(props, { emit }) {
    const processesList = ref([])
    const pageTotal = ref(0)
    const getProcessDetail = async () => {
      let res = await getProcessDetailList({
        partCode: props.partCode,
        ...processQuery,
      })
      processesList.value = res.data.records
      pageTotal.value = res.data.total
    }
    // 搜索
    const processQuery = reactive({
      serial: '',
      pageNo: 1,
      pageSize: 10,
    })
    const handleProcessSearch = () => {
      processQuery.pageNo = 1
      getProcessDetail()
    }
    const handlePageChange = (page) => {
      processQuery.pageNo = page
      getProcessDetail()
    }
    // 编辑
    const form = reactive({})
    const activeName = ref('process')
    const dialogVisible = computed(() => props.visible)
    watch(dialogVisible, () => {
      if (dialogVisible.value == true) {
        getProcessDetail()
      }
    })
    const close = () => {
      emit('close')
    }
    const saveEdit = () => {
      emit('dialog-submit', form)
    }

    const partStepEditVisible = ref(false)
    const editPartStepItemData = ref(null)
    const handleAddStep = () => {
      partStepEditVisible.value = true
      editPartStepItemData.value = null
    }
    // 表格编辑时弹窗和保存
    const handleEditStep = (row) => {
      partStepEditVisible.value = true
      editPartStepItemData.value = row
    }
    const handleDeleteStep = (row) => {}
    const editPartStepSubmit = async (formData) => {
      console.log(formData)
      await editPartStep({ id: editPartStepItemData.value?.id, ...formData, partCode: props.partCode})
      ElMessage.success('操作成功')
      partStepEditVisible.value = false
    }
    return {
      stepColumns: [
        {
          label: '工序',
          prop: 'workingName',
        },
        {
          label: '操作者',
          prop: 'userName',
          slot: 'userName',
        },
        {
          label: '当前状态',
          prop: 'status',
        },
        {
          label: '操作设备',
          prop: 'deviceName',
        },
        {
          label: '接受产品数量',
          prop: 'receiveNum',
        },
        {
          label: '开工时间',
          prop: 'startTime',
        },
        {
          label: '要求完工时间',
          prop: 'planFinishTime',
        },
        {
          label: '实际完工时间',
          prop: 'finishTime',
        },
        {
          label: '合格产品数量',
          prop: 'qualifiedNum',
        },
        {
          label: '运行时间',
          prop: 'runTime',
          slot: 'runTime',
        },
        {
          label: '最高记录',
          prop: 'highScore',
        },
        {
          label: '工序单价（元）',
          prop: 'price',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ],
      meusringColumns: [
        {
          label: '量具名称',
          prop: 'mesuringName',
        },
        {
          label: '量具规格',
          prop: 'mesuringSpecs',
        },
        {
          label: '量具编号',
          prop: 'mesuringId',
        },
        {
          label: '归属序号',
          prop: 'fromIndex',
        },
        {
          label: '数量',
          prop: 'num',
        },
        {
          label: '状态',
          prop: 'status',
        },
        {
          label: '入库时间',
          prop: 'inTime',
        },
        {
          label: '归还时间',
          prop: 'returnTime',
        },
      ],
      partStepColumns: [
        {
          label: '工序',
          prop: 'workingName',
        },
        {
          label: '操作设备',
          prop: 'deviceName',
        },
        {
          label: '工序单价',
          prop: 'price',
        },
      ],
      editPartStepFormItems: [
        {
          label: '工序',
          key: 'workingName',
          required: true,
        },
        {
          label: '操作设备',
          key: 'deviceName',
          required: true,
        },
        {
          label: '工序单价',
          key: 'price',
          required: true,
        },
      ],
      close,
      activeName,
      saveEdit,
      form,
      partStepEditVisible,
      handleAddStep,
      handleEditStep,
      handleDeleteStep,
      editPartStepItemData,
      editPartStepSubmit,
      processQuery,
      handleProcessSearch,
      pageTotal,
      handlePageChange,
      processesList
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
.part-info {
  height: 50vh;
  overflow-y: scroll;
}
</style>
<style>
.part-card .el-card__body {
  padding: 0;
  padding-top: 10px;
}
</style>
