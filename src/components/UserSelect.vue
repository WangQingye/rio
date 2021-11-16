<template>
  <div>
    <el-select v-model="userData"
      filterable
      remote
      placeholder="输入名字搜索"
      :remote-method="remoteMethod"
      clearable
      :disabled="disabled"
      @change="onSelectChange"
      :loading="loading">
      <el-option v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { getUserList } from '@/api/user'
export default {
  name: 'user-select',
  props: {
    userData: {
      type: Number,
      required: true,
      default: '',
    },
    userName: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false)
    const options = ref([])
    const remoteMethod = async (query) => {
      if (query !== '') {
        loading.value = true
        let res = await getUserList({
          userName: query,
          pageNo: 1,
          pageSize: 100,
        })
        options.value = res.data.records.map((item) => {
          return { value: item.id, label: item.realName }
        })
        console.log(options)
        loading.value = false
      } else {
        options.value = []
      }
    }
    const onSelectChange = (val) => {
      console.log(val)
      emit('update:userData', val)
    }
    onMounted(() => {
      console.log(props.userName)
      if (props.userName) remoteMethod(props.userName)
    })
    return {
      onSelectChange,
      remoteMethod,
      options,
      loading,
    }
  },
}
</script>

<style scoped>
</style>
