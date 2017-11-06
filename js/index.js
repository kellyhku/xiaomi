
$(function () {
    // 导航区域
    // 导航分类
    $.ajax({
        url: 'http://192.168.70.58:9900/api/nav',
        type: 'get',
        success: function (data) {
            // console.log(JSON.parse(data));
            data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                var html = '<li>';
                html += '<a type="' + data[i].type + '" href="#">' + data[i].name + '</a>';
                html += '</li>';
                $("#nav_categoray").append(html);
            }
        }
    })

    // 导航下拉列表
    $(".navwords").on('mouseenter', '#nav_categoray a', function () {
        var $this = $(this);
        // console.log($this);
        $("#nav .navwords .menu ul").html("");
        if ($this.attr("type") != "") {
            $("#nav .navwords .menu").stop().slideDown(1000);
            $.ajax({
                url: 'http://192.168.70.58:9900/api/nav',
                data: 'type=' + $this.attr("type"),
                success: function (data) {
                    // console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        $("#nav .menu ul").append(template('template_nav', data[i]));
                    }
                },
                dataType: 'json'
            })
        }
        if ($this.attr("type") == "") {
            $("#nav .navwords .menu").stop().slideUp(1000);
        }
    }).on('mouseleave', function () {
        $("#nav .navwords .menu").stop().slideUp(1000);
    });



    // 导航栏搜索框
    $("#nav .search input").focus(function () {
        $("#nav .hotwords").hide(500);
    }).blur(function () {
        $("#nav .hotwords").show(500);
    })
    // 轮播旁边的菜单
    $.ajax({
        url: 'http://192.168.70.58:9900/api/items',
        success: function (data) {
            // console.log(data);
            data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                var html = '<li>';
                html += '<a type="' + data[i].type + '" href="#">' + data[i].content + '</a>';
                html += '</li>';
                $("#ad .menu .left ul").append(html);
            }
        }
    });
    // 轮播左边菜单分类右拉
    $("#ad .menu .left").on('mouseenter', 'a', function () {
        // console.log('111');
        $("#ad .menu .right").show();
        $this = $(this);
        $("#ad .menu .right ul").html("");
        $.ajax({
            url: 'http://192.168.70.58:9900/api/items',
            data: 'type=' + $this.attr("type"),
            success: function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    $("#ad .menu .right ul").append(template('template_menu', data[i]));
                }
                var ulWidth = Math.ceil(data.length / 6) * 265;
                $("#ad .menu .right ul").css("width", ulWidth);
            },
            dataType: 'json'
        })
    });
    $("#ad .menu").mouseleave(function () {
        $("#ad .menu .right").hide();
    })

    // 轮播图数据
    $.ajax({
        url: 'http://192.168.70.58:9900/api/lunbo',
        success: function (data) {
            // console.log(data);

            for (var i = 0; i < data.length; i++) {
                $("#slide_ul").append(template('template_slide', data[i]));
                // console.log(data[i].imgUrl);
            }
        },
        dataType: 'json'
    })

    // 轮播图
    var index = 0;
    function nextImg() {
        // console.log($("#slide_ul li").length);
        if (index == $("#slide_ul li").length - 1) {
            index = 0;
            $("#slide_ul li").hide().eq(index).fadeIn();
        }
        index++;
        $("#slide_ul li").hide().eq(index).fadeIn();

    }
    $("#ad_wrap").mouseover(function () {
        clearInterval(timerId);
    });
    $("#ad_wrap").mouseout(function () {
        timerId = setInterval(nextImg, 2000);
    });
    $("#arrRight").click(function () {
        clearInterval(timerId);
        nextImg();
    });
    $("#arrLeft").click(function () {
        clearInterval(timerId);
        if (index == 0) {
            index = $("#slide_ul li").length - 1;
            $("#slide_ul li").hide().eq(index).fadeIn();
        }
        index--;
        $("#slide_ul li").hide().eq(index).fadeIn();

    });
    var timerId = setInterval(nextImg, 2000);


    // 硬件ajax请求
    $.ajax({
        url: 'http://192.168.70.58:9900/api/hardware',
        success: function (data) {
            // console.log(data);
            for (var i = 0; i < data.length; i++) {
                $("#hardware .bottom .right ul").append(template('template_hardware', data[i]));
            }

        },
        dataType: 'json'
    })

    // 搭配部分

    $.ajax({
        url: 'http://192.168.70.58:9900/api/product',
        data: 'toptitle=match',
        success: function (data) {
            // console.log(data);
            // 上左
            $("#product_match .top .left").html(data.topTitleName);
            // 上右
            for (var i = 0; i < data.subs.length; i++) {
                $("#product_match .top .right ul").append(template('template_match_top', data.subs[i]))
            }
            // 上右第一个添加active
            $("#product_match .top .right ul").find("a").first().addClass("active");
            // 下左
            for (var i = 0; i < data.leftGoods.length; i++) {
                $("#product_match .bottom .left ul").append(template('template_match_bottom_left', data.leftGoods[i]))
            }
            // 下右开始
            for (var i = 0; i < data.hotgoods.length; i++) {
                if (i == data.hotgoods.length - 1) {
                    $("#product_match .bottom .right ul").append(template('template_match_bottom_right_last', data.hotgoods[i]));
                } else {
                    $("#product_match .bottom .right ul").append(template('template_match_bottom_right', data.hotgoods[i]))
                }
            }

        },
        dataType: 'json'
    })

    // 搭配部分移入事件请求
    $("#product_match .top .right").on('mouseover', 'a', function () {
        var $this = $(this);
        $this.parent().siblings("li").children("a").removeClass("active");
        $this.addClass("active");
        $.ajax({
            url: 'http://192.168.70.58:9900/api/product',
            data: {
                key: $this.attr('key')
            },
            success: function (data) {
                // console.log(data);
                $("#product_match .bottom .right ul").html("");
                for (var i = 0; i < data.datas.length; i++) {
                    if (i == data.datas.length - 1) {
                        $("#product_match .bottom .right ul").append(template('template_match_bottom_right_last', data.datas[i]));
                    } else {
                        $("#product_match .bottom .right ul").append(template('template_match_bottom_right', data.datas[i]))
                    }
                }
            },
            dataType: 'json'
        })
    });


    // 配件部分
    $.ajax({
        url: 'http://192.168.70.58:9900/api/product',
        data: 'toptitle=accessories',
        success: function (data) {
            // console.log(data);
            // 上左
            $("#product_accessories .top .left").html(data.topTitleName);
            // 上右
            for (var i = 0; i < data.subs.length; i++) {
                $("#product_accessories .top .right ul").append(template('template_match_top', data.subs[i]))
            }
            // 上右第一个添加active
            $("#product_accessories .top .right ul").find("a").first().addClass("active");
            // 下左
            for (var i = 0; i < data.leftGoods.length; i++) {
                $("#product_accessories .bottom .left ul").append(template('template_match_bottom_left', data.leftGoods[i]))
            }
            // 下右开始
            for (var i = 0; i < data.hot.length; i++) {
                if (i == data.hot.length - 1) {
                    $("#product_accessories .bottom .right ul").append(template('template_match_bottom_right_last', data.hot[i]));
                } else {
                    $("#product_accessories .bottom .right ul").append(template('template_match_bottom_right', data.hot[i]))
                }
            }

        },
        dataType: 'json'
    })
    // 配件部分移入事件请求
    $("#product_accessories .top .right").on('mouseover', 'a', function () {
        var $this = $(this);
        $this.parent().siblings("li").children("a").removeClass("active");
        $this.addClass("active");
        $.ajax({
            url: 'http://192.168.70.58:9900/api/product',
            data: {
                key: $this.attr('key')
            },
            success: function (data) {
                // console.log(data);
                $("#product_accessories .bottom .right ul").html("");
                for (var i = 0; i < data.datas.length; i++) {
                    if (i == data.datas.length - 1) {
                        $("#product_accessories .bottom .right ul").append(template('template_match_bottom_right_last', data.datas[i]));
                    } else {
                        $("#product_accessories .bottom .right ul").append(template('template_match_bottom_right', data.datas[i]))
                    }
                }
            },
            dataType: 'json'
        })
    });

    // 周边部分
    $.ajax({
        url: 'http://192.168.70.58:9900/api/product',
        data: 'toptitle=around',
        success: function (data) {
            // console.log(data);
            // 上左
            $("#product_around .top .left").html(data.topTitleName);
            // 上右
            for (var i = 0; i < data.subs.length; i++) {
                $("#product_around .top .right ul").append(template('template_match_top', data.subs[i]))
            }
            // 上右第一个添加active
            $("#product_around .top .right ul").find("a").first().addClass("active");
            // 下左
            for (var i = 0; i < data.leftGoods.length; i++) {
                $("#product_around .bottom .left ul").append(template('template_match_bottom_left', data.leftGoods[i]))
            }
            // 下右开始
            for (var i = 0; i < data.hotcloths.length; i++) {
                if (i == data.hotcloths.length - 1) {
                    $("#product_around .bottom .right ul").append(template('template_match_bottom_right_last', data.hotcloths[i]));
                } else {
                    $("#product_around .bottom .right ul").append(template('template_match_bottom_right', data.hotcloths[i]))
                }
            }

        },
        dataType: 'json'
    })
    // 周边部分移入事件请求
    $("#product_around .top .right").on('mouseover', 'a', function () {
        var $this = $(this);
        $this.parent().siblings("li").children("a").removeClass("active");
        $this.addClass("active");
        $.ajax({
            url: 'http://192.168.70.58:9900/api/product',
            data: {
                key: $this.attr('key')
            },
            success: function (data) {
                // console.log(data);
                $("#product_around .bottom .right ul").html("");
                for (var i = 0; i < data.datas.length; i++) {
                    if (i == data.datas.length - 1) {
                        $("#product_around .bottom .right ul").append(template('template_match_bottom_right_last', data.datas[i]));
                    } else {
                        $("#product_around .bottom .right ul").append(template('template_match_bottom_right', data.datas[i]))
                    }
                }
            },
            dataType: 'json'
        })
    });

    // 为你推荐
    var num = 1;
    function getData() {
        $.ajax({
            url: 'http://192.168.70.58:9900/api/recommend',
            data: {
                page: num
            },
            success: function (data) {
                // console.log(data);
                for (var i = 0; i < data.length; i++) {
                    $("#product_recommend .bottom ul").append(template('template_recommend', data[i]));
                }
                if (num == 1) {
                    $("#product_recommend .top .arrLeft").addClass("disabled");
                } else {
                    $("#product_recommend .top .arrLeft").removeClass("disabled");
                }
                if (num == 4) {
                    $("#product_recommend .top .arrRight").addClass("disabled");
                } else {
                    $("#product_recommend .top .arrRight").removeClass("disabled");
                }
            },
            dataType: 'json'
        })
    }
    getData();
    $("#product_recommend .top .arrRight").click(function () {
        if ($(this).hasClass("disabled")) {
            return;
        }
        $("#product_recommend .bottom ul").html("");
        num++;
        getData();
    });
    $("#product_recommend .top .arrLeft").click(function () {
        if ($(this).hasClass("disabled")) {
            return;
        }
        $("#product_recommend .bottom ul").html("");
        num--;
        getData();
    })

    // 热品产品
    $.ajax({
        url: 'http://192.168.70.58:9900/api/hotcomment',
        success: function (data) {
            // console.log(data);
            for (var i = 0; i < data.length; i++) {
                $("#product_hotcomment .bottom ul").append(template('template_hotcomment', data[i]));
            }
        },
        dataType: 'json'
    })
    // 内容
    $.ajax({
        url: 'http://192.168.70.58:9900/api/content',
        success: function (data) {
            console.log(data);
            for (var i = 0; i < data.contents.length; i++) {
                $("#content>.w>.bottom>ul").append(template('template_content', data.contents[i]));
            }
        },
        dataType: 'json'
    });

    // 内容中的轮播
    $("#content>.w>.bottom>ul").on('mouseover', 'li.wrap', function () {
        $(this).children().last().show();
    }).on('mouseout', 'li.wrap', function () {
        $(this).children().last().hide();
    });
    var imgWidth;
    var arr = [0, 0, 0, 0];//接收4个li的index，4个li的index值不同
    // 右焦点
    $("#content>.w>.bottom>ul").on('click', 'li .arrRight', function () {
        var $this = $(this);
        imgWidth = $("#content .bottom ul .slide").width();
        var slideLiLength = $this.parent().siblings().children().first().children().length;//4
        if (arr[$this.parent().parent().index()] < slideLiLength - 1) {
            arr[$this.parent().parent().index()]++;
            $this.parent().siblings().children().first().animate({
                left: -arr[$this.parent().parent().index()] * imgWidth
            }, 500);
            $this.parent().siblings().children().last().children().removeClass("active").eq(arr[$this.parent().parent().index()]).addClass("active");
        }
    })
    // 左焦点
    $("#content>.w>.bottom>ul").on('click', 'li .arrLeft', function () {
        console.log('11');
        var $this = $(this);
        if (arr[$this.parent().parent().index()] > 0) {
            arr[$this.parent().parent().index()]--;
            $this.parent().siblings().children().first().animate({
                left: -arr[$this.parent().parent().index()] * imgWidth
            }, 500);
            $this.parent().siblings().children().last().children().removeClass("active").eq(arr[$this.parent().parent().index()]).addClass("active");
        }
    })
    // 视频
    $.ajax({
        url: 'http://192.168.70.58:9900/api/video',
        success: function (data) {
            // console.log(data);
            for (var i = 0; i < data.length; i++) {
                $("#video .bottom ul").append(template('template_vedio', data[i]));
            }
        },
        dataType: 'json'
    })
    // 点击 视频弹出
    $("#video .bottom ul").on('click', '.shiping', function () {
        // console.log(111);
        var $this = $(this);
        var html = $this.siblings('a').html();
        var src = $this.attr('type');
        // console.log(html);
        // console.log(src);
        var str = '';
        str += '<div class="top clearfix">';
        str += '<div class="left pull-left"> ' + html + '</div>';
        str += '<div class="right close pull-right">X</div>';
        str += '</div>';
        str += '<video src="' + src + '" autoplay controls loop></video>';
        // console.log(str);
        $("#video .bottom .video").html(str);
        $("#video .bottom .video").show(100);
    })
    // 点击视频中的x关闭
    $("#video .bottom").on('click', '.close', function () {
        $(this).parents('.video').hide(100);
    })
})
