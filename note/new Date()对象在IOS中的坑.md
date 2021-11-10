### 问题

`new Date("2021-11-04 11:11")` 返回的 `Invalid Date` 错误，`new Date("2021/11/04 11:11")` 才能返回正确的结果

### 现象

![](https://github.com/zhongmary/Record/blob/master/assets/safari_newDate.png)

从safari控制台输出结果可以看出，使用`/`格式下，在年月日缺失日的情况下仍会返回`Invalid Date` 错误，也就是说将`-`换成`/`也不是万能的。

### 解决方案

new Date("2021-11-04 11:11".replace(/-/g, "/"))

