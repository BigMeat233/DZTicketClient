<template>
  <div class="loginDiv">
    <div class="extendDiv">
      <label class="linkBtn" @click="faqBtnClick">缩在墙角的FAQ</label>
    </div>
    <div class="tipDiv">登陆</div>
    <div class="inputDiv">
      <el-input
        v-model="userId"
        placeholder="请输入12306账号"
        clearable
      ></el-input>
    </div>
    <div class="inputDiv">
      <el-input
        v-model="userPwd"
        placeholder="请输入12306密码"
        type="password"
        clearable
      ></el-input>
    </div>
    <div class="submitBtnDiv">
      <el-button
        type="primary"
        size="medium"
        @click.native="submitBtnClick($event)"
      >
        登录
      </el-button>
    </div>
    <div class="versionDiv">
      <label>DZTicket V1.3.1</label>
      <label>QQ:303569528</label>
      <label>Wechat:Dashuaige_Douzi</label>
      <label>请大家谨慎使用 遵纪守法</label>
      <label>2019版本用了最新科技重构了代码</label>
      <label style="color: orange"
        >破解了12306设备码 每次登陆都模拟一个新设备</label
      >
      <label>特别鸣谢大鲜肉🍓同学亲自写了每一行代码</label>
      <label>没错就是本鲜肉😂</label>
    </div>
    <el-dialog
      title="登录认证"
      width="550px"
      custom-class="aiCheckDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="aiCheckDialogClose"
      :visible.sync="aiCheckDialogVisible"
    >
      <el-tabs tab-position="left">
        <el-tab-pane label="滑动认证" v-if="isAiCheckSupported">
          <div id="aliDiv" v-if="aiCheckCode"></div>
          <div v-else>AI认证暂不可用</div>
        </el-tab-pane>
        <el-tab-pane label="短信认证" v-if="isMsgCheckSupported">
          <div class="msgCheckContent">
            <el-input
              placeholder="请输入账号绑定证件的后4位"
              maxlength="4"
              v-model="certNo"
            >
              <el-button type="parimary" slot="append" @click.native="sendMsg">
                发送短信
              </el-button>
            </el-input>
            <el-input
              class="msgCheckElement"
              placeholder="请输入短信验证码"
              v-model="randCode"
              maxlength="6"
            >
            </el-input>
            <el-button
              type="primary"
              class="msgCheckElement"
              @click="commonLogin(randCode, null)"
              >登陆</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="FAQ" :visible.sync="faqDialogVisble" :show-close="true">
      <div class="logDiv">
        <p>Q1:频繁刷票失败怎么办?</p>
        <p>
          A1:首先需要确定查票的日期没有放票,如果已放票则尝试返回登录页面重新登录
        </p>
        <br />
        <p>Q2:出现订单预处理失败?</p>
        <p>A2:尝试再次下单,若一直出现说明已掉线,返回登录页面重新登录</p>
        <br />
        <p>Q3:下单时提示请先选择需要抢票的乘客?</p>
        <p>
          A3:需要点击[添加乘客],在里面选座后点击该乘客,出现屎黄色框框才表示该乘客被选中
        </p>
        <br />
        <p>Q4:刷票时提示起点站或终点站不存在?</p>
        <p>A4:需要务必保证起点站和终点站在12306系统中存在</p>
        <br />
        <p>Q5:静默刷票卡住?</p>
        <p>
          A5:打开[刷票日志],若日志长时间不变化说明未在刷票,尝试刷新页面后再次进行刷票
        </p>
        <br />
        <p>Q6:出票成功后怎么支付?</p>
        <p>A6:需要手机或者PC登录12306进入我的订单进行支付</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AsyncFuncs from '@/utils/AsyncFuncs';
import Core from '@/utils/Core';
export default {
  name: 'Login',
  data() {
    return {
      // 用户输入
      userId: '',
      userPwd: '',
      // 登录认证
      certNo: '',
      randCode: '',
      aiCheckCode: null,
      // 登录配置
      isNeedLocalLogin: false,
      isAiCheckSupported: false,
      isMsgCheckSupported: false,
      // 弹框显示情况
      faqDialogVisble: false,
      aiCheckDialogVisible: false
    };
  },
  methods: {
    // 发送验证码
    async sendMsg() {
      const userId = this.userId;
      const certNo = this.certNo;
      if (!userId) {
        Core.ui.message.warn('请输入12306账号');
        return;
      }

      if (!certNo) {
        Core.ui.message.warn('请输入身份证号后4位');
        return;
      }

      const result = await AsyncFuncs.getMsgCheckCode(userId, certNo);
      if (result) {
        Core.ui.message.success('短信发送成功');
      }
    },
    // 核心登录
    async commonLogin(randCode, aiCheckResult) {
      const method = this.isNeedLocalLogin ? AsyncFuncs.localLogin : AsyncFuncs.login;
      const result = await method(this.userId, this.userPwd, randCode, aiCheckResult);
      if (result) {
        this.userId = '';
        this.userPwd = '';
        Core.navigator.push('/Home');
      } else {
        this.submitBtnClick();
      }
    },
    // FAQ按钮点击
    faqBtnClick() {
      this.faqDialogVisble = true;
    },
    // 验证弹框被关闭
    aiCheckDialogClose(done) {
      Core.ui.message.warn('用户取消登陆');
      done();
    },
    // 点击登录
    async submitBtnClick() {
      if (this.userId === '') {
        Core.ui.message.warn('请输入12306账号');
        return;
      }
      if (this.userPwd === '') {
        Core.ui.message.warn('请输入12306密码');
        return;
      }

      // 本地登陆
      if (this.isNeedLocalLogin) {
        // 不支持AI认证时直接发起登陆
        if (!this.isAiCheckSupported) {
          this.commonLogin(null, null);
          return;
        }

        // 支持AI认证时先打开认证弹框,防止因为读取AI认证数据失败导致无法验证
        this.aiCheckDialogVisible = true;
        // 拉取AI认证数据
        const { result: aiCheckCodeResult, aiCheckCode } = await AsyncFuncs.getLocalLoginAiCheckCode(this.userId);
        // 本地登录下不需要判断needAiCheck,这个值恒为true
        if (aiCheckCodeResult) {
          this.aiCheckCode = aiCheckCode;
          this.$nextTick(() => {
            const { aiCheckToken } = aiCheckCode;
            this.renderAiCheckDom(aiCheckToken).then((aiCheckResult) => this.commonLogin(null, aiCheckResult));
          });
        }
      }
      // 统一登陆
      else {
        // 拉取统一登录的配置信息
        const { result: preLoginResult, loginConf } = await AsyncFuncs.preLogin(this.userId);
        if (!preLoginResult) { return }
        const { isAiCheckSupported, isMsgCheckSupported } = loginConf;

        // 当不支持滑动/短信认证时 - 直接发起登陆
        if (!isAiCheckSupported && !isMsgCheckSupported) {
          this.commonLogin(null, null);
          return;
        }

        // 当任意支持一种情况时,先打开认证弹框,防止因为读取AI认证数据失败导致无法验证
        this.aiCheckDialogVisible = true;
        this.isAiCheckSupported = isAiCheckSupported;
        this.isMsgCheckSupported = isMsgCheckSupported;

        // 拉取AI认证数据
        const { result: aiCheckCodeResult, aiCheckCode } = await AsyncFuncs.getLoginAiCheckCode(this.userId);
        // 当不需要AI认证时 -直接登录
        if (aiCheckCodeResult && !aiCheckCode.isNeedAiCheck) {
          this.commonLogin(null, null);
          return;
        }

        // 当需要AI认证时,更新AI认证数据
        this.aiCheckCode = aiCheckCode;
        // 渲染阿里AI认证
        this.$nextTick(() => {
          const { aiCheckToken } = aiCheckCode;
          this.renderAiCheckDom(aiCheckToken).then((aiCheckResult) => this.commonLogin(null, aiCheckResult));
        });
      }
    },
    renderAiCheckDom(aiCheckToken) {
      return new Promise((resolve) => {
        const appkey = aiCheckToken.split(':').shift();
        const config = {
          renderTo: '#aliDiv',
          appkey,
          scene: 'nc_login',
          token: aiCheckToken,
          customWidth: 300,
          trans: { key1: 'code0' },
          elementID: ['usernameID'],
          is_Opt: 0,
          language: 'zh',
          isEnabled: true,
          timeout: 3000,
          times: 5,
          apimap: {},
          callback(result) {
            const { csessionid, sig, token } = result;
            resolve({ sessionId: csessionid, sig, token });
          }
        };
        const aliAiCheck = new noCaptcha(config);
        aliAiCheck.upLang('zh', {
          _startTEXT: '请按住滑块，拖动到最右边，进行AI识别',
          _yesTEXT: '验证通过',
          _error300:
            '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
          _errorNetwork:
            '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>'
        });
      });
    },
  },
  async mounted() {
    // 拉取配置信息
    const { confInfo } = await AsyncFuncs.initPage();
    const {
      isNeedLocalLogin,
      isLocalAiCheckSupported,
      isLocalMsgCheckSupported
    } = confInfo;
    this.isNeedLocalLogin = isNeedLocalLogin;
    // 如果isNeedLocalLogin是true,登录环节将不会再改变isAiCheckSupported和isMsgCheckSupported
    // 否则将在点击登录按钮时刷新isAiCheckSupported和isMsgCheckSupported的值
    this.isAiCheckSupported = isLocalAiCheckSupported;
    this.isMsgCheckSupported = isLocalMsgCheckSupported;
    // 注册设备
    await AsyncFuncs.registerDevice();
  }
};
</script>

<style>
.aiCheckDialog > .el-dialog__body {
  height: 350px;
}

.aiCheckDialog .el-tabs.el-tabs--left {
  height: 100%;
}

.aiCheckDialog .el-tabs__content {
  height: 100%;
}

.aiCheckDialog .el-tab-pane {
  height: 100%;
}
</style>
<style scoped>
.loginDiv {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.extendDiv {
  position: absolute;
  right: 0;
  user-select: none;
}

.linkBtn {
  color: rgb(48, 154, 248);
  font-size: xx-small;
  margin-right: 10px;
  text-decoration: underline;
}
.tipDiv {
  margin-top: 30px;
  font-size: xx-large;
  color: orange;
}

.inputDiv {
  margin-top: 30px;
  width: 230px;
}

.submitBtnDiv {
  margin-top: 30px;
}

.checkCodeDiv {
  position: relative;
  margin-top: 30px;
  border: 1px solid orange;
  height: 190px;
  width: 293px;
}

.refreshBtn {
  position: absolute;
  right: 0;
  top: 0;
}

.pointDiv {
  position: absolute;
  border-radius: 13px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 27px;
  width: 27px;
}

.versionDiv {
  position: absolute;
  z-index: -1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: xx-small;
}

.logDiv {
  text-align: left;
}

.msgCheckContent {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.msgCheckElement {
  margin-top: 10px;
}
</style>

