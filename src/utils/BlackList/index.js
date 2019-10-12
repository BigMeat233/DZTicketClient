import Vue from 'vue';
import moment from 'moment';

const vueInfo = {
  name: 'BlackList',
  data() {
    return {
      blackList: [],
    };
  },
  watch: {
    blackList: {
      handler(newValue) {
        this.$emit('onListChange', newValue);
      },
    },
  },
  methods: {
    failure(type, trainInfo) {
      const blackList = this.getBlackList();
      const index = blackList.findIndex((v) => v.type === type && v.trainCount === trainInfo.trainCount);
      if (index === -1) {
        blackList.push({
          trainCount: trainInfo.trainCount,
          station: `${trainInfo.startN}-${trainInfo.endN}`,
          date: trainInfo.date,
          time: trainInfo.time,
          count: 1,
          updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          type,
        });
      } else {
        blackList[index].count += 1;
        blackList[index].updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      }
      this.blackList = blackList;
    },
    delete(type, trainCount) {
      const blackList = this.getBlackList();
      const index = blackList.findIndex((v) => v.type === type && v.trainCount === trainCount);
      blackList.splice(index, 1);
      this.blackList = blackList;
    },
    isInBlackList(type, trainCount, limitCount, limitDuration) {
      limitCount = limitCount || 3;
      limitDuration = limitDuration || 120;
      const blackInfo = this.blackList.find((v) => v.type === type && v.trainCount === trainCount);
      if (blackInfo) {
        const count = blackInfo.count;
        const updateTime = blackInfo.updateTime;
        if (count >= limitCount) {
          if (moment().isAfter(moment(updateTime).add(parseInt(limitDuration), 'second'))) {
            // 触发规则但超时 - 移除此数据
            this.delete(type, trainCount);
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
    getBlackList() {
      return JSON.parse(JSON.stringify(this.blackList));
    },
  },

};

const singleton = new Vue(vueInfo);
export default singleton;