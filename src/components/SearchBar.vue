<template>
  <div class="searchBar">
    <!-- 行1 -->
    <el-row class="formRow">
      <!-- 列1 -->
      <el-col :span="6" class="formCol">
        <div class="formItemLabel">
          <label>起点站台:</label>
        </div>
        <div class="formItemField">
          <el-input
            v-model="ticketLimit.startStation"
            placeholder="站台中文须符合12306"
            class="formInput"
            clearable
          ></el-input>
        </div>
      </el-col>
      <!-- 列2 -->
      <el-col :span="6" class="formCol">
        <div class="formItemLabel">
          <label>终点站台:</label>
        </div>
        <div class="formItemField">
          <el-input
            v-model="ticketLimit.endStation"
            placeholder="站台中文须符合12306"
            class="formInput"
            clearable
          ></el-input>
        </div>
      </el-col>
      <!-- 列3 -->
      <el-col :span="6" class="formCol">
        <div class="formItemLabel">
          <label>出发日期:</label>
        </div>
        <div class="formItemField">
          <el-date-picker
            v-model="ticketLimit.date"
            :editable="false"
            align="center"
            value-format="yyyy-MM-dd"
            class="formInput"
            style="width:100%"
          ></el-date-picker>
        </div>
      </el-col>
      <!-- 列4 -->
      <el-col :span="6" class="formCol">
        <div class="formItemLabel">
          <label>乘客类型:</label>
        </div>
        <div class="formItemField">
          <el-select v-model="ticketLimit.ticketType" placeholder="请选择车票类型">
            <el-option
              v-for="ticketType in ticketTypes"
              :key="ticketType.value"
              :label="ticketType.label"
              :value="ticketType.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SearchBar',
  props: ['value'],
  data() {
    return {
      ticketTypes: [
        { label: '成人', value: 'adult' },
        // { label: '学生', value: 'student' }
      ]
    };
  },
  computed: {
    ticketLimit: {
      get() { return this.value },
      set(newValue) { this.$emit('input', newValue) }
    },
  },
}
</script>
<style scoped>
</style>


