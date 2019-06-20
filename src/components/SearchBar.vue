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
          <el-select
            v-model="ticketLimit.startStation"
            filterable
            remote
            placeholder="请输入简拼/全拼/汉字"
            class="formInput"
            :remote-method="startStation.onInputChange"
            :loading="startStation.loading"
            clearable
          >
            <el-option
              v-for="item in startStation.stationNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <!-- 列2 -->
      <el-col :span="6" class="formCol">
        <div class="formItemLabel">
          <label>终点站台:</label>
        </div>
        <div class="formItemField">
          <el-select
            v-model="ticketLimit.endStation"
            filterable
            remote
            placeholder="请输入简拼/全拼/汉字"
            class="formInput"
            :remote-method="endStation.onInputChange"
            :loading="endStation.loading"
            clearable
          >
            <el-option
              v-for="item in endStation.stationNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import Network from '@/utils/Network';
import _ from 'lodash';
export default {
  name: 'SearchBar',
  props: ['value'],
  mounted() {
    this.startStation.onInputChange = this.createDebounceFunction(this.refreshStartStationNames);
    this.endStation.onInputChange = this.createDebounceFunction(this.refreshEndStationNames);
  },
  data() {
    return {
      ticketTypes: [
        { label: '成人', value: 'adult' },
        // { label: '学生', value: 'student' }
      ],
      startStation: {
        loading: false,
        stationNames: [],
        onInputChange: null,
      },
      endStation: {
        loading: false,
        stationNames: [],
        onInputChange: null,
      },
    };
  },
  methods: {
    indexStationNames(index) {
      return new Promise((resolve, reject) => {
        Network.indexStationNames(index, (stationNames) => {
          resolve(stationNames);
        });
      });
    },
    async refreshStartStationNames(index) {
      this.startStation.loading = true;
      const stationNames = await this.indexStationNames(index);
      this.startStation.loading = false;
      this.startStation.stationNames = stationNames.map((stationName) => {
        return {
          label: stationName,
          value: stationName
        };
      });
    },
    async refreshEndStationNames(index) {
      this.endStation.loading = true;
      const stationNames = await this.indexStationNames(index);
      this.endStation.loading = false;
      this.endStation.stationNames = stationNames.map((stationName) => {
        return {
          label: stationName,
          value: stationName
        };
      });
    },
    createDebounceFunction(func) {
      return _.debounce(func, 100);
    },
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
.formInput {
  width: 100%;
}
</style>


