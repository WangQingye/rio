import {createStore} from 'vuex'

const store = createStore({
    state: {
        tagsList: [],
        collapse: false,
        userInfo: null,
        toolTypes: [],
        lastMesureData: {}
    },
    mutations: {
        delTagsItem(state, data) {
            state
                .tagsList
                .splice(data.index, 1);
        },
        setTagsItem(state, data) {
            state
                .tagsList
                .push(data)
        },
        clearTags(state) {
            state.tagsList = []
        },
        closeTagsOther(state, data) {
            state.tagsList = data;
        },
        closeCurrentTag(state, data) {
            for (let i = 0, len = state.tagsList.length; i < len; i++) {
                const item = state.tagsList[i];
                if (item.path === data.$route.fullPath) {
                    if (i < len - 1) {
                        data
                            .$router
                            .push(state.tagsList[i + 1].path);
                    } else if (i > 0) {
                        data
                            .$router
                            .push(state.tagsList[i - 1].path);
                    } else {
                        data
                            .$router
                            .push("/");
                    }
                    state
                        .tagsList
                        .splice(i, 1);
                    break;
                }
            }
        },
        // 侧边栏折叠
        handleCollapse(state, data) {
            state.collapse = data;
        },
        // 
        setUserInfo(state, data) {
            state.userInfo = data;
        },
        // 
        removeUserInfo(state, data) {
            state.userInfo = null;
        },
        setToolTypes(state, data) {
            state.toolTypes = data
        },
        setLastMesureData(state, data) {
            state.lastMesureData = data
        }
    },
    actions: {},
    modules: {}
})
export function myStore() {
    return store
}
export default store