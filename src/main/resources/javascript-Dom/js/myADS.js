/*匿名*/
(
    function () {
        //判断是否存在ADS命名空间
        if(!window.ADS){//不存在
            window['ADS'] = {};
        }
        /*检测当前浏览器是否与整个库兼容*/
        function isCompatible(other) {
            //使用能力检测来检查必要条件:javascript特性的方法
            if(other === false
                || !Array.prototype.push
                || !Object.hasOwnProperty
                || !document.createElement
                || !document.getElementsByTagName){

                return false;
            }
            return true;
        };
        window['ADS']['isCompatible'] = isCompatible;

        /*实现功能： document.getElementById('example')
        * var elements = ADS.$('A','B','C','D');
        * for(e in eelements){//执行某些操作}
        * */
        function $(){
            var elements = new Array();

            for (var i=0; i<arguments.length; i++){
                var element = arguments[i];

                //判断该参数是否为String字符串,则需要获取该字符串对应的对象
                if(typeof element == 'string'){
                    element = document.getElementById(element);
                }

                //如果只提供一个对象，则直接返回
                if(arguments.length == 1){
                    return element;
                }

                //多个对象处理,添加到数组中
                elements.push(element);
            }

            return elements;
        };
        window['ADS']['$'] = $;
        /*
        *元素节点添加事件
        *ADS.addEvent(window,'click',funcion(e){
        *   console.log(e);
        *   console.log(e.target);
        *   console.log(this);
        * });
        * node:元素节点
        * type:事件的类型
        * listener:触发该事件时执行的函数

        * */
        function addEvent(node, type, listener) {
            /*检测兼容性，平稳退化*/
            if(!isCompatible()){
                return false;
            }
            /*查无该节点*/
            if(!(node = $(node))){
                return false;
            }

            if(node.addEventListener){ //w3c
                node.addEventListener(type,listener,false);
                return true;

            }else if(node.attachEvent){ //兼容IE的方法
                // node.attachEvent("on"+type, listener);
                // return true;
                node['e'+type+listener] = listener;
                node[type+listener] = function () {
                    node['e'+type+listener] = (window.event);
                }
                // 此处的作用是在全局作用域中，this也可以指触发元素而不是window
                //此种写法也可以把事件作为参数e传递进来
                node.attachEvent('on' + type, node[type + listener]);
                return true;
            }
            //若两种方法都不兼容，则返回false
            return false;

        };
        window['ADS']['addEvent'] = addEvent;

        /**
         * 元素节点移除事件
         * @param node 元素节点
         * @param type 事件类型  不包含on前缀，例如： onload标识符表示一个对象的具体属性。
         * load则是w3c的addeventlistener方法识别事件所必须的。
         * @param listener  事件（函数）
         * @returns {boolean}
         */
        function removeEvent(node, type, listener) {
            if(!(node=$(node))){
                return false;
            }

            if(node.removeEventListener){ //w3c
                node.removeEventListener(type, listener,false);
                return true;

            }else if(node.detachEvent){//兼容IE的方法
                //移除事件，并置空
                node.detachEvent('on'+click, node[type+listener]);
                node[type+listener] = null;
                return true;
            }

            return false;
        };
        window['ADS']['removeEvent'] = removeEvent;

        /**
         *工作原理：dom文档树中查找类属性包含某个className\可选的节点和标签过滤器的元素，
         * 找出所有与指定的类、节点、标签相关的dom元素。
         * @param className  class 类名 class="xxx"
         * @param tag  标签   * 表示所有
         * @param parent 元素
         */
        function getElementsByClassName(className, tag, parent) {
            // 或，从左往右, 找出可用的值赋值， parent 父框架， document 当前页面；
            parent = parent || document;

            if(!(parent=$(parent))){
                return false;
            }

            //查出所有匹配的标签
            var allTags = (tag == '*' && parent.all) ? parent.all :document.getElementsByTagName(tag);

            var matchingElements = new Array();

            //正则表达式，判断className是否命名正确
            classname = className.replace(/\-/g,"\\_");
            var regex = new RegExp("^|\\s"+className+"\\s|$");//清空左右空格

            //检查每个元素
            var element;
            for (var i=0; i < allTags.length; i++){
                element = allTags[i];
                if(element.className != "" && regex.test(element.className)){
                    matchingElements.push(element);
                }
            }
            //返回匹配的元素
            return matchingElements;

        };
        window['ADS']['getElementsByClassName'] = getElementsByClassName;


        /**
         * 切换DOM树中的元素的可见性。
         * @param node 元素节点
         * @param value ： none|block|inline|''
         */
        function toggleDisplay(node, value) {

            if(!(node=$(node))){
                return false;
            }
            if(node.style.display != 'none'){
                node.style.display = 'none';
            }else{
                node.style.display = value || '';
            }
            return true;
        };
        window['ADS']['toggleDisplay'] = toggleDisplay;

        /***
         * 将节点node插入到referenceNode元素后
         * @param node newChild
         * @param referenceNode
         */
        function insertAfter(node, referenceNode) {
            if(!(node = $(node))){
                return false;
            }
            if(!(referenceNode = $(referenceNode))){
                return false;
            }
            //插入节点referenceNode.parentNode.insertBefore(newChild: T, refChild: Node | null)
            var flag = referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
            return flag;
        };
        window['ADS']['insertAfter'] = insertAfter;

        /**
         * 移除该节点同级节点
         * @param parent 父元素节点
         */
        function removeChildren(parent) {
            if(!(parent = $(parent))){
                return false;
            }

            //删除该元素子节点包括同级节点
            while(parent.firstChild){
                parent.firstChild.parentNode.removeChild(parent.firstChild);
            }

            //返回父元素，实现方法连缀
            return parent;
        };
        window['ADS']['removeChildren'] = removeChildren;

        /**
         * 添加新节点到该父节点下
         * @param parent
         * @param newChild
         */
        function prependChild(parent, newChild) {
            if(!(parent = $(parent))){
                return false;
            }
            if(!(newChild = $(newChild))){
                return false;
            }

            if(parent.firstChild){//如果存在节点，则在该节点之前添加
                parent.insertBefore(newChild, parent.firstChild);
            }else{ //如果该节点没有其余子节点，则直接添加
                parent.appendChild(newChild);
            }
            //返回父元素，实现方法连缀
            return parent;

        };
        window['ADS']['prependChild'] = prependChild;

        /**
         * 禁止打开默认事件。例如锚标签的href属性中的链接
         * @param e event 事件
         */
        function eventPreventDefault(e) {

            if(e.href){
                return false;
            }
        }
        window['ADS']['eventPreventDefault'] = eventPreventDefault;
        
        /*使用$    */
        function exampleLibMethod(obj) {
            if(!(obj = $(obj))){return false;}
            //对obj做其余操作
        }
        window['ADS']['exampleLibMethod'] = exampleLibMethod;
        
        
    }
)();