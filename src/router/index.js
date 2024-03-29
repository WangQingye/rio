import {
    createRouter,
    createWebHashHistory
} from "vue-router";
import Home from "../views/Home.vue";
import {
    myStore
} from '../store'
const routes = [{
    path: '/',
    redirect: '/product-unfinish'
}, {
    path: "/",
    name: "Home",
    component: Home,
    children: [{
        path: "/product-unfinish",
        name: "product-unfinish",
        meta: {
            title: '未完结产品'
        },
        component: () => import( /* webpackChunkName: "product-unfinish" */ "../views/ProductManage.vue")
    },{
        path: "/product-finish",
        name: "product-finish",
        meta: {
            title: '已完结产品'
        },
        component: () => import( /* webpackChunkName: "product-finish" */ "../views/ProductManage.vue")
    }, {
        path: "/mesuring",
        name: "mesuring",
        meta: {
            title: '量具管理'
        },
        component: () => import( /* webpackChunkName: "mesuring" */ "../views/MesuringManage.vue")
    }, {
        path: "/knife",
        name: "knife",
        meta: {
            title: '刀具管理'
        },
        component: () => import( /* webpackChunkName: "knife" */ "../views/KnifeManage.vue")
    }, {
        path: "/tool/:id",
        name: "tool",
        meta: {
            title: '工具管理'
        },
        component: () => import( /* webpackChunkName: "tool" */ "../views/ToolManage.vue")
    }, {
        path: "/tool-add",
        name: "tool-add",
        meta: {
            title: '添加工具种类'
        },
        component: () => import( /* webpackChunkName: "tool" */ "../views/ToolAdd.vue")
    }, {
        path: "/user",
        name: "user",
        meta: {
            title: '员工管理'
        },
        component: () => import( /* webpackChunkName: "user" */ "../views/UserManage.vue")
    }, {
        path: "/work-pay",
        name: "work-pay",
        meta: {
            title: '工资结算'
        },
        component: () => import( /* webpackChunkName: "work-pay" */ "../views/WorkPay.vue")
    }, {
        path: "/work-list",
        name: "work-list",
        meta: {
            title: '工作任务'
        },
        component: () => import( /* webpackChunkName: "work-list" */ "../views/WorkList.vue")
    }, {
        path: "/lend-list",
        name: "lend-list",
        meta: {
            title: '领用记录'
        },
        component: () => import( /* webpackChunkName: "lend-list" */ "../views/LendList.vue")
    }]
}, {
    path: "/login",
    name: "Login",
    meta: {
        title: '登录'
    },
    component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
}];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

const store = myStore();
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | 瑞奥机械`;
//     const role = store.state.userInfo;
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ?
//             next() :
//             next('/403');
//     } else {
//         next();
//     }
// });

export default router;