// 实现js沙箱
// - 快照 ：挂载子应用前记录下当前 window 上的所有内容，然后接下来就随便让子应用去玩了，直到卸载子应用时恢复挂载前的 window 即可。这种方案实现容易，唯一缺点就是性能慢点
// - Proxy
// 一个初版的沙箱，核心思路就是创建一个假的 window 出来，如果用户设置值的话就设置在 fakeWindow 上，这样就不会影响全局变量了。如果用户取值的话，就判断属性是存在于 fakeWindow 上还是 window 上。
export class ProxySandbox {
  proxy: any
  running = false
  constructor() {
    const fakeWindow = Object.create(null)
    const proxy = new Proxy(fakeWindow, {
      set: (target: any, p: string, value: any) => {
        if (this.running) {
          target[p] = value
        }
        return true
      },
      get(target: any, p: string): any {
        // 防止用户逃课
        switch (p) {
          case 'window':
          case 'self':
          case 'globalThis':
            return proxy
        }
        // 假如属性不存在 fakeWindow 上，但是存在于 window 上
        // 从 window 上取值
        if (
          !window.hasOwnProperty.call(target, p) &&
          window.hasOwnProperty(p)
        ) {
          // @ts-ignore
          const value = window[p]
          if (typeof value === 'function') return value.bind(window)
          return value
        }
        return target[p]
      },
      has() {
        return true
      },
    })
    this.proxy = proxy
  }
  active() {
    this.running = true
  }
  inactive() {
    this.running = false
  }
}
