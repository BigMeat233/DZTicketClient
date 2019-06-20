<template>
  <div class="stationStopsDiv">
    <el-table
      :data="stationStops"
      :border="true"
      :cell-style="cellStyleCallBack"
      style="height: 100%"
      height="0"
    >
      <el-table-column label="站序" prop="stationNo" header-align="center" align="center"/>
      <el-table-column label="站名" prop="stationName" header-align="center" align="center"/>
      <el-table-column label="到站时间" prop="arriveTime" header-align="center" align="center"/>
      <el-table-column label="出发时间" prop="startTime" header-align="center" align="center"/>
      <el-table-column label="停留时间" prop="stopoverTime" header-align="center" align="center"/>
      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            :disabled="scope.row.stationName === startStation"
            @click.native="onStartStationSetting(scope.row.stationName)"
          >设为起点</el-button>
          <el-button
            size="small"
            type="danger"
            :disabled="scope.row.stationName === endStation"
            @click.native="onEndStationSetting(scope.row.stationName)"
          >设为终点</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'StationStops',
  props: ['startStation', 'endStation', 'stationStops'],
  data() {
    return {

    };
  },
  methods: {
    cellStyleCallBack(loc) {
      let rowIndex = loc.rowIndex;
      let isInBlock = this.stationStops[rowIndex].isInBlock;
      if (!isInBlock) {
        return { color: '#999999' };
      }
    },
    onStartStationSetting(stationName) {
      this.$emit('onStartStationSetting', stationName);
    },
    onEndStationSetting(stationName) {
      this.$emit('onEndStationSetting', stationName);
    }
  },
}
</script>
<style>
.stationStopsDiv {
  height: 100%;
}

.stopDialog > .el-dialog__body {
  text-align: left;
  height: 450px;
}
</style>
