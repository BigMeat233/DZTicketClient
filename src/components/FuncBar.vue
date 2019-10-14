<template>
  <div class="funcBar">
    <el-button class="formBtn" @click.native="btnClick(0)" v-if="!isAutoQuering">重置站台</el-button>
    <el-button type="success" class="formBtn" @click.native="btnClick(1)">刷票配置</el-button>
    <el-button type="primary" class="formBtn" @click.native="btnClick(2)" v-if="!isAutoQuering">开始刷票</el-button>
    <el-button type="info" class="formBtn" @click.native="btnClick(3)" v-if="!isAutoQuering">排队情况</el-button>
    <el-button type="danger" class="formBtn" @click.native="btnClick(4)" v-if="!isAutoQuering">取消排队</el-button>
    <el-badge :value="selectedPersonCount" class="personBadge">
      <el-button type="warning" class="formBtn" @click.native="btnClick(5)">选择乘客</el-button>
    </el-badge>
    <el-badge :value="alternateCount" class="alternateBadge" v-show="alternateCount">
      <el-button type="warning" class="formBtn alternateBtn" @click.native="btnClick(10)">候补座次</el-button>
    </el-badge>
    <el-button
      circle
      icon="el-icon-tickets"
      title="未完成订单"
      v-if="!isAutoQuering"
      @click.native="btnClick(6)"
    />
    <el-button type="info" icon="el-icon-house" circle @click.native="btnClick(8)" title="小黑屋" />
    <el-button
      type="danger"
      icon="el-icon-video-pause"
      circle
      v-if="isAutoQuering"
      title="停止刷票"
      @click.native="btnClick(7)"
    />
    <el-button
      type="success"
      icon="el-icon-video-camera-solid"
      circle
      @click.native="btnClick(9)"
      title="刷票日志"
    />
    <el-button
      type="primary"
      icon="el-icon-question"
      circle
      @click.native="btnClick(11)"
      title="使用说明"
    />
  </div>
</template>

<script>
export default {
  name: 'FuncBar',
  props: ['isAutoQuering', 'alternateCount', 'selectedPersonCount'],
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
      } else if (index === 5) {
        this.$emit('onPersonBtnClick');
      } else if (index === 6) {
        this.$emit('onQueryOrderBtnClick');
      } else if (index === 7) {
        this.$emit('onStopQueryBtnClick');
      } else if (index === 8) {
        this.$emit('onBlackListBtnClick');
      } else if (index === 9) {
        this.$emit('onRecordBtnClick');
      } else if (index === 10) {
        this.$emit('onAlternateBtnClick');
      } else if (index === 11) {
        this.$emit('onHelpBtnClick');
      }
    }
  },
}
</script>

<style scoped>
.funcBar {
  padding-top: 10px;
  padding-bottom: 10px;
  height: 45px;
  border-bottom: 1px dashed rgb(177, 177, 177);
}

.personBadge {
  margin-left: 10px;
}

.alternateBadge {
  margin-left: 10px;
}
</style>
