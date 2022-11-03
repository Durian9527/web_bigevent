$(function () {
    initArtCateList()
    let layer = layui.layer
    let form = layui.form 
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    let htmlStr = template('tpl-table', res)
                    $('tbody').html(htmlStr)
                    return layer.msg(res.message)
                }
                layer.msg('')
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').on('click', function (e) {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('新增文章成功')
                // 根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为btn-edit表单绑定click事件
    let indexEdit = null
    $('tbody').on('click', 'btn-edit', function(e){
        // 修改文章的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id')
        // 发起请求获取对应的数据
        $.ajax({
            type: 'GET',
            // 根据当前id获取数据
            url: '/my/article/cates/' + id,
            success: function(res) {
                // 填充数据
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e){
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatacate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新分类成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('tbody').on('click', 'btn-delete', function(e){
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'GET',
                // 根据当前id获取数据
                url: '/my/article/daletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            }) 
        })
    })
})