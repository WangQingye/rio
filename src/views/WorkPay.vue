<template>
  <div>
    <div :class="[!userId ? 'container' : '']">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="用户姓名">
          <UserSelect v-model:userData="query.user"
            style="width: 200px">
          </UserSelect>
        </el-form-item>
        <el-form-item label="结账时间">
          <el-date-picker v-model="query.timeRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完工时间">
          <el-date-picker v-model="query.finishTimeRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预支时间">
          <el-date-picker v-model="query.prePaytimeRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结账状态">
          <el-select v-model="query.checkStatus"
            placeholder="结账状态"
            clearable
            class="handle-select mr10">
            <el-option label="未结账"
              value="CHECK"></el-option>
            <el-option label="已结账"
              value="CHECKED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作状态">
          <el-select v-model="query.status"
            placeholder="工作状态"
            clearable
            class="handle-select mr10">
            <el-option label="未开工"
              value="NORMAL"></el-option>
            <el-option label="已开工"
              value="RUNNING"></el-option>
            <el-option label="已完工"
              value="CLOSED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="query.serial"
            placeholder="序号"></el-input>
        </el-form-item>
        <el-form-item label="任务号">
          <el-input v-model="query.code"
            placeholder="任务号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <BaseTable :cols="columns"
        needExport
        ref="worklistTable"
        :url="'/work-shop-manage/work/pages'">
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === 'NORMAL'? 'warning': slotProps.scopeData.status === 'RUNNING'? 'primary': 'success'">{{ {'NORMAL':'未开工', 'RUNNING': '已开工', 'CLOSED': '已完工'}[slotProps.scopeData.status] }}</el-tag>
        </template>
        <template v-slot:checkStatus="slotProps">
          <el-tag :type="slotProps.scopeData.checkStatus === '未结账'? 'warning': 'success'">{{ slotProps.scopeData.checkStatus }}</el-tag>
        </template>
        <template v-slot:operation="slotProps">
          <el-dropdown trigger="click" @command="handleCommand($event, slotProps.scopeData)">
            <el-button type="text" size="small">
              结账状态<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="CHECKED">已结账</el-dropdown-item>
                <el-dropdown-item command="CHECK">未结账</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 预支按钮展示条件：未结账，有完成数量，有单件价格 -->
          <el-button type="text" size="small"
            icon="el-icon-coin"
            v-if="slotProps.scopeData.completeAmt && slotProps.scopeData.checkStatus === '未结账' && slotProps.scopeData.price"
            @click="prePay(slotProps.scopeData)">预支</el-button>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="prePayVisible"
      @close="prePayVisible = false"
      :title="'预支件数填报'"
      :formItems="[{
        label: '此次预支件数',
        key: 'advanceNum',
        required: true
      }]"
      key="product-edit"
      @dialog-submit="prePaySubmit"></ProductAdd>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import { useStore } from 'vuex'
import UserSelect from '@/components/UserSelect.vue'
import { payWork, prePayWork } from '@/api/worklist'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
    UserSelect,
  },
  name: 'work-list',
  props: {
    userId: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const query = reactive({
      partName: '',
      productCode: '',
      partCode: '',
      user: '',
      timeRange: [],
      finishTimeRange: [],
      prePaytimeRange: [],
      checkStatus: '',
      serial: '',
      status: '',
      code: '',
    })
    // 查询操作
    const worklistTable = ref({})
    const handleSearch = (keepNowPage) => {
      const queryObj = {
        ...query,
        timeRange: undefined,
        checkDateStart: (query.timeRange && query.timeRange[0]) || undefined,
        checkDateEnd: (query.timeRange && query.timeRange[1]) || undefined,
        finishTimeRange: undefined,
        finalDateStart: (query.finishTimeRange && query.finishTimeRange[0]) || undefined,
        finalDateEnd: (query.finishTimeRange && query.finishTimeRange[1]) || undefined,
        prePaytimeRange: undefined,
        advanceDateStart: (query.prePaytimeRange && query.prePaytimeRange[0]) || undefined,
        advanceDateEnd: (query.prePaytimeRange && query.prePaytimeRange[1]) || undefined,
      }
      worklistTable.value.refresh(queryObj, keepNowPage)
    }

    const editItemData = ref(null)
    const handleCommand = (command, row) => {
      ElMessageBox.confirm('确定修改结账状态吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await payWork({ workingId: row.id, checkStatus: command })
          ElMessage.success('操作成功')
          handleSearch(true)
        })
        .catch(() => {})
    }
    const prePayVisible = ref(false)
    const prePay = async (row) => {
      editItemData.value = row
      prePayVisible.value = true
    }
    const prePaySubmit = async (formData) => {
      await prePayWork({ workId: editItemData.value.id, ...formData })
      ElMessage.success('操作成功')
      prePayVisible.value = false
      handleSearch(true)
    }
    return {
      columns: [
        {
          label: '序号',
          prop: 'serial',
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
        },
        {
          label: '零件名称',
          prop: 'partName',
        },
        {
          label: '工序',
          prop: 'workingName',
        },
        {
          label: '操作者',
          prop: 'username',
        },
        {
          label: '操作设备',
          prop: 'deviceName',
        },
        {
          label: '状态',
          prop: 'status',
          slot: 'status',
        },
        {
          label: '要求完工时间',
          prop: 'needFinalDate',
        },
        {
          label: '开工时间',
          prop: 'startDate',
        },
        {
          label: '完工时间',
          prop: 'finalDate',
        },
        {
          label: '接受产品数量',
          prop: 'acceptAmt',
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
          label: '工序单价（元）',
          prop: 'price',
        },
        {
          label: '预计工资',
          prop: 'checkWages',
        },
        {
          label: '已预支件数',
          prop: 'advanceAmt',
        },
        {
          label: '已预支工资',
          prop: 'advanceWages',
        },
        {
          label: '预支时间',
          prop: 'advanceDate',
        },
        {
          label: '结账状态',
          prop: 'checkStatus',
          slot: 'checkStatus',
        },
        {
          label: '结账时间',
          prop: 'checkDate',
        },
      ],
      query,
      handleSearch,
      prePay,
      prePayVisible,
      prePaySubmit,
      worklistTable,
      handleCommand
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
