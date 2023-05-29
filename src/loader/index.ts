import { IInternalAppInfo } from '../types'
import { importEntry } from 'import-html-entry'
import { ProxySandbox } from './sandbox'

export const loadHTML = async (app: IInternalAppInfo) => {
  // container: '#micro-container',
  // entry: 'http://localhost:8080',
  const { container, entry } = app

  const { template, getExternalScripts, getExternalStyleSheets } =
    await importEntry(entry)
  const dom = document.querySelector(container)

  if (!dom) {
    throw new Error('容器不存在')
  }

  dom.innerHTML = template

  await getExternalStyleSheets()
  const jsCode = await getExternalScripts()
  // 对于一段 JS 字符串来说，我们想执行的话大致上有两种方式：

  // eval(js string)
  // new Function(js string)()
  jsCode.forEach((script) => {
    const lifeCycle = runJS(script, app)
    if (lifeCycle) {
      app.bootstrap = lifeCycle.bootstrap
      app.mount = lifeCycle.mount
      app.unmount = lifeCycle.unmount
    }
  })

  return app
}

const runJS = (value: string, app: IInternalAppInfo) => {
  if (!app.proxy) {
    // JS 沙箱  子应用直接修改 window 上的属性又要能访问 window 上的内容，那么就只能做个假的 window 给子应用
    app.proxy = new ProxySandbox()
    // @ts-ignore
    window.__CURRENT_PROXY__ = app.proxy.proxy
  }
  app.proxy.active()
  const code = `
    return (window => {
      ${value}
      return window['${app.name}']
    })(window.__CURRENT_PROXY__)
  `
  return new Function(code)()
}
