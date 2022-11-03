$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()  // 年
        let m = padZero(dt.getMonth() + 1) //月份 
        let d = padZero(dt.getDate())      //日 
        let hh = padZero(dt.getHours())    //小时 
        let mm = padZero(dt.getMinutes())  //分 
        let ss = padZero(dt.getSeconds())  //秒 
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义查询参数对象
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    // 获取文章列表数据方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 渲染分页
                renderPage(res.total)
            }
        })
    }

    // 初始化文章方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件重新渲染数据
        initTable()
    })

    // 定义分页方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时触发jump回调
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除删除按钮绑定click事件
    $('tbody').on('click', '.btn-delete', function () {
        let len = $('.btn-delete').length
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        // 页码值最少是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})