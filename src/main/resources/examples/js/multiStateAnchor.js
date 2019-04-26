//初始化锚的多种状态
ADS.addEvent(window,'load',initMultiStateAnchor);

function initMultiStateAnchor(){
    //获取所有锚元素对象
    var elements = ADS.getElementsByClassName('multiStateAnchor','*',document);
    for(var i=0; i < elements.length; i++){
        //找到锚对象中的图像，注意【0】
        var elementImg = elements[i].getElementsByTagName('img')[0];
        if(elementImg){
            //存在图片元素，解析其源路径
            var extensionIndex = elementImg.src.lastIndexOf('.');//获取.对应的位置
            var endIndex = elementImg.src.lastIndexOf('\/');
            var path = elementImg.src.substr(0,endIndex+1); //截取，获取路径
            var extension = elementImg.src.substring(extensionIndex, elementImg.src.length);//截取图片类型

            //给图片添加事件
            registerMultiStateAnchorEvent(elements[i],elementImg, path,extension);
        }
    }

}

/**
 * 给锚元节点 添加多种事件
 * @param anchor 锚元素
 * @param img    图片元素
 * @param path   路径
 * @param extension  图片类型
 */
function registerMultiStateAnchorEvent(anchor, img, path, extension) {
    //载入鼠标悬停状态的图像
    //载入过程与其余的脚本
    //异步进行
    var tempSrc = img.src;
    var newmouseOverImg = new Image();
    newmouseOverImg.src = path+"t9lion_trans"+extension;

    //当鼠标悬停时变换图像的源文件 mouseover
    ADS.addEvent(anchor, 'mouseover', function () {
        img.src = newmouseOverImg.src;
    });

    //当鼠标移出时将图像变换为原始文件 mouseout
    ADS.addEvent(anchor, 'mouseout', function () {
        img.src = tempSrc;
    });

    //载入鼠标按下时的图像
    var newmouseOverImg2 = new Image();
    newmouseOverImg2.src = path+"t9penguino_trans"+extension;

    //当鼠标按下时将图片变换为按下状态的源文件 mousedown
    ADS.addEvent(anchor, 'mousedown', function () {
        img.src = newmouseOverImg2.src;
    });

    //当鼠标放开时将图像变换为原始文件 mouseup
    ADS.addEvent(anchor, 'mouseup', function () {
        img.src = tempSrc;
    });
}
