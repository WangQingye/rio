<template>
  <!-- 编辑弹出框 -->
  <el-dialog :append-to-body="true" :title="`任务详情 - ${itemData && itemData.taskId}` "
    v-model="visible"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息"
        name="detail">
        <el-form label-width="170px"
          inline>
          <el-form-item style="width: 48%"
            v-for="item in formItems"
            :key="item.key"
            :label="`${item.label} : `">
            <span style="font-weight: bold">{{form[item.key]}}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="工序进展"
        name="second">
        <BaseTable :cols="stepColumns" :url="'/step'" :needOperation="false"></BaseTable>
      </el-tab-pane>
      <!-- <el-tab-pane label="量具信息"
        name="third">量具信息</el-tab-pane> -->
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
export default {
  components: {BaseTable},
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
    const activeName = ref('detail')
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
          label: '步骤编号',
          prop: 'stepIndex',
        },
        {
          label: '步骤名',
          prop: 'stepName',
        },
        {
          label: '负责人',
          prop: 'userName',
        },
        {
          label: '当前状态',
          prop: 'status',
        },
        {
          label: '完成时间',
          prop: 'finishTime',
        }
      ],
      close,
      activeName,
      saveEdit,
      form
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
