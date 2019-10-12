<template>
  <div class="blackListDiv">
    <el-table :data="blackList" :border="true" :stripe="true" style="height: 100%" height="0">
      <el-table-column label="类型" prop="type" header-align="center" align="center" />
      <el-table-column label="车次" prop="trainCount" header-align="center" align="center" />
      <el-table-column label="站台" prop="station" header-align="center" align="center" />
      <el-table-column label="日期" prop="date" header-align="center" align="center" />
      <el-table-column label="时间" prop="time" header-align="center" align="center" />
      <el-table-column label="失败次数" prop="count" header-align="center" align="center" />
      <el-table-column label="拉黑时间" prop="updateTime" header-align="center" align="center" />
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            @click.native="onRemoveOutFromBlackList(scope.row)"
          >移出黑屋</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import BlackListCore from '@/utils/BlackList';
export default {
  name: 'BlackList',
  props: [],
  mounted() {
    BlackListCore.$on('onListChange', (blackList) => {
      this.blackList = blackList;
    });
  },
  data() {
    return {
      blackList: BlackListCore.blackList,
    };
  },
  methods: {
    onRemoveOutFromBlackList(blackInfo) {
      BlackListCore.delete(blackInfo.type, blackInfo.trainCount);
    },
  },
}
</script>
<style>
.blackListDiv {
  height: 100%;
}

.blackListDialog > .el-dialog__body {
  text-align: left;
  height: 450px;
}
</style>
