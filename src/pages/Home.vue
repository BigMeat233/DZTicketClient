<template>
  <div class="homeDiv">
    <search-bar v-model="ticketLimit"></search-bar>
    <func-bar
      @onResetBtnClick="resetBtnClick"
      @onAdvanceBtnClick="advanceBtnClick"
      @onQueryTicketBtnClick="queryTicketBtnClick"
      @onQueryQueueBtnClick="queryQueueBtnClick"
      @onCancelQueueBtnClick="cancelQueueBtnClick"
      @onPersonBtnClick="personBtnClick"
      @onQueryOrderBtnClick="queryOrderBtnClick"
    ></func-bar>
    <tickets :ticketInfos="ticketInfos" @onOrder="onOrderTicket"></tickets>
    <el-dialog
      title="选择乘客"
      width="50%"
      :visible.sync="personDialogVisible"
      :close-on-click-modal="false"
    >
      <div class="personContainerDiv">
        <el-select
          v-model="seatLocation.selectedLocations"
          :placeholder="seatLocation.placeholder"
          multiple
          :multiple-limit="seatLocation.selectorLimit"
          slot="title"
          style="width: 100%"
          v-if="seatLocation.isShow"
        >
          <el-option
            v-for="item in seatLocation.selectorItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <person
          v-for="(person,index) in persons"
          v-model="persons[index]"
          :key="index"
          @onDelete="onPersonDelete"
        ></person>
      </div>
      <div class="addPersonBtnDiv">
        <el-button type="primary" icon="el-icon-plus" @click.native="addPersonBtnClick">添加乘客</el-button>
      </div>
      <el-dialog width="50%" title="添加乘客" :visible.sync="addPersonDialogVisble" append-to-body>
        <add-person ref="addPerson" @onPersonInputFinish="personInputFinish"></add-person>
      </el-dialog>
    </el-dialog>
    <el-dialog
      title="刷票配置"
      width="45%"
      :visible.sync="ticketDialogVisible"
      custom-class="ticketDialog"
    >
      <ticket-config v-model="ticketConfig"></ticket-config>
    </el-dialog>
  </div>
</template>

<script>
import Network from '@/utils/Network';
import Core from '@/utils/Core';
import SearchBar from '@/components/SearchBar';
import FuncBar from '@/components/FuncBar';
import Person from '@/components/Person';
import AddPerson from '@/components/AddPerson';
import Tickets from '@/components/Tickets';
import Handler from '@/utils/Handler';
import TicketConfig from '@/components/TicketConfig';
import Macro from '@/utils/Macro';

export default {
  name: 'Home',
  components: {
    'search-bar': SearchBar,
    'func-bar': FuncBar,
    'person': Person,
    'add-person': AddPerson,
    'tickets': Tickets,
    'ticket-config': TicketConfig
  },
  data() {
    return {
      ticketLimit: {
        startStation: Core.local.getItem('startStation') ? Core.local.getItem('startStation') : '上海虹桥',
        endStation: Core.local.getItem('endStation') ? Core.local.getItem('endStation') : '徐州东',
        date: Core.local.getItem('date') ? Core.local.getItem('date') : '2019-01-30',
        ticketType: Core.local.getItem('ticketType') ? Core.local.getItem('ticketType') : 'adult',
      },
      ticketConfig: {
        isAutoCommit: false,
        isAutoQuery: false,
        queryInterval: '',
        isTrainLimit: false,
        trainLimit: '',
      },
      personDialogVisible: false,
      addPersonDialogVisble: false,
      ticketDialogVisible: false,
      persons: [],
      seatLocation: {
        isShow: false,
        selectedLocations: [],
        selectorItems: [],
        selectorLimit: 0,
        placeholder: '',
      },
      ticketInfos: [],
      timer: null,
      autoQueryQueueTimer: null,
    };
  },
  watch: {
    persons: {
      deep: true,
      handler(newValue, oldValue) {
        // 当每个人都只有一种座位类型时展示选座
        // 选中的人
        const selectedPersons = newValue.filter((person) => person.isSelected);
        // 1. 检查每个人的座位类型
        let isUniqueSeatType = true;
        for (let i = 0; i < selectedPersons.length; i++) {
          const selectedPerson = selectedPersons[0]
          if (selectedPerson.seatCodes.length !== 1) {
            isUniqueSeatType = false;
            break;
          }
        }
        if (!isUniqueSeatType) {
          // 此时无法选座
          this.seatLocation = {
            isShow: false,
            selectedLocations: [],
            selectorItems: [],
            selectorLimit: 0,
            placeholder: '',
          };
          return;
        }
        // 2. 每个人的座位类型唯一,将计算公共座位的类型
        let commonSeatCodes = [];
        if (selectedPersons.length !== 0) {
          // 求选中人的座位交集
          const seatCodesArr = selectedPersons.map((selectedPerson) => selectedPerson.seatCodes);
          commonSeatCodes = seatCodesArr.reduce((result, seatCodes) => seatCodes.filter((seatCode) => result.indexOf(seatCode) !== -1));
          // 过滤可选座的类型(只有商务座 一等座 二等座可以选座)
          commonSeatCodes = commonSeatCodes.filter((commonSeatCode) => Macro.seatLocations.findIndex((seatLocation) => seatLocation.seatCode === commonSeatCode) !== -1);
        }
        // 如果公共座位类型不为1个,此时不可以选座
        if (commonSeatCodes.length !== 1) {
          // 此时无法选座
          this.seatLocation = {
            isShow: false,
            selectedLocations: [],
            selectorItems: [],
            selectorLimit: 0,
            placeholder: '',
          };
        }
        // 公共座位类型为1个时可以选座
        else {
          // 此时可以选座
          const seatCode = commonSeatCodes[0];
          const seatLocation = Macro.seatLocations.find((seatLocation) => seatLocation.seatCode === seatCode);
          this.seatLocation = Object.assign({}, this.seatLocation, {
            isShow: true,
            selectorItems: seatLocation.locations,
            selectorLimit: selectedPersons.length,
            placeholder: `请选择[${seatLocation.seatName}]的位置`
          });
        }

      }
    },
  },
  async mounted() {
    this.autoQueryQueueTimer = setInterval(() => { if (this.ticketConfig.isAutoCommit) { this.queryQueue() } }, 10000);
  },
  async destroyed() {
    clearTimeout(this.timer);
    clearInterval(this.autoQueryQueueTimer);
    // let result = await this.destroy();
    // Core.local.removeItem('otnId');
  },
  methods: {
    queryTickets(startStation, endStation, date, ticketType) {
      return new Promise((resolve, reject) => {
        Network.queryTickets(startStation, endStation, date, ticketType, (ticketInfos) => {
          resolve(ticketInfos);
        });
      });
    },
    queryPersons() {
      return new Promise((resolve, reject) => {
        Network.queryPersons('1', '100', (personInfos) => {
          resolve(personInfos);
        });
      })
    },
    addPerson(name, sex, certCode, certNo, personCode) {
      return new Promise((resolve, reject) => {
        Network.addPerson(name, sex, certCode, certNo, personCode, (result) => {
          resolve(result);
        });
      });
    },
    deletePerson(name, certType, certNo) {
      return new Promise((resolve, reject) => {
        Network.deletePerson(name, certType, certNo, (result) => {
          resolve(result);
        });
      });
    },
    orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations) {
      return new Promise((resolve, reject) => {
        Network.orderTicket(trainNo, trainId, trainCount, secStr, startStation, endStation, date, location, ticketType, personInfos, seatLocations, (result) => {
          resolve(result);
        });
      });
    },
    queryQueue() {
      return new Promise((resolve, reject) => {
        Network.queryQueue((result) => {
          resolve(result);
        });
      });
    },
    cancelQueue() {
      return new Promise((resolve, reject) => {
        Network.cancelQueue((result) => {
          resolve(result);
        });
      });
    },
    queryOrder() {
      return new Promise((resolve, reject) => {
        Network.queryOrder((result) => {
          resolve(result);
        });
      });
    },
    cancelOrder(orderId) {
      return new Promise((resolve, reject) => {
        Network.cancelOrder(orderId, (result) => {
          resolve(result);
        });
      });
    },
    destroy() {
      return new Promise((resolve, reject) => {
        Network.destroy((result) => {
          resolve(result);
        });
      });
    },
    async updatePerson() {
      let oldPersonInfos = JSON.parse(JSON.stringify(this.persons));
      let newPersonInfos = await this.queryPersons();
      this.persons = newPersonInfos.map((newPersonInfo) => {
        let isExisted = false;
        for (let i = 0; i < oldPersonInfos.length; i++) {
          let oldPersonInfo = oldPersonInfos[i];
          if (newPersonInfo.certNo === oldPersonInfo.certNo) {
            isExisted = true;
            return {
              isSelected: oldPersonInfo.isSelected,
              name: newPersonInfo.name,
              certCode: newPersonInfo.certCode,
              certType: newPersonInfo.certName,
              certNo: newPersonInfo.certNo,
              typeCode: newPersonInfo.typeCode,
              typeName: newPersonInfo.typeName,
              seatCodes: oldPersonInfo.seatCodes,
              phone: newPersonInfo.phone
            };
          }
        }
        if (!isExisted) {
          return {
            isSelected: false,
            name: newPersonInfo.name,
            certCode: newPersonInfo.certCode,
            certType: newPersonInfo.certName,
            certNo: newPersonInfo.certNo,
            typeCode: newPersonInfo.typeCode,
            typeName: newPersonInfo.typeName,
            seatCodes: []
          };
        }
      });
    },
    resetBtnClick() {
      this.ticketLimit.startStation = '';
      this.ticketLimit.endStation = '';
    },
    advanceBtnClick() {
      this.ticketDialogVisible = true;
    },
    async queryTicketBtnClick() {
      // 重置之前的计时器
      if (this.timer) { clearTimeout(this.timer) }
      // 处理参数和缓存
      let startStation = this.ticketLimit.startStation;
      let endStation = this.ticketLimit.endStation;
      let date = this.ticketLimit.date;
      let ticketType = this.ticketLimit.ticketType;
      if (startStation === '') {
        Core.ui.message.warn('请填写起点站');
        return;
      }

      if (endStation === '') {
        Core.ui.message.warn('请填写终点站');
        return;
      }

      if (date === '') {
        Core.ui.message.warn('请选择日期');
        return;
      }

      Core.local.setItem('startStation', startStation);
      Core.local.setItem('endStation', endStation);
      Core.local.setItem('date', date);
      Core.local.setItem('ticketType', ticketType);

      let ticketInfos = await this.queryTickets(startStation, endStation, date, ticketType);

      // 车次过滤
      if (!this.ticketConfig.isTrainLimit) {
        this.ticketInfos = ticketInfos;
      } else {
        let trainLimitArr = this.ticketConfig.trainLimit.split(',');
        this.ticketInfos = ticketInfos.filter((ticketInfo) => {
          for (let i = 0; i < trainLimitArr.length; i++) {
            if (trainLimitArr[i] === ticketInfo.trainCount) {
              return true;
            }
          }
          return false;
        });
      }

      // 自动提交
      if (!this.ticketConfig.isAutoCommit) {
        return;
      }

      let personInfos = this.persons.filter((person) => { return person.isSelected });
      if (personInfos.length === 0) {
        Core.ui.message.warn('请先选择需要抢票的乘客');
        return;
      }

      let traninInfos = this.ticketInfos.map((ticketInfo) => { return Handler.toTrainInfo(Handler.toTicketDisplayInfo(ticketInfo)) });
      if (traninInfos.length === 0) {
        Core.ui.message.warn('未匹配到列车');
      }

      let handlerInfo = Handler.getOrderPersonInfo(traninInfos, personInfos);
      let persons = handlerInfo.persons;
      let train = handlerInfo.trainInfo;
      if (persons.length === 0) {
        Core.ui.message.error('余票不足');
      } else {
        let result = await this.orderTicket(train.trainNo, train.trainId, train.trainCount, train.secStr, train.startN, train.endN, train.date, train.location, 'adult', persons, this.seatLocation.selectedLocations.join(''));
        if (result.result) {
          Core.ui.message.success(`下单成功,当前余票:[${result.queueInfo.ticket}],队列:[${result.queueInfo.count},${result.queueInfo.countT}]`);
          setTimeout(() => { this.queryQueueBtnClick() }, 1000);
          return;
        }
      }

      // 自动刷票逻辑
      if (!this.ticketConfig.isAutoQuery) {
        return;
      }

      this.timer = setTimeout(() => { this.queryTicketBtnClick() }, parseInt(this.ticketConfig.queryInterval));
    },
    async queryQueueBtnClick() {
      let queueInfo = await this.queryQueue();
      if (queueInfo.isGetTicket === true) {
        Core.ui.message.success(`抢票成功,订单号[${queueInfo.orderId}],请及时前往12306付款`);
      } else if (queueInfo.isGetTicket === false) {
        Core.ui.message.warn(`正在排队,当前队列数[${queueInfo.count}],排队位置[${queueInfo.waitCount}],预计等待时间[${queueInfo.waitTime}]分钟`);
      } else {
        Core.ui.message.info('当前不在排队状态');
      }
    },
    async cancelQueueBtnClick() {
      let result = await this.cancelQueue();
      if (result) {
        Core.ui.message.success('取消排队成功');
      }

    },
    async queryOrderBtnClick() {
      let result = await this.queryOrder();
      console.log(result);
      let htmlStr = `
        确定<font color="red">取消</font>当前已锁定的车票吗?
        <br />
        <font color="red">（取消后将可能无法再抢到此车票）</font>
        <br />
        总价：${result.price}元
        <br />
        车次：${result.trainCount}
        <br />
        方向：${result.startStr} - ${result.endStr}
        <br />
        时间：${result.trainDate} | ${result.startTime} - ${result.endTime}
        <br />
        ------------------------
      `;
      result.tickets.forEach((ticket, index) => {
        htmlStr += `<br />${index + 1}. ${ticket.personName}： ${ticket.seatTypeName} | ${ticket.coach}车${ticket.seat} | ${ticket.price}元`;
      });
      await this.$confirm(htmlStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true
      });
      let cancelResult = await this.cancelOrder(result.orderId);
      if (cancelResult) {
        Core.ui.message.success('取消订单成功');
      }
    },
    addPersonBtnClick() {
      this.addPersonDialogVisble = true;
    },
    async personBtnClick() {
      let personInfos = await this.updatePerson();
      this.personDialogVisible = true;
    },
    async personInputFinish(personInfo) {
      let result = await this.addPerson(personInfo.name, personInfo.sex, personInfo.certCode, personInfo.certNo, personInfo.personCode);
      if (result) {
        Core.ui.message.success('添加乘客成功');
        this.addPersonDialogVisble = false;
        this.updatePerson();
        this.$refs.addPerson.reset();
      }
    },
    async onPersonDelete(personInfo) {
      let result = await this.deletePerson(personInfo.name, personInfo.certCode, personInfo.certNo);
      if (result) {
        Core.ui.message.success('删除乘客成功');
        this.updatePerson();
      }
    },
    async onOrderTicket(trainInfo) {
      // 处理人员
      let personInfos = this.persons.filter((person) => { return person.isSelected });
      if (personInfos.length === 0) {
        Core.ui.message.warn('请先选择需要抢票的乘客');
        return;
      }
      let handlerInfo = Handler.getOrderPersonInfo([trainInfo], personInfos);
      let persons = handlerInfo.persons;
      let train = handlerInfo.trainInfo;
      if (persons.length === 0) {
        Core.ui.message.error('余票不足');
        return;
      }
      let result = await this.orderTicket(train.trainNo, train.trainId, train.trainCount, train.secStr, train.startN, train.endN, train.date, train.location, 'adult', persons, this.seatLocation.selectedLocations.join(''));
      if (result.result) {
        Core.ui.message.success(`下单成功,当前余票:[${result.queueInfo.ticket}],队列:[${result.queueInfo.count},${result.queueInfo.countT}]`);
        setTimeout(() => { this.queryQueueBtnClick() }, 1000);
      }
    }
  }
};
</script>

<style scoped>
.homeDiv {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.queryDiv {
  padding-top: 10px;
  padding-bottom: 10px;
}

.personContainerDiv {
  height: 350px;
  overflow-y: auto;
}

.addPersonBtnDiv {
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
