<template>
  <div class="ticketsDiv">
    <el-table
      :data="ticketInfosTemp"
      :border="true"
      :stripe="true"
      :cell-style="cellStyleCallBack"
      style="height: 100%"
      height="0"
    >
      <el-table-column label="车次" prop="trainCount" header-align="center" align="center" fixed></el-table-column>
      <el-table-column label="站台" prop="station" header-align="center" align="center">
        <template slot-scope="scope">
          <div @click="onStationClick(scope.row)">{{scope.row.station}}</div>
        </template>
      </el-table-column>
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
import Handler from '@/utils/Handler';
export default {
  name: 'Tickets',
  props: ['ticketInfos'],
  computed: {
    ticketInfosTemp() {
      return this.ticketInfos.map((ticketInfo) => {
        return Handler.toTicketDisplayInfo(ticketInfo);
      });
    },
  },
  methods: {
    createOrderBtnClick(ticketDisplayInfo) {
      let trainInfo = Handler.toTrainInfo(ticketDisplayInfo);
      this.$emit('onOrder', trainInfo);
    },
    onStationClick(ticketDisplayInfo) {
      let trainInfo = Handler.toTrainInfo(ticketDisplayInfo);
      this.$emit('onStationClick', trainInfo);
    },
    cellStyleCallBack(loc) {
      let key = loc.column.property;
      let rowIndex = loc.rowIndex;
      let columnIndex = loc.columnIndex;
      let value = this.ticketInfos[rowIndex][key];
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
}
</style>
