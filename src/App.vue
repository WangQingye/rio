<template>
  <router-view />
</template>

<script>
import * as api from '@/api/user'
import { useStore } from 'vuex'
// import { onCreated } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios';
export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    axios.post("/serverBackend/api/v2/base/feishu/account/login/getToken",{
          feiShuId: '4e3873gc'
        })
        .then(res => {
        
        })
        .catch((err) => {
            console.error(err)
        })
    // onMounted(() => {
    let user = localStorage.getItem('ruiao_user')
    console.log(user)
    if (!user) {
      router.push('/login')
    } else {
      store.commit('setUserInfo', JSON.parse(user))
    }
    // })
    // let res = await api.login({
    //   username: '',
    //   password: '',
    // })
    // if (!res.status) {
    //   ElMessage.success('登录成功')
    //   store.commit('setUserInfo', res)
    //   if (res.authorities[0].authority === 'SYS_ADMIN') {
    //     router.push('/')
    //   } else {
    //     router.push('/work-list')
    //   }
    // } else {
    //   ElMessage.error('请重新登录')
    //   router.push('/login')
    //   return false
    // }
  },
}
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
