<template>
  <div class="funcBar">
    <el-button class="formBtn" @click.native="btnClick(0)">重置站台</el-button>
    <el-button type="success" class="formBtn" @click.native="btnClick(1)">刷票配置</el-button>
    <el-button type="primary" class="formBtn" @click.native="btnClick(2)">开始刷票</el-button>
    <el-button type="info" class="formBtn" @click.native="btnClick(3)">排队情况</el-button>
    <el-button type="danger" class="formBtn" @click.native="btnClick(4)">取消排队</el-button>
    <el-button type="warning" class="formBtn" @click.native="btnClick(5)">选择乘客</el-button>
    <el-button icon="el-icon-tickets" circle @click.native="btnClick(6)"></el-button>
  </div>
</template>

<script>
export default {
  name: 'FuncBar',
  methods: {
    btnClick(index) {
      if (index === 0) {
        this.$emit('onResetBtnClick');
      } else if (index === 1) {
        this.$emit('onAdvanceBtnClick');
      } else if (index === 2) {
        this.$emit('onQueryTicketBtnClick');
      } else if (index === 3) {
        this.$emit('onQueryQueueBtnClick');
      } else if (index === 4) {
        this.$emit('onCancelQueueBtnClick');
      } else if(index === 5){
        this.$emit('onPersonBtnClick');
      } else if(index === 6){
        this.$emit('onQueryOrderBtnClick');
      } 
    }
  },
}
</script>

<style scoped>
.funcBar {
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgb(177, 177, 177);
}
</style>
