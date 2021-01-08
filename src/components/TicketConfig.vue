<template>
  <div class="ticketConfigDiv">
    <el-form :model="ticketConfig" label-width="25%" ref="form">
      <el-form-item label="严格站名">
        <el-switch v-model="ticketConfig.isStationStrict"></el-switch>
      </el-form-item>
      <el-form-item label="自动提交">
        <el-switch v-model="ticketConfig.isAutoCommit"></el-switch>
      </el-form-item>
      <el-form-item label="自动刷票">
        <el-input
          v-model="ticketConfig.queryInterval"
          clearable
          class="formItemInput"
          placeholder="刷票间隔(单位:毫秒 推荐:500)"
        ></el-input>
        <el-switch v-model="ticketConfig.isAutoQuery" class="formItemSwitch"></el-switch>
      </el-form-item>
      <el-form-item label="期望车次">
        <el-input
          v-model="ticketConfig.trainLimit"
          clearable
          class="formItemInput"
          placeholder="车次白名单(空格隔开 例:G1 G2 K1555)"
        ></el-input>
        <el-switch v-model="ticketConfig.isTrainLimit" class="formItemSwitch"></el-switch>
      </el-form-item>
      <el-form-item label="自动候补">
        <el-select
          v-model="ticketConfig.autoAlternateType"
          clearable
          class="formItemInput"
          placeholder="请选择候补模式"
        >
          <el-option
            v-for="alternateType in alternateTypes"
            :label="alternateType.label"
            :key="alternateType.value"
            :value="alternateType.value"
          />
        </el-select>
        <el-switch v-model="ticketConfig.isAutoAltenate" class="formItemSwitch"></el-switch>
      </el-form-item>
      <el-form-item label="黑屋规则">
        <el-input
          v-model="ticketConfig.blackCount"
          clearable
          class="formItemInput"
          placeholder="下单/出票失败该次数后将不再对车次下单(单位:次  默认:3)"
        ></el-input>
      </el-form-item>
      <el-form-item label="黑屋时间">
        <el-input
          v-model="ticketConfig.blackTime"
          clearable
          class="formItemInput"
          placeholder="触发黑屋规则在该时间内不会对该车次下单(单位:秒  默认:120)"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- <div class="configTipDiv">
      <div class="textDiv1">静默刷票流程</div>
      <div class="textDiv2">
        <span class="dangerSpan">[登录]</span> →
        <span class="dangerSpan">填写车票站台、日期</span> →
        <span class="dangerSpan">选择乘客及座位</span> → 点击
        <span class="dangerSpan">[开始刷票]</span>
        <br />→ 在表格中选择
        <span class="dangerSpan">[期望的车次(空格隔开)]</span> → 打开
        <span class="dangerSpan">[刷票配置]</span> → 打开
        <span class="dangerSpan">[自动刷票]</span>开关
        <br />→ 配置
        <span class="dangerSpan">[刷票间隔]</span>、
        <span class="dangerSpan">[期望车次]</span>、
        <span class="dangerSpan">[黑屋规则和时间]</span> → 关闭
        <span class="dangerSpan">[刷票配置]</span> → 点击
        <span class="dangerSpan">[开始刷票]</span>
        <br />→ 此时即开启静默刷票(非卡住),成功后有
        <span class="dangerSpan">[弹框提示]</span>可打开
        <span class="dangerSpan">[刷票日志]</span>进行监控
      </div> -->
    </div>
  </div>
</template>

<script>
import Macro from '@/utils/Macro';
export default {
  name: 'TicketConfig',
  props: ['value'],
  computed: {
    ticketConfig() {
      return this.value;
    },
    alternateTypes() {
      return Macro.alternateTypes;
    },
  },
  methods: {
    filterNum(value) {
      let result = value.replace(/[^\d]+/, '');
      return result;
    }
  },
  watch: {
    'ticketConfig.isAutoQuery': {
      handler(newValue, oldValue) {
        if (newValue) {
          this.ticketConfig.isAutoCommit = true;
          if (!this.ticketConfig.queryInterval) {
            this.ticketConfig.queryInterval = 500;
          }
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
    }
  },
}
</script>

<style>
.ticketConfigDiv {
  margin-top: 20px;
}

.ticketDialog > .el-dialog__body {
  text-align: left;
  height: 450px;
}

.formItemInput {
  width: 60%;
}

.formItemSwitch {
  margin-left: 20px;
}

.configTipDiv {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
}

.textDiv1 {
  width: 25%;
  margin-left: -12px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.textDiv2 {
  flex: 1;
  padding-left: 25px;
}

.dangerSpan {
  color: red;
}
</style>
