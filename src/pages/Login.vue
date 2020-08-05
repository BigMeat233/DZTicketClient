<template>
  <div class="loginDiv">
    <div class="extendDiv">
      <label class="linkBtn" @click="faqBtnClick">缩在墙角的FAQ</label>
    </div>
    <div class="tipDiv">登陆</div>
    <div class="inputDiv">
      <el-input v-model="userId" placeholder="请输入12306账号" clearable></el-input>
    </div>
    <div class="inputDiv">
      <el-input v-model="userPwd" placeholder="请输入12306密码" type="password" clearable></el-input>
    </div>
    <div class="submitBtnDiv">
      <el-button type="primary" size="medium" @click.native="submitBtnClick($event)">登录</el-button>
    </div>
    <div class="checkCodeAreaDiv" v-if="isNeedImgCode">
      <div class="checkCodeDiv" @click="checkCodeDivClick($event)">
        <img :src="checkCodeImg" />
        <el-button
          icon="el-icon-refresh"
          size="mini"
          class="refreshBtn"
          @click.native="refreshBtnClick($event)"
        />
        <div
          v-for="(point,index) in points"
          :key="index"
          :style="{left:(point.x-13) +'px',top:(point.y-13)+'px'}"
          class="pointDiv"
          @click="pointClick(index,$event)"
        >
          <img src="@/assets/images/logo.png" height="27" width="27" />
        </div>
      </div>
    </div>
    <div class="versionDiv">
      <label>DZTicket V1.2.10.1</label>
      <label>QQ:303569528</label>
      <label>Wechat:Dashuaige_Douzi</label>
      <label>请大家谨慎使用 遵纪守法</label>
      <label>2019版本用了最新科技重构了代码</label>
      <label style="color:orange">破解了12306设备码 每次登陆都模拟一个新设备</label>
      <label>特别鸣谢大鲜肉🍓同学亲自写了每一行代码</label>
      <label>没错就是本鲜肉😂</label>
    </div>
    <el-dialog
      title="人机识别"
      width="350px"
      custom-class="aiCheckDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="aiCheckDialogClose"
      :visible.sync="aiCheckDialogVisible"
    >
      <div id="aliDiv"></div>
    </el-dialog>
    <el-dialog title="FAQ" :visible.sync="faqDialogVisble" :show-close="true">
      <div class="logDiv">
        <p>Q1:频繁刷票失败怎么办?</p>
        <p>A1:首先需要确定查票的日期没有放票,如果已放票则尝试返回登录页面重新登录</p>
        <br />
        <p>Q2:出现订单预处理失败?</p>
        <p>A2:尝试再次下单,若一直出现说明已掉线,返回登录页面重新登录</p>
        <br />
        <p>Q3:下单时提示请先选择需要抢票的乘客?</p>
        <p>A3:需要点击[添加乘客],在里面选座后点击该乘客,出现屎黄色框框才表示该乘客被选中</p>
        <br />
        <p>Q4:刷票时提示起点站或终点站不存在?</p>
        <p>A4:需要务必保证起点站和终点站在12306系统中存在</p>
        <br />
        <p>Q5:静默刷票卡住?</p>
        <p>A5:打开[刷票日志],若日志长时间不变化说明未在刷票,尝试刷新页面后再次进行刷票</p>
        <br />
        <p>Q6:出票成功后怎么支付?</p>
        <p>A6:需要手机或者PC登录12306进入我的订单进行支付</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from '@/assets/images/checkCodeImg.png';
import AsyncFuncs from '@/utils/AsyncFuncs';
import Core from '@/utils/Core';
export default {
  name: 'Login',
  data() {
    return {
      userId: '',
      userPwd: '',
      points: [],
      checkCodeImg: defaultImg,
      faqDialogVisble: false,
      isNeedImgCode: false,
      isNeedLocalLogin: false,
      aiCheckDialogVisible: false
    };
  },
  methods: {
    refreshBtnClick(event) {
      event.stopPropagation();
      this.getCheckCode();
    },
    faqBtnClick() {
      this.faqDialogVisble = true;
    },
    aiCheckDialogClose(done) {
      Core.ui.message.warn('用户取消登陆');
      this.getCheckCode();
      done();
    },
    async submitBtnClick() {
      if (this.userId === '') {
        Core.ui.message.warn('请输入12306账号');
        return;
      }
      if (this.userPwd === '') {
        Core.ui.message.warn('请输入12306密码');
        return;
      }
      if (this.isNeedImgCode && this.points.length === 0) {
        Core.ui.message.warn('请往验证码上点狗头');
        return;
      }
      let answer = this.getAnswer();
      // 本地登陆
      if (this.isNeedLocalLogin) {
        let result = await AsyncFuncs.localLogin(this.userId, this.userPwd, answer);
        if (result) {
          this.userId = '';
          this.userPwd = '';
          Core.navigator.push('/Home');
        } else {
          this.getCheckCode();
        }
      }
      // 统一登陆
      else {
        let { result, aiCheckCode } = await AsyncFuncs.getAiCheckCode(this.userId, answer);
        if (!result) {
          this.getCheckCode();
        } else {
          // 需要拉起拖动验证码
          let aiCheckResult = await this.dispatchAiCheck(aiCheckCode);
          let loginResult = await AsyncFuncs.login(this.userId, this.userPwd, answer, aiCheckResult);
          if (loginResult) {
            this.userId = '';
            this.userPwd = '';
            Core.navigator.push('/Home');
          } else {
            this.getCheckCode();
          }
        }
      }
    },
    getAnswer() {
      let answer = [];
      this.points.forEach(point => {
        answer.push(point.x.toString());
        answer.push((point.y - 30).toString());
      });
      answer = answer.join(',');
      return answer;
    },
    checkCodeDivClick(event) {
      var point = {
        x: event.layerX,
        y: event.layerY
      };
      this.points.push(point);
    },
    pointClick(index, event) {
      event.stopPropagation();
      this.points.splice(index, 1);
    },
    dispatchAiCheck(aiCheckCode) {
      return new Promise(resolve => {
        const { isNeedAiCheck, aiCheckToken } = aiCheckCode;
        if (!isNeedAiCheck) {
          resolve({ sessionId: null, sig: null, token: null });
        } else {
          this.aiCheckDialogVisible = true;
          const appkey = aiCheckToken.split(':').shift();
          const self = this;
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
              self.aiCheckDialogVisible = false;
              const { csessionid, sig, token } = result;
              resolve({ sessionId: csessionid, sig, token });
            }
          };
          setTimeout(() => {
            const aliAiCheck = new noCaptcha(config);
            aliAiCheck.upLang('zh', {
              _startTEXT: '请按住滑块，拖动到最右边，进行AI识别',
              _yesTEXT: '验证通过',
              _error300:
                '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
              _errorNetwork:
                '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>'
            });
          }, 0);
        }
      });
    },
    async getCheckCode() {
      this.points = [];
      this.checkCodeImg = this.isNeedLocalLogin
        ? await AsyncFuncs.getLocalCheckCode()
        : await AsyncFuncs.getCheckCode();
    }
  },
  async mounted() {
    const { confInfo } = await AsyncFuncs.initPage();
    const { isNeedImgCode, isNeedLocalLogin } = confInfo;
    this.isNeedImgCode = isNeedImgCode;
    this.isNeedLocalLogin = isNeedLocalLogin;
    await AsyncFuncs.registerDevice();
    isNeedImgCode && this.getCheckCode();
  }
};
</script>

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
  -webkit-user-select: none;
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
</style>

