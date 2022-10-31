// $.ajaxPrefilter() 会在发起请求之前先隐秘调用，能够获取到Ajax里的配置数据，就意味着可以拿到请求的URL，通过拼接根路径和请求URL的方式，代替在发起请求是填写完整请求路径的方式，降低重填率
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // 判断是否含有/my路径
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 在客户端每次发起Ajax请求时，通过服务区响应回来的数据，判断用户是否被验证通过，如果用户没有登录，没有通过验证，则强制清空token并跳转到登录页
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份验证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})

// 先查看分支，添加到暂存区，把当前本地分支推送到远程分支，然后切换到main分支，然后合并login分支，然后推送到远程仓库
