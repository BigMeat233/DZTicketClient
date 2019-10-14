<template>
  <div class="priceInfoDiv">
    <el-table :data="tableInfo" :border="true" height="100%">
      <el-table-column
        v-for="(columnKey,index) in columnKeys"
        :key="index"
        :label="columnKey.label"
        :prop="columnKey.key"
        header-align="center"
        align="center"
      />
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'PriceInfo',
  props: ['priceInfo'],
  computed: {
    columnKeys() {
      return Object.entries(this.priceInfo)
        .sort((v1, v2) => {
          const seatTypeName1 = v1[0];
          const price1 = v1[1].match(/[0-9\.]+/)[0];
          const seatTypeName2 = v1[0];
          const price2 = v2[1].match(/[0-9\.]+/)[0];
          if (seatTypeName1 === '无座') {
            return 1;
          } else if (seatTypeName2 === '无座') {
            return -1;
          }
          return parseFloat(price1) > parseFloat(price2) ? -1 : 1;
        })
        .map(([key, value]) => ({ label: key, key }));
    },
    tableInfo() {
      return [this.priceInfo];
    }
  },
}
</script>
<style>
.priceInfoDiv {
  height: 100%;
}

.priceDialog > .el-dialog__body {
  text-align: left;
  height: 97px;
}
</style>