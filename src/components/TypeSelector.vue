<template>
  <div class="typeSelectorDiv">
    {{tips.title}}
    <el-select v-model="handlerType" placeholder="请选择操作类型">
      <el-option
        :key="tips.alternate.value"
        :label="tips.alternate.label"
        :value="tips.alternate.value"
      />
      <el-option :key="tips.normal.value" :label="tips.normal.label" :value="tips.normal.value" />
    </el-select>
    <el-button type="primary" size="mini" @click.native="onSubmitBtnClick">{{tips.action}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'TypeSelector',
  props: ['category'], // queryQueue, cancelQueue, queryOrder
  data() {
    return {
      handlerType: null,
    };
  },
  methods: {
    onSubmitBtnClick() {
      this.$emit('onHandler', { category: this.category, handlerType: this.handlerType });
    }
  },
  computed: {
    tips() {
      if (this.category === 'queryQueue') {
        return {
          title: '请选择要查询的队列类型',
          alternate: {
            label: '候补队列',
            value: 'alternate'
          },
          normal: {
            label: '抢票队列',
            value: 'normal'
          },
          action: '查询',
        };
      } else if (this.category === 'cancelQueue') {
        return {
          title: '请选择要取消的队列类型',
          alternate: {
            label: '候补队列',
            value: 'alternate'
          },
          normal: {
            label: '抢票队列',
            value: 'normal'
          },
          action: '执行',
        };
      } else if (this.category === 'queryOrder') {
        return {
          title: '请选择要查询的订单类型',
          alternate: {
            label: '候补订单',
            value: 'alternate'
          },
          normal: {
            label: '抢票订单',
            value: 'normal'
          },
          action: '查询',
        };
      } else {
        return {
          title: '请选择要操作的类型',
          alternate: {
            label: '候补',
            value: 'alternate'
          },
          normal: {
            label: '抢票',
            value: 'normal'
          },
          action: '操作',
        };
      }
    }
  },
}
</script>
<style>
.typeSelectorDiv {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.typeSelectorDialog > .el-dialog__body {
  text-align: left;
  height: 150px;
}
</style>