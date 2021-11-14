<template>
  <el-button :type="type"
    :style="`${show ?  '' : 'display: none'}`">
    <slot></slot>
  </el-button>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'my-button',
  props: {
    canUsers: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: 'primay',
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const show = computed(() => {
      const userType = store.state.userInfo.authorities[0].authority
      return props.canUsers.includes(userType)
    })
    return { show }
  },
}
</script>

<style scoped>
</style>
