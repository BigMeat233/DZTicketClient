import Vue from 'vue';
import moment from 'moment';

const vueInfo = {
  name: 'BlackList',
  data() {
    return {
      blackInfoMap: {},
    };
  },
  watch: {
    blackInfoMap: {
      handler(newValue) {
        this.$emit('onMapChange', newValue);
      },
    },
  },
  methods: {
    failure(trainInfo) {
      const mapCopy = this.getBlackInfoMap();
      const trainCount = trainInfo.trainCount;
      if (mapCopy[trainCount]) {
        mapCopy[trainCount].count += 1;
        mapCopy[trainCount].updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      } else {
        mapCopy[trainCount] = {
          trainCount: trainInfo.trainCount,
          station: `${trainInfo.startN}-${trainInfo.endN}`,
          date: trainInfo.date,
          time: trainInfo.time,
          count: 1,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
      }
      this.blackInfoMap = mapCopy;
    },
    delete(trainCount) {
      const mapCopy = this.getBlackInfoMap();
      delete mapCopy[trainCount];
      this.blackInfoMap = mapCopy;
    },
    isInBlackList(trainCount, limitCount, limitDuration) {
      limitCount = limitCount || 3;
      limitDuration = limitDuration || 120;
      const blackInfo = this.blackInfoMap[trainCount];
      if (blackInfo) {
        const count = blackInfo.count;
        const updateTime = blackInfo.updateTime;
        if (count >= limitCount) {
          if (moment().isAfter(moment(updateTime).add(parseInt(limitDuration), 'second'))) {
            // 触发规则但超时 - 移除此数据
            this.delete(trainCount);
            return false;
          } else {
            // 触发规则小黑屋但未超时
            return true;
          }
        } else {
          // 未触发规则
          return false;
        }
      } else {
        return false;
      }
    },
    getBlackInfoMap() {
      return JSON.parse(JSON.stringify(this.blackInfoMap));
    },
  },

};

const singleton = new Vue(vueInfo);
export default singleton;