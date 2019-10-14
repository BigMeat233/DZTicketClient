<template>
  <div class="introduceDiv">
    <el-radio-group v-model="type">
      <el-radio-button label="normal">手动购票</el-radio-button>
      <el-radio-button label="alternate">手动候补</el-radio-button>
      <el-radio-button label="auto">自动刷票</el-radio-button>
    </el-radio-group>
    <!-- 手动刷票 -->
    <div class="contentDiv" v-if="type === 'normal'">
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal1.png" width="400px" />
        <label slot="reference">
          1. 在主面板上选择
          <span class="redSpan">[起点站台]</span>
          、
          <span class="redSpan">[终点站台]</span>
          、
          <span class="redSpan">[出发日期]</span>
          等车票基础信息
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal2.png" width="400px" />
        <label slot="reference">
          2. 点击主面板上的
          <span class="redSpan">[选择乘客]</span>
          按钮，给
          <span class="redSpan">[需要购票的乘客]</span>
          选择期望的
          <span class="redSpan">[座位类型]</span>
          并点击名字前方的
          <span class="redSpan">[+]</span>
          进行添加
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal3.png" width="400px" />
        <label slot="reference">
          3. 关闭
          <span class="redSpan">[选择乘客]</span>
          面板，点击主面板上的
          <span class="redSpan">[开始刷票]</span>
          按钮查看车票信息
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal4.png" width="400px" />
        <label slot="reference">
          4. 在
          <span class="redSpan">[期望的车次]</span>
          上点击
          <span class="redSpan">[车次右侧]</span>
          的
          <span class="redSpan">[下单]</span>
          按钮执行下单操作
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal5.png" width="400px" />
        <label slot="reference">
          5. 等待
          <span class="redSpan">[出票成功提示]</span>
          ，出票成功时点击弹框上的
          <span class="redSpan">[确定]</span>
          按钮跳转至
          <span class="redSpan">[12306]</span>
          进行付款
          <span class="redSpan">(或使用12306手机App进行付款)</span>
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal6.png" width="400px" />
        <label slot="reference">
          6. 若
          <span class="redSpan">[出票失败]</span>
          ，则重复
          <span class="redSpan">[3-5]</span>
          步操作
        </label>
      </el-popover>
    </div>
    <!-- 手动候补 -->
    <div class="contentDiv" v-else-if="type === 'alternate'">
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal1.png" width="400px" />
        <label slot="reference">
          1. 在主面板上选择
          <span class="redSpan">[起点站台]</span>
          、
          <span class="redSpan">[终点站台]</span>
          、
          <span class="redSpan">[出发日期]</span>
          等车票基础信息
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal2.png" width="400px" />
        <label slot="reference">
          2. 点击主面板上的
          <span class="redSpan">[选择乘客]</span>
          按钮，给
          <span class="redSpan">[需要购票的乘客]</span>
          选择期望的
          <span class="redSpan">[座位类型]</span>
          并点击名字前方的
          <span class="redSpan">[+]</span>
          进行添加
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal3.png" width="400px" />
        <label slot="reference">
          3. 关闭
          <span class="redSpan">[选择乘客]</span>
          面板，点击主面板上的
          <span class="redSpan">[开始刷票]</span>
          按钮查看车票信息
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/alternate1.png" width="400px" />
        <label slot="reference" style="text-align: left">
          4. 在
          <span class="redSpan">[车票信息]</span>
          中点击期望的
          <span class="redSpan">[候补座次]</span>
          ，并点击成功率
          <span class="redSpan">[提示框]</span>
          上的
          <span class="redSpan">[添加候补]</span>
          按钮
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/alternate2.png" width="400px" />
        <label slot="reference" style="text-align: left">
          4.1 若提示
          <span class="redSpan">[请前往12306手机App进行人脸核验]</span>
          则需要确认账号的
          <span class="redSpan">人脸核验状态(使用12306手机App进行)</span>
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal2.png" width="400px" />
        <label slot="reference" style="text-align: left">
          4.2 若已通过人脸核验则点击主面板上的
          <span class="redSpan">[选择乘客]</span>
          按钮后重试步骤
          <span class="redSpan">[4]</span>
          即可
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/alternate3.png" width="400px" />
        <label slot="reference" style="text-align: left">
          5. 点击主面板上的
          <span class="redSpan">[候补座次]</span>
          按钮，选择
          <span class="redSpan">[兑现截止日期]</span>
          后点击
          <span class="redSpan">[提交候补订单]</span>
          进行候补下单操作
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/alternate5.png" width="400px" />
        <label slot="reference">
          6. 等待
          <span class="redSpan">[候补成功提示]</span>
          ，点击弹框上的
          <span class="redSpan">[确定]</span>
          按钮跳转至
          <span class="redSpan">[12306]</span>
          进行付款
          <span class="redSpan">(或使用12306手机App进行付款)</span>
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/alternate4.png" width="400px" />
        <label slot="reference">
          7. 若
          <span class="redSpan">[候补失败]</span>
          ，则在
          <span class="redSpan">[候补座次]</span>
          面板中
          <span class="redSpan">[删除所有候补座次]</span>
          后重复
          <span class="redSpan">[3-6]</span>
          步操作
        </label>
      </el-popover>
    </div>
    <!-- 自动刷票 -->
    <div class="contentDiv" v-else>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal1.png" width="400px" />
        <label slot="reference">
          1. 在主面板上选择
          <span class="redSpan">[起点站台]</span>
          、
          <span class="redSpan">[终点站台]</span>
          、
          <span class="redSpan">[出发日期]</span>
          等车票基础信息
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal2.png" width="400px" />
        <label slot="reference">
          2. 点击主面板上的
          <span class="redSpan">[选择乘客]</span>
          按钮，给
          <span class="redSpan">[需要购票的乘客]</span>
          选择期望的
          <span class="redSpan">[座位类型]</span>
          并点击名字前方的
          <span class="redSpan">[+]</span>
          进行添加
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal3.png" width="400px" />
        <label slot="reference">
          3. 关闭
          <span class="redSpan">[选择乘客]</span>
          面板，点击主面板上的
          <span class="redSpan">[开始刷票]</span>
          按钮查看车票信息
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/auto1.png" width="400px" />
        <label slot="reference">
          4. 在
          <span class="redSpan">[车票信息面板]</span>
          中点击刷票时的
          <span class="redSpan">[期望车次]</span>
          <span class="redSpan">(成功选中时，车次上方的[×]会变为[√])</span>
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/auto3.png" width="400px" />
        <label slot="reference">
          5. 点击主面板上的
          <span class="redSpan">[刷票配置]</span>
          按钮，设置
          <span class="redSpan">[刷票参数]</span>
          并调整
          <span class="redSpan">[期望车次]</span>
          中的
          <span class="redSpan">[车次优先级顺序(空格隔开)]</span>
          后打开
          <span class="redSpan">[所有开关]</span>
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal3.png" width="400px" />
        <label slot="reference">
          6. 关闭
          <span class="redSpan">[刷票配置]</span>
          面板，点击主面板上的
          <span class="redSpan">[开始刷票]</span>
          ，即开始自动刷票
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/auto2.png" width="400px" />
        <label slot="reference">
          6.1 开启自动刷票后，可以点击主面板上的
          <span class="redSpan">[小黑屋]</span>
          、
          <span class="redSpan">[停止刷票]</span>
          、
          <span class="redSpan">[刷票日志]</span>
          监视和控制刷票进度
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/alternate5.png" width="400px" />
        <label slot="reference">
          6.2 若出现
          <span class="redSpan">[候补成功提示]</span>
          ，点击弹框上的
          <span class="redSpan">[确定]</span>
          按钮跳转至
          <span class="redSpan">[12306]</span>
          进行付款
          <span class="redSpan">(或使用12306手机App进行付款)</span>
        </label>
      </el-popover>
      <el-popover placement="bottom" width="400" trigger="focus">
        <img src="../assets/images/normal5.png" width="400px" />
        <label slot="reference">
          6.3 若出现
          <span class="redSpan">[出票成功提示]</span>
          ，点击弹框上的
          <span class="redSpan">[确定]</span>
          按钮跳转至
          <span class="redSpan">[12306]</span>
          进行付款
          <span class="redSpan">(或使用12306手机App进行付款)</span>
        </label>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Introduce',
  data() {
    return {
      type: 'normal', // normal, alternate, auto
    };
  },
}
</script>
<style scoped>
.introduceDiv {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.introduceDialog > .el-dialog__body {
  text-align: left;
  height: 450px;
}
</style>
<style scoped>
.contentDiv {
  flex: 1;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.redSpan {
  color: red;
}
</style>