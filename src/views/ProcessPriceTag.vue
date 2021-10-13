<template>
  <el-form label-width="100px"
    inline>
    <el-form-item style="width: 20%"
      :label="`序号 : `">
      <span style="font-weight: bold">{{fromIndex}}</span>
    </el-form-item>
    <el-form-item style="width: 20%"
      v-for="item in priceItems"
      :key="item.key"
      :label="`${item.label} : `">
      <span style="font-weight: bold">{{prices[item.key] || '未填报'}}</span>
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
export default {
  components: { ProductAdd },
  props: {
    prices: {
      type: Object,
      default: () => {
        return {}
      },
    },
    fromIndex: {
      type: String,
    },
    isInIndex: {
      type: Boolean,
    },
  },
  emits: ['dialog-submit'],
  name: 'process-price-tag',
  setup(props, { emit }) {
    console.log(props.prices)
    const priceEditVisible = ref(false)
    const editItemData = ref(null)
    const editSubmit = () => {}
    // 表格编辑时弹窗和保存
    const handleEdit = (row) => {
      priceEditVisible.value = true
      editItemData.value = props.prices
    }
    return {
      priceItems: [
        { label: '车工序价格', key: 'cPrice', required: true },
        { label: '铣工序价格', key: 'xPrice', required: true },
        { label: '钳工序价格', key: 'qPrice', required: true },
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
