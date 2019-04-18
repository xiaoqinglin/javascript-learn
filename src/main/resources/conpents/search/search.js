/*初始化滚动条触发*/
$(document).ready(function(){
    $('.test').scroll(function() {
        minheader();
        $("span").text($('.test').scrollTop());
    });
});

function minheader() {
    var a = $(".test").scrollTop();  /*返回滚动条的垂直位置*/
    if (a > 170) {
        $(".minheader").css("display", "block");
        $(".minheader").stop();
        $(".minheader").animate({
            top: "0px"
        }, 500)
    } else {
        $(".minheader").css("display", "none");
        $(".minheader").stop();
        $(".minheader").animate({
            display: "none",
            top: "-70px"
        }, 500)
    }
  /*  if (($(document).scrollTop()) <= 50) {
        $(".sidebar").fadeOut()
    } else {
        $(".sidebar").fadeIn()
    }*/
}



$("#headersearchWord1").click(function() {
    var c = $(this).parent().find("input[type='text']").val();
    if (!c) {
        return
    }
    c = $.trim(c);
    var b = $(this).parent().find("input").data("type");
    if (b == "h5") {
        var a = 1
    } else {
        if (b == "poster") {
            var a = 2
        } else {
            if (b == "single") {
                var a = 3
            } else {
                if (b == "video") {
                    var a = 4
                } else {
                    var a = 1
                }
            }
        }
    }
    totalkeyword(a, c);
    window.open((SEARCH_URL + "?t=" + a + "&kwd=" + c))
});
$("#headersearchWord2").click(function() {
    var c = $(this).parent().find("input[type='text']").val();
    if (!c) {
        return
    }
    c = $.trim(c);
    var b = $(this).parent().find("input").data("type");
    if (b == "h5") {
        var a = 1
    } else {
        if (b == "poster") {
            var a = 2
        } else {
            if (b == "single") {
                var a = 3
            } else {
                if (b == "video") {
                    var a = 4
                } else {
                    var a = 1
                }
            }
        }
    }
    totalkeyword(a, c);
    window.open((SEARCH_URL + "?t=" + a + "&kwd=" + c))
});


function headerKeyPress(a, b) {
    if (a.keyCode === 13) {
        console.log(b);
        $("#" + b).click()
    }
}