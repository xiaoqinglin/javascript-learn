/*初始化滚动条触发*/
$(document).ready(function(){
    $('.test').scroll(function() {
        showSideBar();
        $("span").text($('.test').scrollTop());
    });
});

function showSideBar() {
    if (($(document).scrollTop()) <= 50) {
        $(".sidebar").fadeOut()
    } else {
        $(".sidebar").fadeIn()
    }
}

/*回退顶端  点击事件*/
$(".backtopbtn").click(function(a) {
    $("html,body").animate({
        scrollTop: 0
    }, 500);
    return false
});
