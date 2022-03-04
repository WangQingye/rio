<template>
  <div>
    <div :class="[!userId ? 'container' : '']">
      <el-form :inline="true"
        :model="query"
        class="demo-form-inline">
        <el-form-item label="物品名称">
          <el-input v-model="query.name"
            placeholder="物品名称"></el-input>
        </el-form-item>
        <el-form-item label="物品类型">
          <el-select v-model="query.type"
            placeholder="物品类型"
            clearable>
            <el-option v-for="t in toolOptions"
              :key="t.id"
              :label="t.name"
              :value="t.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归还状态">
          <el-select v-model="query.status"
            placeholder="归还状态"
            clearable>
            <el-option label="未归还"
              value="USE"></el-option>
            <el-option label="已归还"
              value="RETURN"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领用时间">
          <el-date-picker v-model="query.lendTime"
            type="daterange"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="isAdmin && !userId"
          label="领用人">
          <UserSelect v-model:userData="query.user"
            style="width: 200px">
          </UserSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item v-if="isAdmin && canCalcPrice">
          <el-button type="primary"
            @click="calcAllPrice">计算领用总价值</el-button>
        </el-form-item>
      </el-form>
      <el-alert :title="`当前领用清单总价值：${calPriceNum}`"
        type="success"
        v-if="calPriceNum !== null"
        style="margin-bottom:20px" />
      <BaseTable :cols="columns"
        ref="lendTable"
        :queryBase="searchUserId ? {'user': searchUserId } : {}"
        :needOperation="false"
        :url="'/claim-list-manage/claim/pages'">
      </BaseTable>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseTable from '../components/BaseTable.vue'
import UserSelect from '@/components/UserSelect.vue'
import ProductAdd from './ProductAdd.vue'
import ProductDetail from './ProductDetail.vue'
import { useStore } from 'vuex'
import { getAllToolType } from '@/api/tool'
import { calcPrice } from '@/api/cutter'

export default {
  components: {
    BaseTable,
    ProductAdd,
    ProductDetail,
    UserSelect,
  },
  name: 'lend-list',
  props: {
    userId: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const toolOptions = ref([])
    onBeforeMount(async () => {
      let res = await getAllToolType()
      toolOptions.value = res.data
    })
    const query = reactive({
      name: '',
      type: '',
      status: '',
      lendTime: [],
      user: '',
    })
    // 管理员直接查看所有人的
    const store = useStore()
    const userType = store.state.userInfo.authorities[0].authority
    const isAdmin = computed(() => {
      if (userType === 'SYS_ADMIN' || userType === 'SYS_STORE') {
        return true
      } else {
        return false
      }
    })
    const lendTable = ref({})
    const handleSearch = () => {
      const queryObj = {
        ...query,
        lendTime: undefined,
        startDate: (query.lendTime && query.lendTime[0]) || undefined,
        endDate: (query.lendTime && query.lendTime[1]) || undefined,
      }
      lendTable.value.refresh(queryObj)
      testShowCalcPrice()
      calPriceNum.value = null
    }
    const searchUserId = computed(() => {
      if (isAdmin.value && !props.userId) return ''
      return props.userId || store.state.userInfo?.user.id || ''
    })
    // 是否可以计算价值，刀具和工具类可以计算
    const canCalcPrice = ref(false)
    const testShowCalcPrice = () => {
      if (!query.type) {
        canCalcPrice.value = false
        return
      }
      let type = toolOptions.value.find((t) => {
        return t.id == query.type
      })
      if (type.name == '量具') {
        canCalcPrice.value = false
        return
      }
      canCalcPrice.value = true
    }

    const calPriceNum = ref(null)
    const calcAllPrice = async () => {
      const queryObj = {
        ...query,
        lendTime: undefined,
        startDate: (query.lendTime && query.lendTime[0]) || undefined,
        endDate: (query.lendTime && query.lendTime[1]) || undefined,
      }
      if (props.userId) {
        queryObj.user = props.userId
      }
      let res = await calcPrice(queryObj)
      calPriceNum.value = res.data.totalCost
    }

    const columns = computed(() => {
      let arr = [
        {
          label: '物品名称',
          prop: 'name',
        },
        {
          label: '规格型号',
          prop: 'specification',
        },
      ]
      if (isAdmin) {
        arr.push({
          label: '领用人',
          prop: 'userName',
        })
      }
      arr = arr.concat([
        {
          label: '领用时间',
          prop: 'created',
        },
        {
          label: '领用数量',
          prop: 'num',
        },
        {
          label: '归还数量',
          prop: 'retNum',
        },
        {
          label: '报废数量',
          prop: 'waste',
        },
        {
          label: '最近归还时间',
          prop: 'retDate',
        },
      ])
      return arr
    })
    return {
      columns,
      query,
      lendTable,
      handleSearch,
      isAdmin,
      searchUserId,
      toolOptions,
      canCalcPrice,
      calcAllPrice,
      calPriceNum,
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
