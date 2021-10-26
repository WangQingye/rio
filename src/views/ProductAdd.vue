<template>
  <!-- 编辑弹出框 -->
  <el-dialog :title="propTitle || title"
    v-model="visible"
    :destroy-on-close="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    width="60%">
    <el-form label-width="170px"
      ref="ruleForm"
      :model="form"
      inline>
      <el-form-item :style="item.width ? `width:${item.width}` : 'width: 48%'"
        v-for="item in formItems"
        :key="item.key"
        :label="item.label"
        :rules="[
          { required: item.required === false ? false : true, message: `请填写${item.label}` }
        ]"
        :required="item.required === false ? false : true">
        <el-date-picker v-if="item.type=='date'"
          v-model="form[item.key]"
          type="date"
          :disabled="item.disabled"
          style="width: 100%"
          placeholder=选择日期>
        </el-date-picker>
        <el-select v-else-if="item.type=='select'"
          v-model="form[item.key]"
          type="date"
          :disabled="item.disabled"
          style="width: 100%">
          <el-option v-for="op in item.options"
            :key="op.value"
            :label="op.label"
            :value="op.value"></el-option>
        </el-select>
        <UserSelect v-else-if="item.type=='user'"
          v-model:userData="form[item.key]"
          style="width: 100%">
        </UserSelect>
        <el-input v-else
          v-model="form[item.key]"
          :disabled="item.disabled"
          :type="item.type || 'text'"
          :placeholder="item.placeholder"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <el-button type="primary"
          @click="saveEdit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import UserSelect from '@/components/UserSelect.vue'
export default {
  components: { UserSelect },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    formItems: {
      type: Array,
      required: true,
    },
    itemData: {
      type: Object,
    },
    propTitle: {
      type: String,
    },
  },
  emits: ['close', 'dialog-submit'],
  name: 'product-add',
  setup(props, { emit }) {
    const form = reactive({})
    const dialogVisible = computed(() => {
      return props.visible
    })
    const title = ref('编辑')
    watch(dialogVisible, () => {
      if (dialogVisible.value == true) {
        if (props.itemData) {
          Object.keys(props.itemData).map((key) => {
            form[key] = props.itemData[key]
          })
          title.value = '编辑'
        } else {
          title.value = '添加'
        }
      } else {
        Object.keys(form).map((key) => {
          delete form[key]
        })
      }
    })
    const close = () => {
      emit('close')
    }
    const ruleForm = ref()
    const saveEdit = async () => {
      // let res = await ruleForm.value.validate()
      ruleForm.value.validate((validte) => {
        console.log(validte)
      })
      emit('dialog-submit', form)
    }
    return {
      title,
      close,
      saveEdit,
      form,
      ruleForm,
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
