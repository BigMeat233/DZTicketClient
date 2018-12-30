<template>
  <div class="ticketConfigDiv">
    <el-form :model="ticketConfig" label-width="25%" ref="form">
      <el-form-item label="自动提交">
        <el-switch v-model="ticketConfig.isAutoCommit"></el-switch>
      </el-form-item>
      <el-form-item label="自动刷票">
        <el-input
          v-model="ticketConfig.queryInterval"
          clearable
          class="formItemInput"
          placeholder="刷票间隔(单位:毫秒)"
        ></el-input>
        <el-switch v-model="ticketConfig.isAutoQuery" class="formItemSwitch"></el-switch>
      </el-form-item>
      <el-form-item label="车次过滤">
        <el-input
          v-model="ticketConfig.trainLimit"
          clearable
          class="formItemInput"
          placeholder="车次白名单(逗号隔开)"
        ></el-input>
        <el-switch v-model="ticketConfig.isTrainLimit" class="formItemSwitch"></el-switch>
      </el-form-item>
      <div class="tipDiv">Tip:自动提交功能将对搜索结果中的车次下单,务必结合白名单使用</div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'TicketConfig',
  props: ['value'],
  computed: {
    ticketConfig: {
      get() { return this.value },
      set(newValue) { this.$emit('input', newValue) },
    },
  },
  watch: {
    'ticketConfig.isAutoQuery': {
      handler(newValue, oldValue) {
        if (newValue) {
          this.ticketConfig.isAutoCommit = true;
          this.ticketConfig.queryInterval = 500;
        } else {
          this.ticketConfig.queryInterval = '';
        }
      }
    },
    'ticketConfig.isAutoCommit': {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.ticketConfig.isAutoQuery = false;
        } else {
          this.ticketConfig.isTrainLimit = true;
        }
      }
    },
    'ticketConfig.isTrainLimit': {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.ticketConfig.isAutoCommit = false;
        }
      }
    },
  },
}
</script>

<style>
.ticketConfigDiv {
  margin-top: 20px;
}

.ticketDialog > .el-dialog__body {
  text-align: left;
  height: 240px;
}

.formItemInput {
  width: 60%;
}

.formItemSwitch {
  margin-left: 20px;
}

.tipDiv {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
