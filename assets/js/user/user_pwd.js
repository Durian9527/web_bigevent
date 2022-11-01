// 自定义密码校验规则
$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        samePwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        },
        rePwd: function(value){
            if(value !== $('[name=newPwd]').val()){
                return '新密码输入不一致，请重新输入'
            }
        }
    })

    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                // 重置表单
                // 先转换成dom对象才能调用reset方法
                $('.layui-form')[0],reset()
            }
        })
    })
})