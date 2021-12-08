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
      <el-form-item :style="(item.width ? `width:${item.width}` : 'width: 48%') + ';' + ((!itemData && item.hideOnAdd) ? `display:none` : '')"
        v-for="item in formItems"
        :key="item.key"
        :label="item.label"
        :prop="item.key"
        :rules="[
          { required: item.required === false ? false : true, message: `请填写${item.label}` }
        ]"
        :required="item.required === false ? false : true">
        <el-date-picker v-if="item.type=='date'"
          v-model="form[item.key]"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="item.disabled || (itemData && item.editDisabled)"
          style="width: 100%"
          placeholder=选择日期>
        </el-date-picker>
        <el-select v-else-if="item.type=='select'"
          v-model="form[item.key]"
          type="date"
          :disabled="item.disabled || (itemData && item.editDisabled)"
          :allow-create="item.allowCreate"
          :filterable="item.allowCreate"
          @change="onSelectChange($event, item.key, item.watchChange)"
          style="width: 100%">
          <el-option v-for="op in item.options"
            :key="op.value"
            :label="op.label"
            :value="op.value"></el-option>
        </el-select>
        <UserSelect v-else-if="item.type=='user'"
          v-model:userData="form[item.key]"
          :userName="itemData?.userName"
          :disabled="item.disabled || (itemData && item.editDisabled)"
          style="width: 100%">
        </UserSelect>
        <el-input v-else
          v-model="form[item.key]"
          :disabled="item.disabled || (itemData && item.editDisabled)"
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import UserSelect from '@/components/UserSelect.vue'
import { ElMessage } from 'element-plus'
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
          title.value = '编辑'
        } else {
          title.value = '添加'
        }
        props.formItems.map((item) => {
          if (props.itemData && props.itemData[item.key] !== null) {
            form[item.key] = props.itemData[item.key]
          } else {
            form[item.key] = ''
          }
        })
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
      ruleForm.value.validate((validte) => {
        if (validte) {
          emit('dialog-submit', form)
        } else {
          ElMessage.warning('请完善表格')
        }
      })
    }
    const onSelectChange = (val, key, watchChange) => {
      if (watchChange) {
        if (key === 'name') {
          form.specification = {
            '光面塞规': 'φ',
            '空心光面塞规': 'φ',
            '卡规': 'φ',
            '螺纹塞规': 'M',
            '螺纹环规': 'M',
            '同轴度塞规': '6033-',
            '航空螺纹塞规': 'MJ',
            '航空螺纹环规': 'MJ',
          }[val]
        }
      }
    }
    return {
      title,
      close,
      saveEdit,
      form,
      ruleForm,
      onSelectChange,
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
