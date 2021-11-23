<template>
  <div class="login-wrap">
    <div class="ms-login">
      <!-- <div class="ms-title">瑞奥机械</div> -->
      <img class="logo-img"
        src="@/assets/img/logo.jpg" />
      <el-form :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username"
            placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm()">
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary"
            @click="submitForm()">登录</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as api from '@/api/user'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const param = reactive({
      username: '',
      password: '',
    })

    const rules = {
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    }
    const login = ref(null)
    const submitForm = async () => {
      login.value.validate(async (valid) => {
        if (valid) {
          let res = await api.login({
            username: param.username,
            password: param.password,
          })
          if (!res.status && res) {
            ElMessage.success('登录成功')
            store.commit('setUserInfo', res)
            localStorage.setItem('ruiao_user', JSON.stringify(res))
            if (res.authorities[0].authority === 'SYS_ADMIN') {
              router.push('/')
            } else {
              router.push('/work-list')
            }
          } else {
            ElMessage.error(res.msg)
            return false
          }
        } else {
          ElMessage.error('请完善表格')
          return false
        }
      })
    }
    store.commit('clearTags')
    return {
      param,
      rules,
      login,
      submitForm,
    }
  },
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.logo-img {
  height: 50px;
  display: block;
  margin: 20px auto;
  margin-bottom: 0;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>