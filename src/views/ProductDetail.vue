<template>
  <!-- 编辑弹出框 -->
  <el-dialog :append-to-body="true"
    :title="`序号详情 - ${itemData && itemData.index}` "
    v-model="visible"
    :destroy-on-close="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%">
    <el-tabs v-model="activeName">
      <el-tab-pane label="生产过程"
        name="process">
        <ProcessPriceTag :fromIndex="itemData.index"
          :isInIndex="true"></ProcessPriceTag>
        <BaseTable :cols="stepColumns"
          :url="'/step'">
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
        <MesuringTable :taskIndex="'111'"></MesuringTable>
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
    itemData: {
      type: Object,
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
    // 工序信息填报
    const stepEditVisible = ref(false)
    const stepEditItem = ref({})
    const handleStepEdit = (row) => {
      stepEditVisible.value = true
      stepEditItem.value = row
    }
    const stepEditSubmit = () => {
    }
    return {
      stepColumns: [
        {
          label: '工序',
          prop: 'stepName',
        },
        {
          label: '操作者',
          prop: 'userName'
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
          prop: 'runTime'
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
      stepItems: [
        {
          label: '工序',
          key: 'stepName',
          disabled: true
        },
        {
          label: '操作者',
          key: 'userName', 
          type: 'user'
        },
        {
          label: '当前状态',
          key: 'status',
          disabled: true
        },
        {
          label: '操作设备',
          key: 'equipment',
          disabled: true
        },
        {
          label: '接受产品数量',
          key: 'receiveNum',
        },
        {
          label: '开工时间',
          key: 'startTime',
          disabled: true
        },
        {
          label: '要求完工时间',
          key: 'planFinishTime'
        },
        {
          label: '实际完工时间',
          key: 'finishTime',
          disabled: true
        },
        {
          label: '合格产品数量',
          key: 'qualifiedNum',
        },
        {
          label: '运行时间',
          key: 'runTime'
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
          type:'textarea'
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
      saveEdit,
      form,
      stepEditVisible,
      stepEditItem,
      handleStepEdit,
      stepEditSubmit
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
