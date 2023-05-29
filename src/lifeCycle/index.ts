import { IAppInfo, IInternalAppInfo, ILifeCycle } from '../types'
import { AppStatus } from '../enum'
import { loadHTML } from '../loader'

let lifeCycle: ILifeCycle = {}

export const setLifeCycle = (list: ILifeCycle) => {
  lifeCycle = list
}

export const getLifeCycle = () => {
  return lifeCycle
}

// 设置子应用状态，用于逻辑判断以及优化。比如说当一个应用状态为非 NOT_LOADED 时（每个应用初始都为 NOT_LOADED 状态），下次渲染该应用时就无需重复加载资源了
// 如需要处理逻辑，比如说 beforeLoad 我们需要加载子应用资源
// 执行主 / 子应用生命周期，这里需要注意下执行顺序，可以参考父子组件的生命周期执行顺序

export const runBeforeLoad = async (app: IInternalAppInfo) => {
  app.status = AppStatus.LOADING
  await runLifeCycle('beforeLoad', app)
  //  加载子应用资源
  //  资源入口其实分为两种方案：
  //     - JS Entry
  //     -  HTML Entry
  app = await loadHTML(app)
  app.status = AppStatus.LOADED
}

export const runBoostrap = async (app: IInternalAppInfo) => {
  if (app.status !== AppStatus.LOADED) {
    return app
  }
  app.status = AppStatus.BOOTSTRAPPING
  await app.bootstrap?.(app)
  app.status = AppStatus.NOT_MOUNTED
}

export const runMounted = async (app: IInternalAppInfo) => {
  app.status = AppStatus.MOUNTING
  await app.mount?.(app)
  app.status = AppStatus.MOUNTED
  await runLifeCycle('mounted', app)
}

export const runUnmounted = async (app: IInternalAppInfo) => {
  app.status = AppStatus.UNMOUNTING
  app.proxy.inactive()
  await app.unmount?.(app)
  app.status = AppStatus.NOT_MOUNTED
  await runLifeCycle('unmounted', app)
}

const runLifeCycle = async (name: keyof ILifeCycle, app: IAppInfo) => {
  const fn = lifeCycle[name]
  if (fn instanceof Array) {
    await Promise.all(fn.map((item) => item(app)))
  } else {
    await fn?.(app)
  }
}
