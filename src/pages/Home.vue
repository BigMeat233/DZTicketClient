<template>
  <div class="homeDiv">
    <!-- 搜索框区域 -->
    <search-bar v-model="ticketLimit"></search-bar>
    <!-- 按钮区域 -->
    <func-bar
      :isAutoQuering="isAutoQuering"
      :alternateCount="alternates.length"
      :selectedPersonCount="selectedPersonCount"
      @onResetBtnClick="onResetBtnClick"
      @onPersonBtnClick="onPersonBtnClick"
      @onAdvanceBtnClick="onAdvanceBtnClick"
      @onQueryQueueBtnClick="onQueryQueueBtnClick"
      @onQueryOrderBtnClick="onQueryOrderBtnClick"
      @onQueryTicketBtnClick="onQueryTicketBtnClick"
      @onCancelQueueBtnClick="onCancelQueueBtnClick"
      @onStopQueryBtnClick="onStopQueryBtnClick"
      @onBlackListBtnClick="onBlackListBtnClick"
      @onRecordBtnClick="onRecordBtnClick"
      @onAlternateBtnClick="onAlternateBtnClick"
      @onHelpBtnClick="onHelpBtnClick"
    />
    <!-- 车票区域 -->
    <tickets
      :ticketInfos="ticketInfos"
      :trainLimit="ticketConfig.trainLimit"
      @onOrder="onOrderTicket"
      @onQueryPrice="onQueryPrice"
      @onStationClick="onStationClick"
      @onTrainCountClick="onTrainCountClick"
      @onAlternate="onAlternate"
    />
    <!-- 选择乘客弹框 -->
    <el-dialog
      title="选择乘客"
      width="85%"
      custom-class="personDialog"
      :visible.sync="personDialogVisible"
      :close-on-click-modal="false"
    >
      <div class="personContainerDiv">
        <el-select
          multiple
          slot="title"
          style="width: 80%"
          v-if="seatLocation.isShow"
          v-model="seatLocation.selectedLocations"
          :placeholder="seatLocation.placeholder"
          :multiple-limit="seatLocation.selectorLimit"
        >
          <el-option
            v-for="item in seatLocation.selectorItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <person
          v-for="(person,index) in persons"
          v-model="persons[index]"
          :key="index"
          style="width: 80%"
          @onDelete="onPersonDelete"
        />
      </div>
      <div class="addPersonBtnDiv">
        <el-button type="primary" icon="el-icon-plus" @click.native="onAddPersonBtnClick">添加乘客</el-button>
      </div>
      <el-dialog
        append-to-body
        title="添加乘客"
        width="50%"
        custom-class="addPersonDialog"
        :visible.sync="addPersonDialogVisble"
      >
        <add-person ref="addPerson" @onPersonInputFinish="onPersonInputFinish" />
      </el-dialog>
    </el-dialog>
    <!-- 刷票配置弹框 -->
    <el-dialog
      title="刷票配置"
      width="85%"
      custom-class="ticketDialog"
      :visible.sync="ticketDialogVisible"
    >
      <ticket-config v-model="ticketConfig" />
    </el-dialog>
    <!-- 停靠站信息弹框 -->
    <el-dialog
      title="停靠站信息"
      width="85%"
      custom-class="stopDialog"
      :visible.sync="stopDialogVisible"
    >
      <station-stops
        :startStation="ticketLimit.startStation"
        :endStation="ticketLimit.endStation"
        :stationStops="stationStops"
        @onStartStationSetting="onStartStationSetting"
        @onEndStationSetting="onEndStationSetting"
      />
    </el-dialog>
    <!-- 票价信息 -->
    <el-dialog
      title="票价信息"
      width="85%"
      custom-class="priceDialog"
      :visible.sync="priceDialogVisible"
    >
      <price-info :priceInfo="priceInfo" />
    </el-dialog>
    <!-- 小黑屋数据 -->
    <el-dialog
      title="小黑屋数据"
      width="65%"
      custom-class="blackListDialog"
      :visible.sync="blackDialogVisible"
    >
      <black-list />
    </el-dialog>
    <!-- 刷票日志 -->
    <el-dialog
      title="刷票日志"
      width="65%"
      custom-class="recordDialog"
      :visible.sync="recordDialogVisible"
    >
      <div class="recordContainer">
        <div class="recordItem" v-for="(record,index) in records" :key="index">{{record}}</div>
      </div>
      <div class="clearBtnDiv">
        <el-button type="primary" @click="onClearBtnClick">清除</el-button>
      </div>
    </el-dialog>
    <!-- 候补座次 -->
    <el-dialog
      title="候补座次"
      width="80%"
      custom-class="alternateDialog"
      :visible.sync="alternateDialogVisible"
    >
      <alternate
        :alternates="alternates"
        @onSubmitBtnClick="onOrderAlternates"
        @onRemoteBtnClick="onRemoveAlternate"
      />
    </el-dialog>
    <!-- 类型选择 -->
    <el-dialog
      title="操作类型"
      width="30%"
      custom-class="typeSelectorDialog"
      :visible.sync="typeSelectorDialogVisible"
    >
      <type-selector :category="category" @onHandler="onHandler" />
    </el-dialog>
    <!-- 使用说明 -->
    <el-dialog
      title="使用说明"
      width="80%"
      custom-class="introduceDialog"
      :visible.sync="introduceDialogVisible"
    >
      <introduce />
    </el-dialog>
  </div>
</template>

<script>
import AsyncFuncs from '@/utils/AsyncFuncs';
import Core from '@/utils/Core';
import SearchBar from '@/components/SearchBar';
import FuncBar from '@/components/FuncBar';
import Person from '@/components/Person';
import AddPerson from '@/components/AddPerson';
import Tickets from '@/components/Tickets';
import Handler from '@/utils/Handler';
import TicketConfig from '@/components/TicketConfig';
import StationStops from '@/components/StationStops';
import PriceInfo from '@/components/PriceInfo';
import BlackList from '@/components/BlackList';
import Alternate from '@/components/Alternate';
import AlternateTip from '@/components/AlternateTip';
import TypeSelector from '@/components/TypeSelector';
import Introduce from '@/components/Introduce';
import BlackListCore from '@/utils/BlackList';
import Macro from '@/utils/Macro';
import moment from 'moment';
import StoppableLoopFunction from '@/utils/StoppableLoopFunction';

export default {
  name: 'Home',
  components: {
    'search-bar': SearchBar,
    'func-bar': FuncBar,
    'person': Person,
    'add-person': AddPerson,
    'tickets': Tickets,
    'ticket-config': TicketConfig,
    'station-stops': StationStops,
    'black-list': BlackList,
    'price-info': PriceInfo,
    'alternate': Alternate,
    'type-selector': TypeSelector,
    'introduce': Introduce,
  },
  data() {
    return {
      // dialog显隐性
      personDialogVisible: false,
      addPersonDialogVisble: false,
      ticketDialogVisible: false,
      stopDialogVisible: false,
      blackDialogVisible: false,
      recordDialogVisible: false,
      priceDialogVisible: false,
      alternateDialogVisible: false,
      typeSelectorDialogVisible: false,
      introduceDialogVisible: false,
      // 其他显隐性
      isAutoQuering: false,
      // 搜索选项
      ticketLimit: {
        startStation: Core.local.getItem('startStation') ? Core.local.getItem('startStation') : '上海虹桥',
        endStation: Core.local.getItem('endStation') ? Core.local.getItem('endStation') : '徐州东',
        date: Core.local.getItem('date') ? Core.local.getItem('date') : moment().format('YYYY-MM-DD'),
        ticketType: Core.local.getItem('ticketType') ? Core.local.getItem('ticketType') : 'adult',
      },
      // 刷票配置
      ticketConfig: {
        isAutoCommit: false,
        isAutoQuery: false,
        queryInterval: '',
        isTrainLimit: false,
        trainLimit: '',
        blackCount: '',
        blackTime: '',
        isAutoAltenate: false,
        autoAlternateType: 'single',
      },
      // 乘客列表
      persons: [],
      priceInfo: {},
      // 选座配置
      seatLocation: {
        isShow: false,
        selectedLocations: [],
        selectorItems: [],
        selectorLimit: 0,
        placeholder: '',
      },
      // 票信息
      ticketInfos: [],
      // 停靠站信息
      stationStops: [],
      // 候补车次和座位
      alternates: [],
      // 操作类型
      category: '',
      // 刷票日志
      records: [],
      // 账号是否已候补
      isAlternated: false,
      // 防掉线timer
      autoQueryQueueInterval: null,
    };
  },
  computed: {
    selectedPersonCount() {
      return this.persons.filter((person) => person.isSelected).length;
    },
  },
  watch: {
    persons: {
      deep: true,
      handler(newValue) {
        // 需要选座时不会更换已选择的座位位置,故使用Object.assign()
        this.seatLocation = Object.assign({}, this.seatLocation, Handler.getSeatLocation(this.persons));
      }
    },
  },
  /**
   * 生命周期 - mounted
   */
  async mounted() {
    this.autoQueryQueueInterval = setInterval(() => { this.isAutoQuering && AsyncFuncs.queryQueueWithoutLoadingAndTips() }, 10000);
    this.stoppableLoopQueueStateFunction = new StoppableLoopFunction(this.loopQueueStateFunction, 1000);
    this.stoppableLoopAlternateQueueStateFunction = new StoppableLoopFunction(this.loopAlternateQueueStateFunction, 1000);
    this.stoppableLoopQueryTicketFunction = new StoppableLoopFunction(this.loopQueryTicketFunction, 1000);
    // 查询候补订单初始化候补状态(如果没有订单则会阻塞在这儿不会指定boolean赋值)
    await AsyncFuncs.queryAlternateOrderWithoutTip();
    this.isAlternated = false;
  },
  /**
   * 生命周期 - destroyed
   */
  async destroyed() {
    clearInterval(this.autoQueryQueueInterval);
    this.stoppableLoopQueryTicketFunction.pause(0);
    this.stoppableLoopQueueStateFunction.pause(0);
    this.stoppableLoopAlternateQueueStateFunction.pause(0);
  },
  methods: {
    /**
     * 设置起点站
     */
    onStartStationSetting(stationName) {
      this.ticketLimit.startStation = stationName;
    },
    /**
     * 设置终点站
     */
    onEndStationSetting(stationName) {
      this.ticketLimit.endStation = stationName;
    },
    /**
     * 重置站台按钮点击
     */
    onResetBtnClick() {
      this.ticketLimit.startStation = '';
      this.ticketLimit.endStation = '';
    },
    /**
     * 刷票配置按钮点击
     */
    onAdvanceBtnClick() {
      this.ticketDialogVisible = true;
    },
    /**
     * 小黑屋按钮点击
     */
    onBlackListBtnClick() {
      this.blackDialogVisible = true;
    },
    /**
     * 停止刷票按钮点击
     */
    onStopQueryBtnClick() {
      this.stopAutoQueryAndCancelQueue();
    },
    /**
     * 刷票日志按钮点击
     */
    onRecordBtnClick() {
      this.recordDialogVisible = true;
    },
    /**
     * 刷票日志中的清除按钮点击
     */
    onClearBtnClick() {
      this.records = [];
    },
    /**
     * 候补座次按钮点击
     */
    onAlternateBtnClick() {
      this.alternateDialogVisible = true;
    },
    /**
     * 帮助按钮点击
     */
    onHelpBtnClick() {
      this.introduceDialogVisible = true;
    },
    /**
     * 查询队列按钮点击
     */
    async onQueryQueueBtnClick() {
      this.category = 'queryQueue';
      this.typeSelectorDialogVisible = true;
    },
    /**
     * 取消排队按钮点击
     */
    async onCancelQueueBtnClick() {
      this.category = 'cancelQueue';
      this.typeSelectorDialogVisible = true;
    },
    /**
     * 查询订单按钮点击
     */
    onQueryOrderBtnClick() {
      this.category = 'queryOrder';
      this.typeSelectorDialogVisible = true;
    },
    /**
     * 选择乘客中添加乘客按钮点击
     */
    onAddPersonBtnClick() {
      this.addPersonDialogVisble = true;
    },
    /**
     * 选择乘客按钮点击
     */
    async onPersonBtnClick() {
      await this.updatePersons();
      this.personDialogVisible = true;
    },
    /**
     * 添加乘客时点了确定
     */
    async onPersonInputFinish(personInfo) {
      let result = await AsyncFuncs.addPerson(personInfo.name, personInfo.sex, personInfo.certCode, personInfo.certNo, personInfo.personCode);
      if (result) {
        this.addPersonDialogVisble = false;
        this.updatePersons();
        this.$refs.addPerson.reset();
      }
    },
    /**
     * 删除乘客
     */
    async onPersonDelete(personInfo) {
      let result = await AsyncFuncs.deletePerson(personInfo.name, personInfo.certCode, personInfo.certNo);
      if (result) {
        this.updatePersons();
      }
    },
    /**
     * 票价按钮点击
     */
    async onQueryPrice(trainInfo) {
      const { trainNo, date, startCode, endCode, seatTypeCodes } = trainInfo;
      this.priceInfo = await AsyncFuncs.queryPrice(trainNo, date, startCode, endCode, seatTypeCodes);
      this.priceDialogVisible = true;
    },
    /**
     * 点击了tips上的添加候补
     */
    async onAlternate({ secStr, seatTypeCode, startN, endN, trainCount, time }) {
      const rateInfo = await AsyncFuncs.queryAlternateRate(secStr, seatTypeCode);
      const addToAlternates = () => {
        // 判断是否符合添加条件
        const newAlternateInfo = {
          ...rateInfo,
          secStr,
          seatTypeCode,
          startN,
          endN,
          trainCount,
          time,
        };

        // 统计旧信息每天的候补数
        const dateCountMap = {};
        this.alternates.forEach((alternate) => {
          const { dateStr } = alternate;
          if (dateCountMap[dateStr]) {
            dateCountMap[dateStr] = dateCountMap[dateStr] + 1;
          } else {
            dateCountMap[dateStr] = 1;
          }
        });

        // 判断每天的候补数
        if (dateCountMap[newAlternateInfo.dateStr] && dateCountMap[newAlternateInfo.dateStr] === 2) {
          Core.ui.message.warn('每个日期仅可候补2次');
          return;
        }

        // 判断日期
        const dateStrs = Object.keys(dateCountMap);
        if (dateStrs.length === 1) {
          if (Math.abs(moment(dateStrs[0]).diff(moment(newAlternateInfo.dateStr))) > 86400000) {
            Core.ui.message.warn('只能候补2个相邻的日期');
            return;
          }
        } else if (dateStrs.length === 2) {
          if (!dateStrs.find((dateStr) => dateStr === newAlternateInfo.dateStr)) {
            Core.ui.message.warn('只能候补2个相邻的日期');
            return;
          }
        }

        // 判断车次是否已候补
        const isExist = this.alternates.find((alternate) => {
          const result = alternate.trainNo === newAlternateInfo.trainNo &&
            alternate.seatTypeCode === newAlternateInfo.seatTypeCode &&
            alternate.dateStr === newAlternateInfo.dateStr;
          return result;
        });
        if (isExist) {
          Core.ui.message.warn('该车次和座位已候补');
          return;
        }

        this.alternates = [...this.alternates, newAlternateInfo]
      };
      const tip = Core.ui.message.success(this.$createElement(
        AlternateTip,
        { props: { rateInfo, onAddBtnClick: () => { tip.close(); addToAlternates() } } }
      ));
    },
    /**
     * 候补座次中点击了删除
     */
    onRemoveAlternate(alternate) {
      const alternateIndex = this.alternates.findIndex((v) => {
        return alternate.trainNo === v.trainNo &&
          alternate.seatTypeCode === v.seatTypeCode &&
          alternate.dateStr === v.dateStr;
      });
      if (alternateIndex !== -1) {
        const newAlternate = [...this.alternates];
        newAlternate.splice(alternateIndex, 1);
        this.alternates = newAlternate;
      }
    },
    /**
     * 候补座次中提交候补订单按钮点击
     */
    async onOrderAlternates(dateTime) {
      const personInfos = this.persons.filter((person) => { return person.isSelected });
      if (personInfos.length === 0) {
        Core.ui.message.warn('请先选择需要候补的乘客');
        return;
      }

      if (personInfos.length > 3) {
        Core.ui.message.warn('最多允许对3人进行候补');
        return;
      }

      const alternateResult = await this.orderAlternatesAndLoopQueueState(true, dateTime, this.alternates, personInfos);
      if (alternateResult.result) {
        this.stopAutoQueryAndCancelQueue();
        Core.ui.box.alert('候补成功', `🎆🎆🎆候补成功,请于30分钟内前往12306进行支付！！！(候补成功时间:${Core.common.time.format(new Date(), 'yyyy-MM-dd HH:mm:ss')})`, () => {
          window.open('https://www.12306.cn');
        });
      } else {
        this.stopAutoQueryAndCancelQueue();
        Core.ui.box.alert('候补失败', '候补失败,请重新尝试！！', () => { });
      }
    },
    /**
     * 车票表格中的下单按钮点击
     */
    async onOrderTicket(trainInfo) {
      // 处理人员
      let personInfos = this.persons.filter((person) => { return person.isSelected });
      if (personInfos.length === 0) {
        Core.ui.message.warn('请先选择需要抢票的乘客');
        return;
      }
      const ticketResult = await this.orderTicketAndLoopQueueState(true, [trainInfo], personInfos);
      if (ticketResult.result) {
        this.stopAutoQueryAndCancelQueue();
        Core.ui.box.alert('抢票成功', `🎆🎆🎆抢票成功,请于30分钟内前往12306进行支付！！！(出票时间:${Core.common.time.format(new Date(), 'yyyy-MM-dd HH:mm:ss')})`, () => {
          window.open('https://www.12306.cn');
        });
      } else {
        this.stopAutoQueryAndCancelQueue();
        Core.ui.box.alert('抢票失败', '出票失败,请重新尝试！！', () => { });
      }
    },
    /**
     * 车票信息中的停靠站被点击
     */
    async onStationClick(trainInfo) {
      const trainNo = trainInfo.trainNo;
      const startStation = trainInfo.startN;
      const endStation = trainInfo.endN;
      const date = trainInfo.date;
      const stationStops = await AsyncFuncs.queryStationStops(trainNo, startStation, endStation, date);
      this.stopDialogVisible = true;
      this.stationStops = stationStops;
    },
    /**
     * 车票信息中的车次被点击
     */
    onTrainCountClick(trainInfo) {
      const trainLimit = this.ticketConfig.trainLimit;
      const trainLimitList = trainLimit.split(' ');
      const trainCount = trainInfo.trainCount;
      const index = trainLimitList.findIndex((v) => v === trainCount);
      if (index !== -1) {
        trainLimitList.splice(index, 1);
      } else {
        trainLimitList.push(trainCount);
      }
      this.ticketConfig.trainLimit = trainLimitList.join(' ').replace(/^ +/, '');
      Core.ui.message.success('设置期望车次成功!');
    },
    /**
     * 刷票按钮被点击
     */
    async onQueryTicketBtnClick() {
      // 处理参数和缓存
      const startStation = this.ticketLimit.startStation;
      const endStation = this.ticketLimit.endStation;
      const date = this.ticketLimit.date;
      const ticketType = this.ticketLimit.ticketType;
      let isAutoQuery = this.ticketConfig.isAutoQuery; // 此值可能在后续逻辑中被改变
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

      this.stoppableLoopQueryTicketFunction.loopInterval = this.ticketConfig.queryInterval;
      this.stoppableLoopQueryTicketFunction.start(() => { });
    },
    /**
     * 操作时选择了操作的订单类型
     * @param {string} handlerInfo.category 操作类别,有queryOder, queryQueue, cancelQueue
     * @param {string} handlerInfo.handlerType 操作类型,有alternate, normal
     */
    async onHandler({ category, handlerType }) {
      this.typeSelectorDialogVisible = false;
      if (category === 'queryOrder') {
        handlerType === 'alternate' ?
          this.queryAlternateOrder()
          :
          this.queryOrder();
      } else if (category === 'queryQueue') {
        handlerType === 'alternate' ?
          this.queryAlternateQueue()
          :
          this.queryQueue();
      } else if (category === 'cancelQueue') {
        if (handlerType === 'alternate') {
          const result = await AsyncFuncs.cancelAlternateQueue();
          result && (this.isAlternated = false);
        } else {
          AsyncFuncs.cancelQueue();
        }
      }
    },
    /**
     * 创建日志
     * @param {string} content 日志的内容
     */
    createLogContent(content) {
      const log = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] - ${content}`;
      this.records.splice(0, 0, log);
      this.records = this.records.slice(0, 500);
    },
    /**
     * 更新乘客列表
     */
    async updatePersons() {
      let oldPersonInfos = JSON.parse(JSON.stringify(this.persons));
      let newPersonInfos = await AsyncFuncs.queryPersons();
      this.persons = Handler.updatePersons(oldPersonInfos, newPersonInfos);
    },
    /**
     * 停止自动查询
     * @desc 将会关闭自动自动查询的配置，并关闭所有的stopptable方法
     */
    stopAutoQuery() {
      this.ticketConfig.isAutoCommit = false;
      this.ticketConfig.isAutoQuery = false;
      this.isAutoQuering = false;
      this.stoppableLoopQueryTicketFunction.pause(0);
      this.stoppableLoopQueueStateFunction.pause(0);
      this.stoppableLoopAlternateQueueStateFunction.pause(0);
    },
    /**
     * 停止自动查询并执行一次取消队列
     */
    stopAutoQueryAndCancelQueue() {
      this.stopAutoQuery();
      AsyncFuncs.cancelQueueWithoutTip();
      AsyncFuncs.cancelAlternateQueueWithoutTip();
    },
    /**
     * 轮询刷票队列状态
     * @desc 将被stopptable包装,无法直接调用
     */
    async loopQueueStateFunction(isLoading, trainInfo, onLockTicketSuccess, onLockTicketFailure, pauseCB) {
      // 开始轮询队列状态
      isNeedLogger && this.createLogContent(`开始轮询队列状态...`);
      // 大多数情况下isAutoQuery=!isLoading,其实两者并无必然的联系
      // 为了防止同时手动和静默刷票的情况要根据实际的变量去做业务逻辑
      // isAutoQuery: 是否处于刷票状态
      // isLoading: 是否显示菊花
      // isNeedLogger: 为!isLoading,是否记录日志
      const isAutoQuery = this.ticketConfig.isAutoQuery;
      const isNeedLogger = !isLoading;
      const result = isLoading ?
        await AsyncFuncs.queryQueue()
        :
        await AsyncFuncs.queryQueueWithoutLoadingAndTips();
      // 执行带菊花的查询队列时,result === false的情况将会自动tip,result === true的情况将在回调中设置展示
      if (result.result === false && result.errCode === '0') {
        // 网络错误 - 重新刷接口
        isNeedLogger && this.createLogContent(`网络错误,重刷队列状态...`);
      } else if (result.result === false && result.errCode === '1') {
        // 查询排队错误 - 报刷票失败
        isNeedLogger && this.createLogContent(`出票失败,原因:[${result.err}]`);
        onLockTicketFailure(trainInfo, result.err);
        pauseCB(0);
      } else {
        // 查询排队成功 - 判断队列信息决定是出票还是失败
        const queueInfo = result.queueInfo;
        if (queueInfo.isGetTicket === true) {
          // 出票成功
          const orderId = queueInfo.orderId;
          isNeedLogger && this.createLogContent(`出票成功,订单号:[${orderId}]`);
          onLockTicketSuccess(orderId);
          pauseCB(0);
        } else if (queueInfo.isGetTicket === false) {
          // 正在排队 - 重新轮询
          isLoading ? Core.ui.message.warn(`正在排队,当前队列数[${queueInfo.count}],排队位置[${queueInfo.waitCount}],预计等待时间[${queueInfo.waitTime}]分钟`) : this.createLogContent(`正在排队,当前队列数[${queueInfo.count}],排队位置[${queueInfo.waitCount}],预计等待时间[${queueInfo.waitTime}]分钟`);
          if (!this.isAutoQuering) {
            pauseCB(0);
          }
        } else {
          // 不在排队状态 - 认为失败
          isNeedLogger && this.createLogContent(`出票失败,原因:[当前未在排队状态]`);
          onLockTicketFailure(trainInfo, '当前未在排队状态');
          pauseCB(0);
        }
      }
    },
    /**
     * 执行轮询刷票队列状态
     * @desc 此方法可被直接调用
     */
    loopQueueState(isLoading, trainInfo, onLockTicketSuccess, onLockTicketFailure) {
      this.stoppableLoopQueueStateFunction.start(isLoading, trainInfo, onLockTicketSuccess, onLockTicketFailure, () => { });
    },
    /**
     * 轮询候补队列状态
     * @desc 将被stopptable包装,无法直接调用
     */
    async loopAlternateQueueStateFunction(isLoading, onAlternateSuccess, onAlternateFailure, pauseCB) {
      const isNeedLogger = !isLoading;
      isNeedLogger && this.createLogContent('开始轮询候补队列状态...');

      const result = isLoading ?
        await AsyncFuncs.queryAlternateQueue()
        :
        await AsyncFuncs.queryAlternateQueueWithoutLoadingAndTips();
      if (result.result === false && result.errCode === '0') {
        // 网络错误 - 重新刷接口
        isNeedLogger && this.createLogContent('网络错误,重刷候补队列状态...');
      } else if (result.result === false && result.errCode === '1') {
        // 查询排队错误 - 报候补失败
        isNeedLogger && this.createLogContent(`候补失败,原因:[${result.err}]`);
        onAlternateFailure(result.err);
        pauseCB(0);
      } else {
        // 查询候补队列成功 - 判断队列信息决定是候补成功还是失败
        const queueInfo = result.queueInfo;
        if (queueInfo.isGetAlternate === true) {
          // 候补成功
          isNeedLogger && this.createLogContent('候补成功!!!');
          onAlternateSuccess();
          pauseCB(0);
        } else if (queueInfo.isGetAlternate === false) {
          // 正在排队 - 重新轮询
          isNeedLogger && this.createLogContent(`正在排队候补,排队位置[${queueInfo.waitCount}],预计等待时间[${queueInfo.waitTime}]分钟`);
        } else {
          // 不在排队状态 - 认为失败
          isNeedLogger && this.createLogContent('候补失败,原因:[当前未在排队候补状态]');
          onAlternateFailure('当前未在排队候补状态');
          pauseCB(0);
        }
      }
    },
    /**
     * 执行轮询刷票队列状态
     * @desc 可被直接调用
     */
    loopAlternateQueueState(isLoading, onAlternateSuccess, onAlternateFailure) {
      this.stoppableLoopAlternateQueueStateFunction.start(isLoading, onAlternateSuccess, onAlternateFailure, () => { });
    },
    /**
     * 下候补订单并开始轮询队列状态
     */
    async orderAlternatesAndLoopQueueState(isLoading, dateTime, alternates, personInfos) {
      return new Promise(async (resolve) => {
        const isNeedLogger = !isLoading;
        const result = isLoading ?
          await AsyncFuncs.orderAlternates(dateTime, alternates, personInfos)
          :
          await AsyncFuncs.orderAlternatesWithoutLoadingAndTips(dateTime, alternates, personInfos);
        if (result.result) {
          isNeedLogger && this.createLogContent('创建候补订单成功,开始轮询候补订单状态...');
          // 显示停止按钮用于终止轮询候补
          this.isAutoQuering = true;
          // 开启候补队列轮询
          this.loopAlternateQueueState(isLoading, () => {
            // 候补成功
            this.alternates = [];
            this.alternateDialogVisible = false;
            this.isAlternated = true;
            isLoading && Core.ui.message.success('候补成功,请及时前往12306付款');
            resolve({ result: true });
          }, (err) => {
            // 候补失败
            isLoading && Core.ui.message.warn(err);
            resolve({ result: false });
          });
        } else {
          isLoading ? Core.ui.message.warn(result.err) : this.createLogContent(`提交候补单失败,原因:[${result.err}]`);
          resolve({ result: false });
        }
      });
    },
    /**
    * 下刷票订单并开始轮询队列状态
    */
    async orderTicketAndLoopQueueState(isLoading, trainInfos, personInfos) {
      return new Promise(async (resolve) => {
        const handlerInfo = Handler.getOrderPersonInfo(trainInfos, personInfos);
        const persons = handlerInfo.persons;
        const train = handlerInfo.trainInfo;
        const isNeedLogger = !isLoading;

        if (persons.length === 0) {
          isLoading ? Core.ui.message.error('余票不足') : this.createLogContent('TC结果:[余票不足]');
          resolve({ result: false });
        } else {
          isNeedLogger && this.createLogContent(`TC通过,乘客/座位:[${persons.map((person) => `${person.name}-${person.seatCode}`).join(',')}],车次:[${train ? train.trainCount : ''}],进行下单...`);
          // 发起请求
          const result = isLoading ?
            await AsyncFuncs.orderTicket(train.trainNo, train.trainId, train.trainCount, train.secStr, train.startN, train.endN, train.date, train.location, 'adult', persons, this.seatLocation.selectedLocations.join(''))
            :
            await AsyncFuncs.orderTicketWithoutLoadingAndTips(train.trainNo, train.trainId, train.trainCount, train.secStr, train.startN, train.endN, train.date, train.location, 'adult', persons, this.seatLocation.selectedLocations.join(''));
          // 请求成功 - 解析结果
          if (result.result) {
            // 下单成功
            isLoading ? Core.ui.message.success(`下单成功,当前余票:[${result.queueInfo.ticket}],队列:[${result.queueInfo.count},${result.queueInfo.countT}]`) : this.createLogContent(`下单成功,当前余票:[${result.queueInfo.ticket}],队列:[${result.queueInfo.count},${result.queueInfo.countT}]`);
            // 显示停止刷票按钮用于终止轮询队列
            this.isAutoQuering = true;
            // 开启出票轮询
            this.loopQueueState(isLoading, train, (orderId) => {
              // 成功出票
              isLoading && Core.ui.message.success(`抢票成功,订单号[${orderId}],请及时前往12306付款`);
              resolve({ result: true })
            }, (trainInfo, err) => {
              // 出票失败
              (isLoading && err) && Core.ui.message.info(err);
              resolve({ result: false, trainInfo: train });
            });
          } else {
            // 下单失败
            isLoading ? Core.ui.message.warn(result.err) : this.createLogContent(`下单失败,原因:[${result.err}]`);
            resolve({ result: false, trainInfo: train });
          }
        }
      });
    },
    /**
     * 自动刷票轮询方法
     * @desc 将被stopptable包装,无法直接调用
     */
    async loopQueryTicketFunction(pauseCB) {
      // 处理参数和缓存
      const startStation = this.ticketLimit.startStation;
      const endStation = this.ticketLimit.endStation;
      const date = this.ticketLimit.date;
      const ticketType = this.ticketLimit.ticketType;
      let isAutoQuery = this.ticketConfig.isAutoQuery; // 此值可能在后续逻辑中被改变

      // 如果打开了自动刷票 - 显示停止刷票按钮
      if (isAutoQuery) {
        this.isAutoQuering = true;
        // 如果当前时间不在6:00 - 23:00之间则直接退出
        const currentHour = moment().hour();
        if (currentHour < 6 || currentHour > 23) {
          this.createLogContent(`当前时间不可刷票,将于06:00-24:00恢复`);
          return;
        }
        this.createLogContent(`请求日期:[${date}],起点:[${startStation}],终点:[${endStation}]的车票...`);
      }

      // 根据是否打开自动刷票决定请求带不带菊花的接口
      let ticketInfos = isAutoQuery ?
        await AsyncFuncs.queryTicketsWithoutLoading(startStation, endStation, date, ticketType)
        :
        await AsyncFuncs.queryTickets(startStation, endStation, date, ticketType);

      // 车次过滤
      // 若车次过滤开启,则列表中仅显示白名单中的数据
      isAutoQuery && this.createLogContent(`车票请求成功,使用白名单:[${this.ticketConfig.trainLimit}]进行车次过滤...`);
      if (!this.ticketConfig.isTrainLimit) {
        this.ticketInfos = ticketInfos;
      } else {
        let trainLimitArr = this.ticketConfig.trainLimit.split(' ');
        this.ticketInfos = ticketInfos.filter((ticketInfo) => {
          for (let i = 0; i < trainLimitArr.length; i++) {
            if (trainLimitArr[i] === ticketInfo.trainCount) {
              return true;
            }
          }
          return false;
        });
      }
      isAutoQuery && this.createLogContent(`车票白名单过滤结果为:[${this.ticketInfos.map((ticketInfo) => ticketInfo.trainCount).join(',')}]`);
      // 自动提交
      // 若自动提交关闭,则自动刷票一定是关闭状态
      if (!this.ticketConfig.isAutoCommit) {
        if (isAutoQuery) {
          this.createLogContent(`自动提交为关闭状态,中断静默刷票`);
          this.stopAutoQueryAndCancelQueue();
        } else {
          this.stopAutoQuery();
        }
        return;
      }

      // 提取选中的乘客
      let personInfos = this.persons.filter((person) => { return person.isSelected });
      if (personInfos.length === 0) {
        Core.ui.message.warn('请先选择需要抢票的乘客');
        if (isAutoQuery) {
          this.createLogContent(`未选择要刷票的乘客,中断静默刷票`);
          this.stopAutoQueryAndCancelQueue();
        } else {
          this.stopAutoQuery();
        }
        return;
      }

      // 提取列表中的数据(白名单)
      const trainInfos = this.ticketInfos.map((ticketInfo) => { return Handler.toTrainInfo(Handler.toTicketDisplayInfo(ticketInfo)) });
      if (trainInfos.length === 0) {
        isAutoQuery ? this.createLogContent(`白名单过滤后没有列车(可能请求车票结果为空),继续后续逻辑...`) : Core.ui.message.warn('未匹配到列车');
      }

      isAutoQuery && this.createLogContent(`将白名单后的结果进行小黑屋过滤...`);
      // 列表中的数据(白名单)将剔除小黑屋数据
      const blackListCountLimit = this.ticketConfig.blackCount;
      const blackListTimeLimit = this.ticketConfig.blackTime;
      const normalTrainInfos = trainInfos.filter((ticketInfo) => {
        return !BlackListCore.isInBlackList('normal', ticketInfo.trainCount, blackListCountLimit, blackListTimeLimit);
      });

      // 对可以下单的车列表进行判断
      if (normalTrainInfos.length === 0) {
        // 此时没有车可供选择
        isAutoQuery ? this.createLogContent(`小黑屋过滤后没有列车,等待小黑屋解锁,继续刷票...`) : Core.ui.message.warn('未匹配到列车');
      } else {
        // 此时列表中有车 - 下单并轮询出票结果
        isAutoQuery && this.createLogContent(`将小黑屋过滤后的列车[${normalTrainInfos.map((trainInfo) => trainInfo.trainCount).join(',')}]进行TC计算`);
        const ticketResult = await this.orderTicketAndLoopQueueState(!isAutoQuery, normalTrainInfos, personInfos);
        if (ticketResult.result) {
          // 出票成功 - 停止自动刷票并弹框
          isAutoQuery && this.createLogContent(`出票成功!!!`);
          // 关闭自动查询将会改变data中this.ticketConfig.isAutoQuery的值
          this.stopAutoQueryAndCancelQueue();
          Core.ui.box.alert('抢票成功', '抢票成功,请于30分钟内前往12306进行支付！！！', () => {
            window.open('https://www.12306.cn');
          });
        } else {
          isAutoQuery && this.createLogContent(`出票失败!!!`);
          if (ticketResult.trainInfo) {
            BlackListCore.failure('normal', ticketResult.trainInfo);
          }
          // 当出票失败时,执行刷候补票逻辑
          // 触发条件为:自动刷票状态 && 打开了刷候补票 && 账号下无候补订单 && 出票失败情况下
          this.createLogContent(`自动候补状态:[${this.ticketConfig.isAutoAltenate}],账号已候补状态:[${this.isAlternated}]`);
          if (isAutoQuery && this.ticketConfig.isAutoAltenate && !this.isAlternated) {
            this.createLogContent('进行刷候补处理流程...');
            // 1. 先执行小黑屋(alternated)过滤
            const alternateTrainInfos = trainInfos.filter((ticketInfo) => {
              return !BlackListCore.isInBlackList('alternate', ticketInfo.trainCount, blackListCountLimit, blackListTimeLimit);
            });
            // 1.1 小黑屋后无可候补的车次
            if (alternateTrainInfos.length === 0) {
              this.createLogContent('小黑屋过滤后没有可候补的列车,等待小黑屋解锁,继续刷票...');
            } else {
              // 1.2 小黑屋过滤后还有可以候补的车次
              // 1.2.1 修正候补的乘客
              let alternatePersonInfos = [];
              if (personInfos.length > 3) {
                this.createLogContent('已选择乘客数量大于3,将选择前三个乘客进行AC计算');
                alternatePersonInfos = personInfos.slice(0, 3);
              } else {
                this.createLogContent('将使用全部乘客进行AC计算');
                alternatePersonInfos = personInfos;
              }
              // 1.2.2 进行AC计算
              this.createLogContent(`将小黑屋过滤后的列车[${alternateTrainInfos.map((trainInfo) => trainInfo.trainCount).join(',')}]进行AC计算`);
              const alternates = Handler.getAlternates(this.ticketConfig.autoAlternateType, alternateTrainInfos, alternatePersonInfos);
              // AC结果无可候补的车次
              if (alternates.length === 0) {
                this.createLogContent('AC结果:不可候补');
              } else {
                this.createLogContent(`AC通过,可候补的车次/座次为:[${alternates.map((alternate) => `${alternate.trainCount}/${alternate.seatTypeCode}`).join(',')}],计算最迟兑现时间...`);
                const lastAlternate = [...alternates].sort((v1, v2) => v1.dateStr > v2.dateStr ? 1 : -1).pop();
                const dateTime = moment(lastAlternate.dateStr).subtract(1, 'day').format('YYYY-MM-DD 19:00:00');
                this.createLogContent(`候补兑现时间为:[${dateTime}],进行下单`);
                const alternateResult = await this.orderAlternatesAndLoopQueueState(false, dateTime, alternates, alternatePersonInfos);
                if (alternateResult.result) {
                  Core.ui.box.alert('候补成功', '候补成功,请于30分钟内前往12306进行支付！！！', () => {
                    window.open('https://www.12306.cn');
                  });
                } else {
                  const needLockTrainInfos = alternates.map((alternate) => alternate.trainInfo);
                  needLockTrainInfos.forEach((trainInfo) => BlackListCore.failure('alternate', trainInfo));
                }
              }
            }
          }
        }
      }

      // 自动刷票  isAutoQuery可能是旧值,故重新获取
      // 若自动刷票关闭,则执行内部退出
      isAutoQuery = this.ticketConfig.isAutoQuery;
      if (!isAutoQuery) {
        pauseCB(0);
      }
    },
    /**
     * 查询抢票队列
     */
    async queryQueue() {
      let result = await AsyncFuncs.queryQueue();
      if (result.result && result.queueInfo.isGetTicket === true) {
        Core.ui.message.success(`抢票成功,订单号[${result.queueInfo.orderId}],请及时前往12306付款`);
      } else if (result.result && result.queueInfo.isGetTicket === false) {
        Core.ui.message.warn(`正在排队,当前队列数[${result.queueInfo.count}],排队位置[${result.queueInfo.waitCount}],预计等待时间[${result.queueInfo.waitTime}]分钟`);
      } else if (result.result && result.queueInfo.isGetTicket === null) {
        Core.ui.message.info('当前不在排队状态');
      }
    },
    /**
     * 查询候补队列
     */
    async queryAlternateQueue() {
      let result = await AsyncFuncs.queryAlternateQueue();
      if (result.result && result.queueInfo.isGetAlternate === true) {
        Core.ui.message.success('候补成功,请及时前往12306付款');
      } else if (result.result && result.queueInfo.isGetAlternate === false) {
        Core.ui.message.warn(`正在排队,排队位置[${result.queueInfo.waitCount}],预计等待时间[${result.queueInfo.waitTime}]分钟`);
      } else if (result.result && result.queueInfo.isGetAlternate === null) {
        Core.ui.message.info('当前不在排队状态');
      }
    },
    /**
     * 查询订单
     */
    async queryOrder() {
      let result = await AsyncFuncs.queryOrder();
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
        ----------------------------------
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
      await AsyncFuncs.cancelOrder(result.orderId);
    },
    /**
     * 查询候补订单
     */
    async queryAlternateOrder() {
      // 每次查询候补订单时重置候补状态
      this.isAlternated = false;
      const result = await AsyncFuncs.queryAlternateOrder();
      this.isAlternated = true;
      let htmlStr = `
        确定<font color="red">取消</font>当前已锁定的候补订单吗?
        <br />
        <font color="red">（取消后将可能无法再抢到此座次的候补）</font>
        <br />
        ----------------------------------
      `;
      htmlStr += `<br />订单金额:${result.price}元`;
      htmlStr += '<br />----------------------------------';
      result.trains.forEach((train, index) => {
        htmlStr += `<br />${index + 1}. ${train.trainCount} | ${train.trainDate} | ${train.startTime} - ${train.endTime} <br /> ${train.startStr} - ${train.endStr} | ${train.seatTypeName} | 位次:[${train.waitCount}] `;
      });
      htmlStr += '<br />----------------------------------<br />';
      result.persons.forEach((person, index) => {
        htmlStr += `${index + 1}. ${person.personName} `;
      });
      await this.$confirm(htmlStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        center: true
      });
      // 取消成功时刷新账号候补状态
      const cancelResult = await AsyncFuncs.cancelAlternateOrder(result.orderId);
      cancelResult && (this.isAlternated = false);
    },
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
  height: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.addPersonBtnDiv {
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.recordContainer {
  height: 90%;
  overflow-y: auto;
}
.recordItem {
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.clearBtnDiv {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
