import { AppStatus } from './enum'

export interface IAppInfo {
  name: string
  entry: string
  container: string
  activeRule: string
}

export interface IInternalAppInfo extends IAppInfo {
  status: AppStatus
  // bootstrap：首次应用加载触发，常用于配置子应用全局信息
  bootstrap?: LifeCycle
  mount?: LifeCycle
  unmount?: LifeCycle
  proxy: any
}

export interface ILifeCycle {
  beforeLoad?: LifeCycle | LifeCycle[]
  mounted?: LifeCycle | LifeCycle[]
  unmounted?: LifeCycle | LifeCycle[]
}

export type LifeCycle = (app: IAppInfo) => Promise<any>

export type EventType = 'hashchange' | 'popstate'
