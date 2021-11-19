<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn"
      @click="collapseChage">
      <i v-if="!collapse"
        class="el-icon-s-fold"></i>
      <i v-else
        class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">瑞奥机械</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark"
            :content="message?`有${message}条未读消息`:`消息中心`"
            placement="bottom">
            <router-link to="/work-list">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge"
            v-if="message"></span>
        </div> -->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name"
          trigger="click"
          @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}} | {{{'SYS_ADMIN':'系统管理员', 'SYS_EMPLOYEE':'普通员工', 'SYS_CONTACT': '外协联络员', 'SYS_PRODUCT': '生产管理员', 'SYS_STORE': '仓库管理员', 'SYS_FINANCIAL': '财务管理员', 'SYS_QUALITY': '质量管理员'}[userType]}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item divided
                command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <ProductAdd :visible="editPasswordVisible"
      @close="editPasswordVisible = false"
      :propTitle="'密码修改'"
      :formItems="passwordItems"
      key="product-edit"
      @dialog-submit="editPasswordSubmit"></ProductAdd>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ProductAdd from '../views/ProductAdd.vue'
import { ElMessage } from 'element-plus'
import * as api from '@/api/user'
export default {
  components: { ProductAdd },
  setup() {
    const store = useStore()
    const username = store.state.userInfo.user.realName
    const userType = store.state.userInfo.authorities[0].authority
    const message = 2

    const collapse = computed(() => store.state.collapse)
    // 侧边栏折叠
    const collapseChage = () => {
      store.commit('handleCollapse', !collapse.value)
    }

    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage()
      }
    })
    const editPasswordVisible = ref(false)
    // 用户名下拉菜单选择事件
    const router = useRouter()
    const handleCommand = async (command) => {
      if (command == 'loginout') {
        await api.logOut()
        localStorage.removeItem('ruiao_user')
        store.commit('removeUserInfo')
        router.push('/login')
      } else if (command == 'password') {
        editPasswordVisible.value = true
      }
    }
    // 归还
    const passwordItems = [
      { label: '旧密码', key: 'oldPassword' },
      { label: '新密码', key: 'newPassword' },
      { label: '确认新密码', key: 'renew' },
    ]
    const editPasswordSubmit = async (formData) => {
      if (formData.newPassword.length < 6) {
        ElMessage.error('密码不能少于6位')
        return
      }
      if (formData.newPassword !== formData.renew) {
        ElMessage.error('确认密码有误')
        return
      }
      await api.editPassword({
        userName: store.state.userInfo.user.userName,
        ...formData
      })
      ElMessage.success('操作成功')
      editPasswordVisible.value = false
    }

    return {
      username,
      userType,
      message,
      collapse,
      collapseChage,
      handleCommand,
      editPasswordVisible,
      passwordItems,
      editPasswordSubmit,
    }
  },
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 100px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
