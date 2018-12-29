<template>
  <div class="ticketsDiv">
    <el-table
      :data="ticketInfosTemp"
      :border="true"
      :stripe="true"
      :style="{width:'100%',height:'100%'}"
      height="100%"
      :cell-style="cellStyleCallBack"
    >
      <el-table-column label="车次" prop="trainCount" header-align="center" align="center" fixed></el-table-column>
      <el-table-column label="站台" prop="station" header-align="center" align="center"></el-table-column>
      <el-table-column label="日期" prop="date" header-align="center" align="center"></el-table-column>
      <el-table-column label="时间" prop="time" header-align="center" align="center"></el-table-column>
      <el-table-column label="商务座" prop="superSeat" header-align="center" align="center"></el-table-column>
      <el-table-column label="一等座" prop="firSeat" header-align="center" align="center"></el-table-column>
      <el-table-column label="二等座" prop="secSeat" header-align="center" align="center"></el-table-column>
      <el-table-column label="动卧" prop="superBed" header-align="center" align="center"></el-table-column>
      <el-table-column label="高级软卧" prop="superSoftBed" header-align="center" align="center"></el-table-column>
      <el-table-column label="软卧" prop="softBed" header-align="center" align="center"></el-table-column>
      <el-table-column label="软座" prop="softSeat" header-align="center" align="center"></el-table-column>
      <el-table-column label="硬卧" prop="hardBed" header-align="center" align="center"></el-table-column>
      <el-table-column label="硬座" prop="hardSeat" header-align="center" align="center"></el-table-column>
      <el-table-column label="无座" prop="noSeat" header-align="center" align="center"></el-table-column>
      <el-table-column label="状态" prop="state" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" header-align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click.native="createOrderBtnClick(scope.row)">下单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Tickets',
  props: ['ticketInfos'],
  computed: {
    ticketInfosTemp() {
      return this.ticketInfos.map((ticketInfo) => {
        return {
          trainCount: ticketInfo.trainCount,
          date: ticketInfo.date,
          time: ticketInfo.startT + ' - ' + ticketInfo.endT + ' | ' + ticketInfo.duration,
          station: ticketInfo.startStr + ' - ' + ticketInfo.endStr,
          superSeat: ticketInfo.superSeat,// 商务座
          firSeat: ticketInfo.firSeat,// 一等座
          secSeat: ticketInfo.secSeat,// 二等座
          superBed: ticketInfo.superBed,// 动卧
          superSoftBed: ticketInfo.superSoftBed,// 高级软卧
          softBed: ticketInfo.softBed,// 软卧
          softSeat: ticketInfo.softSeat,// 软座
          hardBed: ticketInfo.hardBed,// 硬卧
          hardSeat: ticketInfo.hardSeat,// 硬座
          noSeat: ticketInfo.noSeat,// 无座
          trainId: ticketInfo.trainId,
          location: ticketInfo.location,
          startS: ticketInfo.startS,
          endS: ticketInfo.endS,
          startN: ticketInfo.startStr,
          endN: ticketInfo.endStr,
          secStr: ticketInfo.secStr,
          trainNo: ticketInfo.trainNo,
          state: ticketInfo.state,
        };
      });
    },
  },
  methods: {
    createOrderBtnClick(data) {
      let trainId = data.trainId;
      let trainNo = data.trainNo;
      let trainCount = data.trainCount;
      let location = data.location;
      let secStr = data.secStr;
      let startS = data.startS;
      let endS = data.endS;
      let startN = data.startN;
      let endN = data.endN;
      let date = data.date.substring(0, 4) + '-' + data.date.substring(4, 6) + '-' + data.date.substring(6, 8);
      let superSeat = data.superSeat;// 商务座
      let firSeat = data.firSeat;// 一等座
      let secSeat = data.secSeat;// 二等座
      let superBed = data.superBed;// 动卧
      let superSoftBed = data.superSoftBed;// 高级软卧
      let softBed = data.softBed;// 软卧
      let softSeat = data.softSeat;// 软座
      let hardBed = data.hardBed;// 硬卧
      let hardSeat = data.hardSeat;// 硬座
      let noSeat = data.noSeat;// 无座

      let trainInfo = {
        trainId,
        trainNo,
        trainCount,
        location,
        secStr,
        startS,
        startN,
        endS,
        endN,
        date,
        superSeat,
        firSeat,
        secSeat,
        superBed,
        superSoftBed,
        softBed,
        softSeat,
        hardBed,
        hardSeat,
        noSeat
      };
      this.$emit('onOrder', trainInfo);
    },
    cellStyleCallBack(loc) {
      var key = loc.column.property;
      var rowIndex = loc.rowIndex;
      var columnIndex = loc.columnIndex;
      var value = this.ticketInfos[rowIndex][key];
      if (columnIndex > 3 && columnIndex < 14) {
        if (value === '无') {
          return {
            color: 'red',
          };
        } else {
          return {
            color: 'green',
          };
        }
      }
      if (columnIndex == 14) {
        if (value === '预订') {
          return {
            color: 'green',
          };
        } else {
          return {
            color: 'red',
          };
        }
      }
    },
  },
}
</script>

<style scoped>
.ticketsDiv {
  flex: 1;
  justify-content: center;
  align-items: center;
  overflow: scroll;
}
</style>
