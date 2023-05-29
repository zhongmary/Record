import { getCompletionURL } from '../utils'
import { IInternalAppInfo } from '../types'

const scripts: string[] = []
const links: string[] = []
const inlineScript: string[] = []
// 解析内容这块还是简单的，我们递归寻找元素，将 link、script、img 元素找出来并做对应的处理即可
// 可以考虑直接使用三方库来实现加载及解析文件的过程，这里我们选用了 import-html-entry 这个库

export const parseHTML = (parent: HTMLElement, app: IInternalAppInfo) => {
  const children = Array.from(parent.children) as HTMLElement[]
  children.length && children.forEach((item) => parseHTML(item, app))

  for (const dom of children) {
    if (/^(link)$/i.test(dom.tagName)) {
      const data = parseLink(dom, parent, app)
      data && links.push(data)
    } else if (/^(script)$/i.test(dom.tagName)) {
      const data = parseScript(dom, parent, app)
      data.text && inlineScript.push(data.text)
      data.url && scripts.push(data.url)
    } else if (/^(img)$/i.test(dom.tagName) && dom.hasAttribute('src')) {
      dom.setAttribute(
        'src',
        getCompletionURL(dom.getAttribute('src')!, app.entry)!
      )
    }
  }

  return { scripts, links, inlineScript }
}

const parseScript = (
  script: HTMLElement,
  parent: HTMLElement,
  app: IInternalAppInfo
) => {
  let comment: Comment | null
  const src = script.getAttribute('src')
  if (src) {
    comment = document.createComment('script replaced by micro')
  } else if (script.innerHTML) {
    comment = document.createComment('inline script replaced by micro')
  }
  // @ts-ignore
  comment && parent.replaceChild(comment, script)
  return { url: getCompletionURL(src, app.entry), text: script.innerHTML }
}
// 只需要处理 CSS 资源，其它 preload / prefetch 的这些资源直接替换 href 就行
const parseLink = (
  link: HTMLElement,
  parent: HTMLElement,
  app: IInternalAppInfo
) => {
  const rel = link.getAttribute('rel')
  const href = link.getAttribute('href')
  let comment: Comment | null
  if (rel === 'stylesheet' && href) {
    comment = document.createComment(`link replaced by micro`)
    // @ts-ignore
    comment && parent.replaceChild(comment, script)
    return getCompletionURL(href, app.entry)
  } else if (href) {
    link.setAttribute('href', getCompletionURL(href, app.entry)!)
  }
}
