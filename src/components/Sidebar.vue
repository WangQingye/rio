<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      v-if="items.length"
      router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index"
            :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index">
                  {{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else
                :index="subItem.index"
                :key="subItem.index">{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index"
            :key="item.index">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { onBeforeMount, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { fetchData } from '../api/index'
export default {
  setup() {
    const toolSubs = ref([])
    const items = ref([])
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    onBeforeMount(() => {
      // fetchData('/toolTypes').then((res) => {
      //   toolSubs.value = res['toolTypes'].map(t => {
      //     return {
      //       index: `/tool?id=${t.toolId}`,
      //       title: t.toolName,
      //     }
      //   })
      // })
      if (store.state.userInfo.authorities[0].authority === 'SYS_ADMIN') {
        items.value = [
          {
            icon: 'el-icon-lx-cascades',
            index: '/product',
            title: '产品管理',
          },
          {
            icon: 'el-icon-lx-filter',
            index: '/mesuring',
            title: '量具管理',
          },
          {
            icon: 'el-icon-lx-tag',
            index: '/knife',
            title: '刀具管理',
          },
          {
            icon: 'el-icon-lx-file',
            title: '工具管理',
            subs: [
              ...toolSubs.value,
              {
                icon: 'el-icon-lx-file',
                index: '/tool-add',
                title: '添加工具种类',
              },
            ],
          },
          {
            icon: 'el-icon-lx-friendadd',
            index: '/user',
            title: '员工管理',
          },
          {
            icon: 'el-icon-date',
            index: '/work-list',
            title: '工作列表',
          },
          {
            icon: 'el-icon-document',
            index: '/lend-list',
            title: '领用清单',
          },
        ]
      } else {
        items.value = [
          {
            icon: 'el-icon-date',
            index: '/work-list',
            title: '工作列表',
          },
          {
            icon: 'el-icon-document',
            index: '/lend-list',
            title: '领用清单',
          },
        ]
        router.push('/work-list')
      }
    })


    const onRoutes = computed(() => {
      return route.path
    })

    const collapse = computed(() => store.state.collapse)

    return {
      items,
      onRoutes,
      collapse,
    }
  },
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
