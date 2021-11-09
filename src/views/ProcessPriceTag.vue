<template>
  <el-form label-width="100px"
    inline>
    <el-form-item style="width: 20%"
      :label="`序号 : `">
      <span style="font-weight: bold">{{pricesData.serial}}</span>
    </el-form-item>
    <el-form-item style="width: 20%"
      v-for="item in priceItems"
      :key="item.key"
      :label="`${item.label} : `">
      <span style="font-weight: bold">{{pricesData[item.key] || '未填报'}}</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
        size="small"
        v-if="isInIndex"
        @click="handleEdit">填报价格</el-button>
    </el-form-item>
  </el-form>
  <ProductAdd :visible="priceEditVisible"
    @close="priceEditVisible = false"
    :itemData="editItemData"
    :title="'填报价格'"
    :formItems="priceItems"
    key="product-edit"
    @dialog-submit="editSubmit"></ProductAdd>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import ProductAdd from './ProductAdd.vue'
import { fillSerialPrice } from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { ProductAdd },
  props: {
    pricesData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isInIndex: {
      type: Boolean,
    },
  },
  emits: ['dialog-submit'],
  name: 'process-price-tag',
  setup(props, { emit }) {
    console.log(props.pricesData)
    const priceEditVisible = ref(false)
    const editItemData = ref(null)
    const editSubmit = async (formData) => {
      await fillSerialPrice({
        productId: props.pricesData.id,
        ...formData,
        id: props.pricesData.workingPriceId || undefined
      })
      ElMessage.success('填报成功')
      priceEditVisible.value = false
      emit('refresh')
    }
    // 表格编辑时弹窗和保存
    const handleEdit = (row) => {
      priceEditVisible.value = true
      editItemData.value = props.pricesData
    }
    return {
      priceItems: [
        { label: '车工序价格', key: 'lathePrice', required: true },
        { label: '铣工序价格', key: 'millingPrice', required: true },
        { label: '钳工序价格', key: 'fitterPrice', required: true },
      ],
      priceEditVisible,
      editItemData,
      handleEdit,
      editSubmit,
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
.red {
  color: #ff0000;
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
