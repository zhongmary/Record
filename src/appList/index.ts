import { IAppInfo, IInternalAppInfo } from '../types'
import { AppStatus } from '../enum'

let appList: IAppInfo[] = []

export const setAppList = (list: IAppInfo[]) => {
  appList = list
  // 啥意思？
  appList.map((app) => {
    ;(app as IInternalAppInfo).status = AppStatus.NOT_LOADED
  })
}

export const getAppList = () => {
  return appList
}
