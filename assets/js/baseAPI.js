// $.ajaxPrefilter() 会在发起请求之前先隐秘调用，能够获取到Ajax里的配置数据，就意味着可以拿到请求的URL，通过拼接根路径和请求URL的方式，代替在发起请求是填写完整请求路径的方式，降低重填率
$.ajaxPrefilter(function(options){
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url
})