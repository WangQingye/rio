<template>
  <div>
    <div :class="[!userId ? 'container' : '']">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="序号">
          <el-input v-model="query.serial" placeholder="序号"></el-input>
        </el-form-item>
        <el-form-item label="产品代号" v-if="showSecretInfo">
          <el-input v-model="query.productCode" placeholder="产品代号"></el-input>
        </el-form-item>
        <el-form-item label="零件代号" v-if="showSecretInfo">
          <el-input v-model="query.partCode" placeholder="零件代号"></el-input>
        </el-form-item>
        <el-form-item label="零件名称">
          <el-input v-model="query.partName" placeholder="零件名称"></el-input>
        </el-form-item>
        <el-form-item label="结账状态">
          <el-select v-model="query.checkStatus" placeholder="结账状态" clearable class="handle-select mr10">
            <el-option label="未结账" value="CHECK"></el-option>
            <el-option label="已结账" value="CHECKED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <BaseTable :cols="columns" ref="worklistTable" needOperation :queryBase="searchUserId ? {'user': searchUserId } : {}" :url="'/work-shop-manage/work/pages'">
        <template v-slot:serial="slotProps">
          <el-link href="javascript:void(0)" v-if="clickSerial" type="primary" @click="showSerialDetail(slotProps.scopeData)">{{slotProps.scopeData.serial}}</el-link>
          <span v-else>{{slotProps.scopeData.serial}}</span>
        </template>
        <template v-slot:status="slotProps">
          <el-tag :type="slotProps.scopeData.status === 'NORMAL'? 'warning': slotProps.scopeData.status === 'RUNNING'? 'primary': 'success'">{{ {'NORMAL':'未开工', 'RUNNING': '已开工', 'CLOSED': '已完工'}[slotProps.scopeData.status] }}</el-tag>
        </template>
        <template v-slot:operation="slotProps">
          <el-button type="primary" icon="el-icon-video-play" style="margin-left:0" v-if="slotProps.scopeData.status == 'NORMAL'" @click="handleWorkStatus(slotProps.scopeData, 'start')">开工
          </el-button>
          <div v-if="slotProps.scopeData.status == 'RUNNING'">
            <div v-if="finishWorkVisible && slotProps.scopeData.id == editItemData.id">
              <el-input placeholder="填写完工数量" style="margin-bottom: 10px" v-model='completeAmt'>
              </el-input>
              <el-button-group>
                <el-button style="margin-right: 5px" size="small" @click="finishWorkVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="finishWorkSubmit">确定</el-button>
              </el-button-group>
            </div>
            <el-button v-else type="success" icon="el-icon-finished" @click="handleWorkStatus(slotProps.scopeData, 'finish')">完成</el-button>
          </div>
        </template>
      </BaseTable>
    </div>
    <ProductAdd :visible="startWorkVisible" @close="startWorkVisible = false" :title="'开工填报'" :formItems="[{
        label: '接受产品数量',
        key: 'acceptAmt',
        required: false
      }]" key="product-edit" @dialog-submit="startWorkSubmit"></ProductAdd>
    <!-- <ProductAdd :visible="finishWorkVisible"
      @close="finishWorkVisible = false"
      :title="'完工填报'"
      :formItems="[{
        label: '完成产品数量',
        key: 'completeAmt',
        required: true
      }]"
      key="product-edit"
      @dialog-submit="finishWorkSubmit"></ProductAdd> -->
    <ProductDetail :visible="serialDetailVisible" @close="serialDetailVisible = false" key="detail" :isZhiliang="true" v-if="editItemData?.serial" :serialId="editItemData?.id" :serial="editItemData?.serial"></ProductDetail>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import { useStore } from 'vuex'
import { finishWork, startWork } from '@/api/worklist'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
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
      serial: '',
      partName: '',
      productCode: '',
      partCode: '',
      checkStatus: '',
    })
    // 查询操作
    const worklistTable = ref({})
    const handleSearch = (keepNowPage) => {
      worklistTable.value.refresh(query, keepNowPage)
    }

    // 开工完工操作
    const editItemData = ref(null)
    const startWorkVisible = ref(false)
    const finishWorkVisible = ref(false)
    const handleWorkStatus = (row, status) => {
      editItemData.value = row
      if (status === 'start') {
        startWorkVisible.value = true
      } else if (status === 'finish') {
        finishWorkVisible.value = true
        // ElMessageBox.confirm('确定完工吗？', '提示', {
        //   type: 'warning',
        // })
        //   .then(async () => {
        //     await finishWork({ workId: editItemData.value.id })
        //     ElMessage.success('操作成功')
        //     handleSearch()
        //   })
        //   .catch(() => {})
      }
    }
    const startWorkSubmit = async (formData) => {
      await startWork({ workId: editItemData.value.id, ...formData })
      ElMessage.success('操作成功')
      startWorkVisible.value = false
      handleSearch(true)
    }
    const completeAmt = ref(null)
    const finishWorkSubmit = async () => {
      if (!completeAmt.value) {
        ElMessage.error('请填写完工数量')
        return
      }
      await finishWork({
        workId: editItemData.value.id,
        completeAmt: completeAmt.value,
      })
      ElMessage.success('操作成功')
      finishWorkVisible.value = false
      handleSearch(true)
    }
    // 老版
    // const finishWorkSubmit = async (formData) => {
    //   await finishWork({ workId: editItemData.value.id, ...formData })
    //   ElMessage.success('操作成功')
    //   finishWorkVisible.value = false
    //   handleSearch(true)
    // }

    const store = useStore()
    const searchUserId = computed(() => {
      return props.userId || store.state.userInfo?.user.id || ''
    })
    // 质量管理员和超级管理员才能点序号去填报
    const clickSerial = computed(() => {
      let userType = store.state.userInfo.authorities[0].authority
      return userType === 'SYS_QUALITY' || userType === 'SYS_ADMIN'
    })
    // 管理员跟外协能查看零件代号、产品代号等
    const showSecretInfo = computed(() => {
      let userType = store.state.userInfo.authorities[0].authority
      return userType === 'SYS_CONTACT' || userType === 'SYS_ADMIN'
    })
    const serialDetailVisible = ref(false)
    const showSerialDetail = (row) => {
      console.log(row)
      editItemData.value = row
      serialDetailVisible.value = true
    }
    const columns = ref([
      {
        label: '序号',
        prop: 'serial',
        slot: 'serial',
      },
      {
        label: '任务号',
        prop: 'code',
        noVisible: !showSecretInfo.value
      },
      {
        label: '产品代号',
        prop: 'productCode',
        noVisible: !showSecretInfo.value
      },
      {
        label: '零件代号',
        prop: 'partCode',
        noVisible: !showSecretInfo.value
      },
      {
        label: '零件名称',
        prop: 'partName'
      },
      {
        label: '工序',
        prop: 'workingName',
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
        label: '剩余预计工资',
        prop: 'surplusWages',
      },
      {
        label: '结账状态',
        prop: 'checkStatus',
      },
      {
        label: '结账时间',
        prop: 'checkDate',
      },
    ])
    // onMounted(() => {
    //   if (clickSerial.value) {
    //     columns.value.unshift({
    //       label: '序号',
    //       prop: 'serial',
    //       slot: 'serial',
    //     })
    //   }
    // })
    return {
      columns,
      query,
      handleSearch,
      handleWorkStatus,
      editItemData,
      worklistTable,
      startWorkVisible,
      startWorkSubmit,
      finishWorkVisible,
      completeAmt,
      finishWorkSubmit,
      searchUserId,
      clickSerial,
      showSerialDetail,
      serialDetailVisible,
      showSecretInfo
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
