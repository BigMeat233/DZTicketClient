<template>
  <div class="ticketsDiv">
    <el-table
      :data="ticketInfosTemp"
      :border="true"
      :stripe="true"
      :cell-style="cellStyleCallBack"
      @cell-click="onCellClick"
      style="height: 100%"
      height="0"
    >
      <el-table-column label="车次" prop="trainCount" header-align="center" align="center" fixed />
      <el-table-column label="站台" prop="station" header-align="center" align="center" fixed>
        <template slot-scope="scope">
          <div @click="onStationClick(scope.row)">{{scope.row.station}}</div>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="date" header-align="center" align="center" fixed />
      <el-table-column label="时间" prop="time" header-align="center" align="center" fixed />
      <el-table-column
        v-for="seatTypeInfo in Object.values(seatTypeKeyMap)"
        :key="seatTypeInfo.seatTypeKey"
        :label="seatTypeInfo.seatTypeName"
        :prop="seatTypeInfo.seatTypeKey"
        header-align="center"
        align="center"
      />
      <el-table-column key="state" label="状态" prop="state" header-align="center" align="center" />
      <el-table-column label="操作" header-align="center" align="center" fixed="right" width="150px">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click.native="queryPriceBtnClick(scope.row)">票价</el-button>
          <el-button size="small" type="primary" @click.native="createOrderBtnClick(scope.row)">下单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Handler from '@/utils/Handler';
import Macro from '@/utils/Macro';
export default {
  name: 'Tickets',
  props: ['ticketInfos'],
  computed: {
    ticketInfosTemp() {
      return this.ticketInfos.map((ticketInfo) => {
        return Handler.toTicketDisplayInfo(ticketInfo);
      });
    },
    seatTypeKeyMap() {
      return Macro.seatTypeKeyMap;
    }
  },
  methods: {
    createOrderBtnClick(ticketDisplayInfo) {
      let trainInfo = Handler.toTrainInfo(ticketDisplayInfo);
      this.$emit('onOrder', trainInfo);
    },
    queryPriceBtnClick(ticketDisplayInfo) {
      let trainInfo = Handler.toTrainInfo(ticketDisplayInfo);
      this.$emit('onQueryPrice', trainInfo);
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
      if (columnIndex > 0 && columnIndex <= 3) {
        return { userSelect: 'none' };
      }
      else if (columnIndex > 3 && columnIndex < 19) {
        if (value === '无') {
          return { color: 'red' };
        }
        else if (value === '候补') {
          return { color: 'orange' };
        }
        else {
          return { color: 'green' };
        }
      }
      else if (columnIndex == 19) {
        if (value === '预订') {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      }
    },
    onCellClick(data, column, cell) {
      const validKeys = Object.keys(this.seatTypeKeyMap);
      const key = column.property;
      if (validKeys.indexOf(key) === -1) {
        return;
      }
      if (data[key] === '候补') {
        this.$emit('onAlternate', {
          secStr: data.secStr,
          seatTypeCode: this.seatTypeKeyMap[key].seatTypeCode,
          trainCount: data.trainCount,
          time: data.time,
          startN: data.startN,
          endN: data.endN,
          date: data.date,
        });
      }
    }
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
