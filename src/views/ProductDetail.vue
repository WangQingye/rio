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
          :isInIndex="true"
          v-if="!isZhiliang && userType !== 'SYS_PRODUCT'"
          @refresh="getProcessDetail"></ProcessPriceTag>
        <BaseTable :cols="stepColumns"
          :tableRealData="processesList"
          :key="serial">
          <template v-slot:status="slotProps">
            <el-tag :type="slotProps.scopeData.status === 'NORMAL'? 'warning': slotProps.scopeData.status === 'RUNNING'? 'primary': 'success'">{{ {'NORMAL':'未开工', 'RUNNING': '已开工', 'CLOSED': '已完工'}[slotProps.scopeData.status] }}</el-tag>
          </template>
          <template v-slot:operation="slotProps">
            <el-button type="text"
              icon="el-icon-edit"
              v-if="!isZhiliang"
              @click="handleStepEdit(slotProps.scopeData)">信息填报
            </el-button>
            <el-button type="text"
              icon="el-icon-edit"
              v-else-if="isZhiliang"
              @click="handleZhiliangEdit(slotProps.scopeData)">合格数填报
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
        <ProductAdd :visible="zhiliangEditVisible"
          @close="zhiliangEditVisible = false"
          :title="'合格数填报'"
          :formItems="zhiliangFormItems"
          key="product-edit"
          :itemData="zhiliangEditItem"
          @dialog-submit="zhiliangEditSubmit"></ProductAdd>
      </el-tab-pane>
      <el-tab-pane label="量具情况"
        v-if="!isZhiliang"
        name="mesuring">
        <el-button style="margin-bottom: 10px"
          type="primary"
          @click="returnAllMesuring">批量归还</el-button>
        <MesuringTable ref="mesureTable"
          :serialNum="serial"></MesuringTable>
      </el-tab-pane>
      <el-tab-pane label="工序设置"
        v-if="!isZhiliang && userType != 'SYS_CONTACT'"
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
import { ref, reactive, computed, watch } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import MesuringTable from './MesuringTable.vue'
import ProcessPriceTag from './ProcessPriceTag.vue'
import ProductAdd from './ProductAdd.vue'
import { useStore } from 'vuex'
import {
  getProcessDetailList,
  editPartStep,
  delPartStep,
  editWorkingStep,
} from '@/api/product'
import { returnSerialMesure } from '@/api/mesure'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { BaseTable, MesuringTable, ProcessPriceTag, ProductAdd },
  props: {
    isZhiliang: {
      type: Boolean,
      default: false,
    },
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
        pageSize: 1000,
      })
      let record = res.data.records.find((r) => r.serial == props.serial)
      pricesData.value = record
      processesList.value = record?.workings
    }
    if (props.serial) getProcessDetail()
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
    const stepEditSubmit = async (formData) => {
      await editWorkingStep({
        id: stepEditItem.value.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      stepEditVisible.value = false
      getProcessDetail()
      emit('refresh')
    }

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
            stepId: row.id,
          })
          ElMessage.success('删除成功')
          stepTable.value.refresh()
          emit('refresh')
          getProcessDetail()
        })
        .catch(() => {})
    }
    const editPartStepSubmit = async (formData) => {
      await editPartStep({
        id: editPartStepItemData.value?.id,
        ...formData,
        products: props.serialId,
      })
      ElMessage.success('操作成功')
      stepTable.value.refresh({}, true)
      emit('refresh')
      partStepEditVisible.value = false
      getProcessDetail()
    }

    // 合格数填报
    const zhiliangEditVisible = ref(false)
    const zhiliangEditItem = ref({})
    const handleZhiliangEdit = (row) => {
      zhiliangEditVisible.value = true
      zhiliangEditItem.value = row
    }
    const zhiliangEditSubmit = async (formData) => {
      await editWorkingStep({
        id: zhiliangEditItem.value.id,
        ...formData,
      })
      ElMessage.success('操作成功')
      zhiliangEditVisible.value = false
      getProcessDetail()
    }
    const store = useStore()
    const userType = store.state.userInfo.authorities[0].authority
    const stepItems = computed(() => {
      return [
        {
          label: '工序',
          key: 'workingName',
          disabled: true,
        },
        {
          label: '操作者',
          key: 'user',
          type: 'user',
          disabled: stepEditItem.value?.status !== 'NORMAL',
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
        // {
        //   label: '开工时间',
        //   key: 'startTime',
        //   disabled: true,
        // },
        {
          label: '要求完工时间',
          key: 'needFinalDate',
          type: 'date',
          required: false,
        },
        // {
        //   label: '实际完工时间',
        //   key: 'finishTime',
        //   disabled: true,
        // },
        {
          label: '操作设备',
          key: 'deviceName',
          noVisible: userType == 'SYS_CONTACT',
          required: false,
        },
        {
          label: '运行时间',
          key: 'runningDate',
          noVisible: userType == 'SYS_CONTACT',
          required: false,
        },
        {
          label: '最高记录',
          key: 'highRecord',
          noVisible: userType == 'SYS_CONTACT',
          required: false,
        },
        {
          label: '工序单价（元）',
          key: 'price',
          noVisible: userType == 'SYS_CONTACT' || userType == 'SYS_QUALITY',
          required: false,
        },
        {
          label: '备注',
          key: 'remark',
          type: 'textarea',
          required: false,
        },
        {
          label: '接受产品数量',
          key: 'acceptAmt',
          placeholder: '分配时无需填写，由员工填写',
          required: false,
        },
        {
          label: '完成产品数量',
          key: 'completeAmt',
          placeholder: '分配时无需填写，由员工填写',
          required: false,
        },
        {
          label: '合格产品数量',
          key: 'qualAmt',
          placeholder: '分配时无需填写，由员工填写',
          required: false,
        },
      ]
    })
    const stepColumns = computed(() => {
      return [
        {
          label: '工序',
          prop: 'workingName',
        },
        {
          label: '操作者',
          prop: 'userName',
        },
        {
          label: '当前状态',
          prop: 'status',
          slot: 'status',
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
          label: '完成产品数量',
          prop: 'completeAmt',
        },
        {
          label: '合格产品数量',
          prop: 'qualAmt',
        },
        {
          label: '运行时间',
          prop: 'runningDate',
          noVisible: userType == 'SYS_CONTACT',
        },
        {
          label: '最高记录',
          prop: 'highRecord',
          noVisible: userType == 'SYS_CONTACT',
        },
        {
          label: '工序单价（元）',
          prop: 'price',
          noVisible: userType == 'SYS_CONTACT',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ]
    })
    // watch(editPartStepItemData, (val) => {
    //   stepItems.value =
    // })
    const mesureTable = ref({})
    const returnAllMesuring = () => {
      ElMessageBox.confirm(
        '该操作将修改本序号所有量具状态为已归还甲方，是否确认？',
        '提示',
        {
          type: 'warning',
        }
      )
        .then(async () => {
          await returnSerialMesure({
            serial: props.serial,
          })
          ElMessage.success('操作成功')
          mesureTable.value.handleSearch()
        })
        .catch(() => {})
    }
    return {
      stepColumns,
      stepItems,
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
        // {
        //   label: '操作设备',
        //   prop: 'deviceName',
        // },
        {
          label: '工序单价（元）',
          prop: 'price',
        },
      ],
      editPartStepFormItems: [
        {
          label: '工序',
          key: 'workingName',
          required: true,
        },
        // {
        //   label: '操作设备',
        //   key: 'deviceName',
        //   required: true,
        // },
        {
          label: '工序单价',
          key: 'price',
          required: false,
          type: 'number',
        },
      ],
      processesList,
      pricesData,
      getProcessDetail,
      zhiliangEditVisible,
      zhiliangEditItem,
      handleZhiliangEdit,
      zhiliangEditSubmit,
      zhiliangFormItems: [
        {
          label: '合格产品数量',
          key: 'qualAmt',
        },
        {
          label: '备注',
          key: 'remark',
          type: 'textarea',
          required: false,
        },
      ],
      userType,
      mesureTable,
      returnAllMesuring,
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
