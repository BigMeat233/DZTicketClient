<template>
  <div class="alternateDiv">
    <el-table :data="alternatesTemp" :border="true" :stripe="true" style="height: 333px" height="0">
      <el-table-column label="车次" prop="trainCount" header-align="center" align="center" />
      <el-table-column label="站台" prop="station" header-align="center" align="center" />
      <el-table-column label="日期" prop="date" header-align="center" align="center" />
      <el-table-column label="时间" prop="time" header-align="center" align="center" />
      <el-table-column label="座位类型" prop="seatTypeName" header-align="center" align="center" />
      <el-table-column label="成功率" prop="levelDesc" header-align="center" align="center" />
      <el-table-column label="位次" prop="info" header-align="center" align="center" />
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="danger" @click.native="onRemoveAlternate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="handlerDiv">
      兑现截止时间
      <div>
        <el-date-picker
          :picker-options="datePickerOptions"
          v-model="ddlDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        />
        <el-select v-model="ddlHour" placeholder="请选择小时" @change="onDdlHourChange">
          <el-option
            v-for="options in hourPickerOptions"
            :key="options.value"
            :label="options.label"
            :value="options.value"
          />
        </el-select>
        <el-select v-model="ddlMinute" no-data-text="请先选择小时" placeholder="请选择分钟">
          <el-option
            v-for="options in minutePickerOptions"
            :key="options.value"
            :label="options.label"
            :value="options.value"
          />
        </el-select>
      </div>
      <el-button type="primary" @click.native="onSubmitBtnClick">提交候补订单</el-button>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import Macro from '@/utils/Macro';
import Core from '@/utils/Core';
export default {
  name: 'Alternate',
  props: ['alternates'],
  data() {
    const hourPickerOptions = [];
    for (let i = 6; i < 20; i++) {
      hourPickerOptions.push({
        value: i < 10 ? `0${i}` : i.toString(),
        label: i < 10 ? `0${i} 时` : `${i} 时`,
      });
    }

    const self = this;
    const datePickerOptions = {
      disabledDate(date) {
        const startDate = moment().startOf('day').valueOf();
        const alternatesCopy = [...self.alternates]
        const lastAlternate = alternatesCopy.sort((v1, v2) => v1.dateStr > v2.dateStr ? 1 : -1).pop();
        if (!lastAlternate) {
          return true;
        }
        const endDate = moment(lastAlternate.dateStr).subtract(1, 'day').valueOf();
        if (date >= startDate && date <= endDate) {
          return false;
        } else {
          return true;
        }
      },
    };

    return {
      hourPickerOptions,
      datePickerOptions,
      ddlDate: null,
      ddlHour: null,
      ddlMinute: null,
    };
  },
  computed: {
    minutePickerOptions() {
      if (!this.ddlHour) {
        return [];
      } else if (this.ddlHour === '19') {
        return [{ label: '00 分', value: '00' }];
      } else {
        const result = [];
        for (let i = 0; i < 60; i++) {
          result.push({
            value: i < 10 ? `0${i}` : i.toString(),
            label: i < 10 ? `0${i} 分` : `${i} 分`,
          });
        }
        return result;
      }
    },
    alternatesTemp() {
      const levelMap = {
        4: '极低',
        3: '低',
        2: '中',
        1: '高'
      };
      return this.alternates.map((alternate) => ({
        ...alternate,
        date: moment(alternate.dateStr).format('YYYY-MM-DD'),
        seatTypeName: Macro.seatTypeCodeMap[alternate.seatTypeCode].seatTypeName,
        station: `${alternate.startN} - ${alternate.endN}`,
        levelDesc: levelMap[alternate.level]
      }));
    },
  },
  methods: {
    onRemoveAlternate(data) {
      this.$emit('onRemoteBtnClick', {
        trainNo: data.trainNo,
        dateStr: data.dateStr,
        seatTypeCode: data.seatTypeCode
      });
    },
    onSubmitBtnClick() {
      if (this.alternates.length === 0) {
        Core.ui.message.warn('请添加要候补的座次');
        return;
      }

      if (!this.ddlDate || !this.ddlHour || !this.ddlMinute) {
        Core.ui.message.warn('请选择兑现截止时间');
        return;
      }

      const dateTime = `${this.ddlDate} ${this.ddlHour}:${this.ddlMinute}:00`;
      this.$emit('onSubmitBtnClick', dateTime);
    },
    onDdlHourChange(ddlHour) {
      if (ddlHour === '19') {
        this.ddlMinute = '00';
      } else {
        this.ddlMinute = '59';
      }
    },
  },
}
</script>
<style>
.alternateDiv {
  height: 100%;
}

.alternateDialog > .el-dialog__body {
  text-align: left;
  height: 480px;
}
</style>
<style scoped>
.handlerDiv {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>