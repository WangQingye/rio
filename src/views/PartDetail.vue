<template>
  <!-- 编辑弹出框 -->
  <el-dialog :append-to-body="true"
    :title="`零件生产详情 - ${partId}` "
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
        <el-card class="part-card"
          v-for="i in 3"
          :key="i"
          style="padding: 0; margin-bottom:10px">
          <ProcessPriceTag :fromIndex="'21-9-1'"></ProcessPriceTag>
          <BaseTable 
            noBorder
            noPager
            :cols="stepColumns"
            :url="'/step'"
            :needOperation="false"></BaseTable>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="工序设置"
        name="mesuring">
        <el-button type="primary"
          icon="el-icon-plus"
          style="margin-bottom:10px"
          @click="handleAddStep">添加工序</el-button>
        <BaseTable :cols="partStepColumns"
          :url="'/partStep'">
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
export default {
  components: { BaseTable, MesuringTable, ProcessPriceTag, ProductAdd },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    partId: {
      type: String,
    },
  },
  emits: ['close', 'dialog-submit'],
  name: 'product-add',
  setup(props, { emit }) {
    const form = reactive({})
    const activeName = ref('process')
    const dialogVisible = computed(() => props.visible)
    watch(dialogVisible, () => {
      if (dialogVisible.value == true) {
        if (props.itemData) {
          Object.keys(props.itemData).map((key) => {
            form[key] = props.itemData[key]
          })
        }
      } else {
        Object.keys(form).map((key) => {
          delete form[key]
        })
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
    const editPartStepSubmit = (row) => {
    }
    return {
      stepColumns: [
        {
          label: '工序',
          prop: 'stepName',
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
          prop: 'equipment',
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
          prop: 'stepPrice',
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
          prop: 'stepName',
        },
        {
          label: '操作设备',
          prop: 'equipment',
        },
        {
          label: '工序单价',
          prop: 'stepPrice',
        },
      ],
      editPartStepFormItems: [
        {
          label: '工序',
          key: 'stepName',
          required: true,
        },
        {
          label: '操作设备',
          key: 'equipment',
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
      editPartStepSubmit
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
