> 2019-09-08

### 闪电分享

- `vscode`编辑风格切换快捷键 cmd+K+T
- 「业务数据兜底思考 🤔」1、将初始页面当兜底页面开发 2.优雅的链式取值-lodash.get(针对 falsy 值兜底)
- `vscode`批量删除本地分支

```#Bash
git branch |grep 'branchName' |xargs git branch -D
```

#### TODO

- [ ] [shell 教程](https://www.runoob.com/linux/linux-shell-basic-operators.html)
- [ ] [Linux 教程](https://www.runoob.com/linux/linux-comm-mkdir.html)

### Node.js 入门系列

https://github.com/chencl1986/Blog

### ESlint 和 Prettier

ESLint 是一个检查代码质量与风格的工具
Prettier 专注于代码排版，但不会关心你的代码质量
配置方式，Prettier 与 ESLint 同样可用 js、json、yaml 格式
既然 ESLint 已经包含了排版相关的校验，为什么还需要 Prettier 呢？

我想到这么三个原因：一是 ESLint 安装和配置比较麻烦，而且 lint 的速度并不快；二是使用 Prettier 并不只针对 JavaScript，也就是安装 Prettier 插件，就可以格式化各种流行语言；三是配置没那么眼花缭乱。

editorconfig for vscode
项目工程的根目录文件夹下添加.editorconfig 文件，那么这个文件声明的代码规范规则能覆盖编辑器默认的代码规范规则

配置优先级

git hook(husky),precommit,lint-stage
