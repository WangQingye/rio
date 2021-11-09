<template>
  <!-- 编辑弹出框 -->
  <el-dialog :append-to-body="true"
    :title="`序号详情 - ${serial}` "
    v-model="visible"
    :destroy-on-close="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%">
    <el-tabs v-model="activeName">
      <el-tab-pane label="生产过程"
        name="process">
        <ProcessPriceTag :pricesData="pricesData"
          :isInIndex="true" @refresh="getProcessDetail"></ProcessPriceTag>
        <BaseTable :cols="stepColumns" :tableRealData="processesList" :key="serial">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === 'NORMAL'? 'warning': slotProps.scopeData.status === 'RUNNING'? 'primary': 'success'">{{ {'NORMAL':'未开工', 'RUNNING': '已开工', 'CLOSED': '已完工'}[slotProps.scopeData.status] }}</el-tag>
        </template>
          <template v-slot:operation="slotProps">
            <el-button type="text"
              icon="el-icon-edit"
              @click="handleStepEdit(slotProps.scopeData)">信息填报
            </el-button>
          </template>
        </BaseTable>
        <ProductAdd :visible="stepEditVisible"
          @close="stepEditVisible = false"
          :title="'工序信息填报'"
          :formItems="stepItems"
          key="product-edit"
          :itemData="stepEditItem"
          @dialog-submit="stepEditSubmit"></ProductAdd>
      </el-tab-pane>
      <el-tab-pane label="量具情况"
        name="mesuring">
        <MesuringTable :serialNum="serial"></MesuringTable>
      </el-tab-pane>
      <el-tab-pane label="工序设置"
        name="step">
        <el-button type="primary"
          icon="el-icon-plus"
          style="margin-bottom:10px"
          @click="handleAddStep">添加工序</el-button>
        <BaseTable :cols="partStepColumns"
          :url="'/products-manage/query/workings'"
          :queryBase="{'product':serialId}"
          ref="stepTable">
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import MesuringTable from './MesuringTable.vue'
import ProcessPriceTag from './ProcessPriceTag.vue'
import ProductAdd from './ProductAdd.vue'
import { getProcessDetailList, editPartStep, delPartStep } from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { BaseTable, MesuringTable, ProcessPriceTag, ProductAdd },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    serial: {
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
    const pricesData = ref({})
    const getProcessDetail = async () => {
      let res = await getProcessDetailList({
        serial: props.serial,
        pageNo: 1,
        pageSize: 10,
      })
      console.log(res.data.records[0]?.workings)
      pricesData.value = res.data.records[0]
      processesList.value = res.data.records[0]?.workings
    }
    getProcessDetail()
    const activeName = ref('process')
    const dialogVisible = computed(() => props.visible)
    watch(dialogVisible, () => {
      if (dialogVisible.value == true) {
        if (props.serial) {
          getProcessDetail()
        }
      }
    })
    const close = () => {
      emit('close')
    }
    // 工序信息填报
    const stepEditVisible = ref(false)
    const stepEditItem = ref({})
    const handleStepEdit = (row) => {
      stepEditVisible.value = true
      stepEditItem.value = row
    }
    const stepEditSubmit = () => {}

    // 工序设置

    const partStepEditVisible = ref(false)
    const editPartStepItemData = ref(null)
    const handleAddStep = () => {
      partStepEditVisible.value = true
      editPartStepItemData.value = null
    }
    // 表格编辑时弹窗和保存
    const stepTable = ref({})
    const handleEditStep = (row) => {
      partStepEditVisible.value = true
      editPartStepItemData.value = row
    }
    const handleDeleteStep = (row) => {
      // 二次确认删除
      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delPartStep({
            stepId: row.id
          })
          ElMessage.success('删除成功')
          stepTable.value.refresh()
        })
        .catch(() => {})
    }
    const editPartStepSubmit = async (formData) => {
      console.log(formData)
      await editPartStep({
        id: editPartStepItemData.value?.id,
        ...formData,
        products: props.serialId,
      })
      ElMessage.success('操作成功')
      stepTable.value.refresh()
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
          prop: 'user',
        },
        {
          label: '当前状态',
          prop: 'status',
          slot: 'status'
        },
        {
          label: '操作设备',
          prop: 'deviceName',
        },
        {
          label: '接受产品数量',
          prop: 'acceptAmt',
        },
        {
          label: '开工时间',
          prop: 'startDate',
        },
        {
          label: '要求完工时间',
          prop: 'needFinalDate',
        },
        {
          label: '实际完工时间',
          prop: 'finalDate',
        },
        {
          label: '合格产品数量',
          prop: 'qualAmt',
        },
        {
          label: '运行时间',
          prop: 'runningDate',
        },
        {
          label: '最高记录',
          prop: 'highRecord',
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
      stepItems: [
        {
          label: '工序',
          key: 'workingName',
          disabled: true,
        },
        {
          label: '操作者',
          key: 'userName',
          type: 'user',
        },
        // {
        //   label: '当前状态',
        //   key: 'status',
        //   disabled: true,
        // },
        // {
        //   label: '操作设备',
        //   key: 'equipment',
        //   disabled: true,
        // },
        {
          label: '接受产品数量',
          key: 'receiveNum',
        },
        // {
        //   label: '开工时间',
        //   key: 'startTime',
        //   disabled: true,
        // },
        {
          label: '要求完工时间',
          key: 'planFinishTime',
        },
        // {
        //   label: '实际完工时间',
        //   key: 'finishTime',
        //   disabled: true,
        // },
        {
          label: '合格产品数量',
          key: 'qualifiedNum',
        },
        {
          label: '运行时间',
          key: 'runTime',
        },
        {
          label: '最高记录',
          key: 'highScore',
        },
        {
          label: '工序单价（元）',
          key: 'stepPrice',
        },
        {
          label: '备注',
          key: 'remark',
          type: 'textarea',
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
      close,
      activeName,
      stepEditVisible,
      stepEditItem,
      handleStepEdit,
      stepEditSubmit,
      partStepEditVisible,
      editPartStepItemData,
      stepTable,
      handleAddStep,
      handleEditStep,
      handleDeleteStep,
      editPartStepSubmit,
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
      processesList,
      pricesData,
      getProcessDetail
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
