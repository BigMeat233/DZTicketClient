<template>
  <div class="alternateTipDiv">
    {{rateInfo.info}}
    , 成功率:
    {{{4:'极低',3:'低',2:'中',1:'高'}[rateInfo.level]}}
    <el-button
      class="addAlternateBtn"
      size="mini"
      type="primary"
      plain
      @click.native="onAddBtnClick"
    >添加候补</el-button>
  </div>
</template>
<script>
export default {
  name: 'AlternateTip',
  props: ['rateInfo', 'onAddBtnClick'],
}
</script>
<style scoped>
.alternateTipDiv {
  display: flex;
  flex-direction: row;
  color: #67c23a;
  font-size: 14px;
  align-items: center;
}

.addAlternateBtn {
  margin-left: 15px;
}
</style>