import { match } from 'path-to-regexp'
import { getAppList } from './appList'
import { IInternalAppInfo } from './types'
import { AppStatus } from './enum'
import { importEntry } from 'import-html-entry'
import { getCache, setCache } from './cache'

// 利用当然 URL 去匹配相应的子应用，此时分为几种情况：
// 初次启动微前端，此时只需渲染匹配成功的子应用
// 未切换子应用，此时无需处理子应用
// 切换子应用，此时需要找出之前渲染过的子应用做卸载处理，然后渲染匹配成功的子应用

export const getAppListStatus = () => {
  const actives: IInternalAppInfo[] = []
  const unmounts: IInternalAppInfo[] = []

  const list = getAppList() as IInternalAppInfo[]
  list.forEach((app) => {
    // activeRule：在哪些路由下渲染该子应用
    const isActive = match(app.activeRule, { end: false })(location.pathname)
    switch (app.status) {
      case AppStatus.NOT_LOADED:
      case AppStatus.LOADING:
      case AppStatus.LOADED:
      case AppStatus.BOOTSTRAPPING:
      case AppStatus.NOT_MOUNTED:
        isActive && actives.push(app)
        break
      case AppStatus.MOUNTED:
        !isActive && unmounts.push(app)
        break
    }
  })

  return { actives, unmounts }
}

export const fetchResource = async (url: string, appName: string) => {
  if (getCache(appName, url)) return getCache(appName, url)
  const data = await fetch(url).then(async (res) => await res.text())
  setCache(appName, url, data)
  return data
}
// 需要先行处理这些资源的路径，将相对路径拼接成正确的绝对路径，然后再去 fetch
export function getCompletionURL(src: string | null, baseURI: string) {
  if (!src) return src
  if (/^(https|http)/.test(src)) return src

  return new URL(src, getCompletionBaseURL(baseURI)).toString()
}
// 获取完整的 BaseURL
// 因为用户在注册应用的 entry 里面可能填入 //xxx 或者 https://xxx 这种格式的 URL
export function getCompletionBaseURL(url: string) {
  return url.startsWith('//') ? `${location.protocol}${url}` : url
}
//  预取用
export const prefetch = async (app: IInternalAppInfo) => {
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(
      app.entry
    )
    requestIdleCallback(getExternalStyleSheets)
    requestIdleCallback(getExternalScripts)
  })
}

// TODO: 发布订阅模式
