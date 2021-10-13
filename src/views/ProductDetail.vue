<template>
  <!-- 编辑弹出框 -->
  <el-dialog :append-to-body="true"
    :title="`序号详情 - ${itemData && itemData.index}` "
    v-model="visible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%">
    <el-tabs v-model="activeName">
      <el-tab-pane label="生产过程"
        name="process">
        <ProcessPriceTag :fromIndex="itemData.index"
          :isInIndex="true"></ProcessPriceTag>
        <BaseTable :cols="stepColumns"
          :url="'/step'"
          :needOperation="false">
          <template v-slot:userName="slotProps">
            <span v-if="slotProps.scopeData.userName">{{slotProps.scopeData.userName}}</span>
            <el-button v-else
              type="text"
              icon="el-icon-collection-tag" @click="showDispathTask">分配任务</el-button>
          </template>
          <template v-slot:runTime="slotProps">
            <span v-if="slotProps.scopeData.runTime">{{slotProps.scopeData.runTime}}</span>
            <el-button v-if="(!slotProps.scopeData.runTime && slotProps.scopeData.finishTime)"
              type="text"
              icon="el-icon-time" @click="showEditRunTime">填报工时</el-button>
          </template>
        </BaseTable>
        <ProductAdd :visible="dispathTaskVisible"
          @close="dispathTaskVisible = false"
          :title="'分配任务'"
          :formItems="[{
            label:'操作者', key: 'userName', required: true
          }]"
          key="product-edit"
          @dialog-submit="dispathTaskSubmit"></ProductAdd>
        <ProductAdd :visible="editRunTimeVisible"
          @close="editRunTimeVisible = false"
          :title="'填报工时'"
          :formItems="[{
            label:'运行时间', key: 'runTime', required: true
          }]"
          key="product-edit"
          @dialog-submit="editRunTimeSubmit"></ProductAdd>
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
    
    // 分配任务、填报工时
    const dispathTaskVisible = ref(false)
    const showDispathTask = () => {
      dispathTaskVisible.value = true
    }
    const dispathTaskSubmit = () => {
    }
    const editRunTimeVisible = ref(false)
    const showEditRunTime = () => {
      editRunTimeVisible.value = true
    }
    const editRunTimeSubmit = () => {
    }
    return {
      formItems: [
        { label: '序号', key: 'index', required: true },
        { label: '任务号', key: 'taskId', required: true },
        { label: '产品代号', key: 'productId', required: true },
        { label: '零件代号', key: 'partId', required: true },
        { label: '名称', key: 'name', required: true },
        { label: '图纸工序', key: 'blueprintProcess', required: true },
        { label: '本厂实际工序', key: 'factoryProcess', required: true },
        { label: '回厂数量', key: 'backFactoryNum', required: true },
        {
          label: '回厂日期',
          key: 'backFactoryTime',
          required: true,
          type: 'date',
        },
        { label: '调度备注', key: 'dispatchRemark', required: true },
        {
          label: '甲方要求回厂时间',
          key: 'customerBackFactoryTime',
          required: true,
          type: 'date',
        },
        { label: '状态', key: 'status', required: true },
        { label: '备注', key: 'remark', required: true },
        { label: '出厂数量', key: 'outFactoryNum', required: true },
        {
          label: '出厂时间',
          key: 'outFactoryTime',
          required: true,
          type: 'date',
        },
        {
          label: '最终甲方检验合格数',
          key: 'finalCustomerQualifiedNum',
          required: true,
        },
      ],
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
          label: '开工时间',
          prop: 'startTime',
        },
        {
          label: '完工时间',
          prop: 'finishTime',
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
      dispathTaskVisible,
      dispathTaskSubmit,
      editRunTimeVisible,
      editRunTimeSubmit,
      showDispathTask,
      showEditRunTime
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
