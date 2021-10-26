<template>
  <div>
    <el-select v-model="userData"
      filterable
      remote
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
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
import { ref, reactive } from 'vue'
import { fetchData } from '../api/index'
export default {
  name: 'user-select',
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false)
    const options = ref([])
    const list = ref([])
    list.value = [
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'Florida',
      'Georgia',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Carolina',
      'North Dakota',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Pennsylvania',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming',
    ].map((item) => {
      return { value: `value:${item}`, label: `label:${item}` }
    })
    const remoteMethod = (query) => {
      if (query !== '') {
        loading.value = true
        setTimeout(() => {
          console.log(query)
          loading.value = false
          options.value = list.value.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        options.value = []
      }
    }
    const onSelectChange = (val) => {
      console.log(val)
      emit('update:userData', val)
    }
    return {
      onSelectChange,
      remoteMethod,
      options,
      list,
      loading
    }
  },
}
</script>

<style scoped>
</style>
