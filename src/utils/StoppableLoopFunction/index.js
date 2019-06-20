
class StoppableLoopFunction {
  constructor(willLoopFunction, loopInterval) {
    this.willLoopFunction = willLoopFunction;
    this.loopInterval = loopInterval;
    this._timer = null;
    this._nextExecFunction = null;
    this._currentCount = 0;
    this._limitCount = 0;
    this._isLoop = false;
    this._valueCB = null;
    this._args = null;
  }

  start() {
    const args = Object.values(arguments);
    this._valueCB = args.pop();
    this._args = args;
    this._currentCount = 0;
    this._limitCount = Number.MAX_SAFE_INTEGER;

    if (this._isLoop) {
      // 清理未完成的计时器
      clearTimeout(this._timer);
    }
    // 1.修改Loop状态
    this._isLoop = true;
    this._nextExecFunction = async () => {
      this._currentCount += 1;
      if (this._currentCount === this._limitCount) {
        // 还能执行一次
        // 1.下一个执行的方法设置为目标方法,并忽略内部停止指令
        this._nextExecFunction = async () => {
          const value = await this.willLoopFunction(...this._args, () => { });
          this._valueCB(value);
          this._isLoop = false;
        };
        // 2.手动点火,触发最后一次执行
        this._nextExecFunction();
      } else {
        // 1.调用目标函数,并注入可控制内部停止的回调
        const value = await this.willLoopFunction(...this._args, (delayCount) => {
          // 函数内部终止
          // 立即终止 - 重置LOOP状态,结束计时器
          if (delayCount === 0) {
            this._isLoop = false;
            clearTimeout(this._timer);
          }
          // 延迟终止 - 设置个数,继续轮询
          else {
            this._currentCount = 0;
            this._limitCount = delayCount;
          }
        });
        // 2.回调目标函数的返回值
        this._valueCB(value);
        // 3.设置轮询计时器
        // 进行_isLoop判断是为了使内部立即停止生效
        this._isLoop && (this._timer = setTimeout(() => { this._nextExecFunction() }, this.loopInterval));
      }
    }
    // 3.第一次手动点火运行
    this._nextExecFunction();
  }

  pause(delayCount) {
    if (delayCount === 0) {
      this._isLoop = false;
      clearTimeout(this._timer);
    } else {
      this._currentCount = 0;
      this._limitCount = delayCount;
    }
  }
}

export default StoppableLoopFunction;
