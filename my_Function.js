/*
*author:ymx
*/
//attr可以是width，fontSize，borderWidth,opacity等
//startMove(oDiv,{height:500,width:500,opacity:50},fun)
        //fun是回调函数,传不传都可以
function startMove(obj,json,fn){
    //定时器与事件结合需要先清定时器
    clearInterval(obj.startMovetimer);

    obj.startMovetimer = setInterval(function(){
         //当前的样式与速度是会变化的，必须放在定时器里才能改变他的值，放在外面会到不了目标点
         var isStop = true;//所有目标点都已到达
         //循环json，同时改变多个属性
         for(var attr in json){
                
                var current = attr == 'opacity' ? parseInt(parseFloat(getStyle(obj,attr))*100) : parseInt(getStyle(obj,attr));
                speed = (json[attr] - current)/8;
                speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);

                    if(current != json[attr]){
                        isStop = false;
                    }
                    if(attr == 'opacity'){
                        obj.style.filter = 'alpha(opacity:'+(current + speed)+')';
                        obj.style.opacity = (current + speed)/100;
                    }
                    else{
                        obj.style[attr] = current + speed  + "px";
                    }
            }
            if(isStop){
                clearInterval(obj.startMovetimer);
                    if(fn){
                        fn();
                    }
            }
    },30);
}

//elasticMove(oDiv,50);
function elasticMove(obj,target){  
        clearInterval(obj.timer);
        obj.speed = 0;
        obj.timer = setInterval(function(){
            obj.speed +=  (target - obj.offsetLeft)/5;
            obj.speed =  obj.speed*0.7;
            // left += obj.speed;
            obj.style.left = obj.offsetLeft + obj.speed + 'px';
            if(Math.abs( obj.speed)<1 && Math.abs(obj.offsetLeft-target)<1){
                clearInterval(obj.timer);
                obj.style.left = target +'px';
            }
        },30);
}       
function shake(obj,method,fun){
    if(obj.pos){//存在就用存在的
        var pos = obj.pos;
    }
    else{
        var pos = parseInt(getStyle(obj,method));//这句有隐患
    }
    var arr = [];
    var num = 0;
    obj.shakeTimer = null;
    for(var i = 20;i>0;i-=2){
        arr.push(i,-i);
    }
    arr.push(0);
    clearInterval(obj.shakeTimer);
    obj.shakeTimer = setInterval(function(){
        obj.style[method]=pos+arr[num]+'px';
        num++;
        if(num===arr.length){
            clearInterval(obj.shakeTimer);
            fun&&fun();
        }
    },50);
}             
//获取obj的attr样式 getStyle(oDiv,'width')
//经过计算机计算之后的样式，是最终的展示出来的样式，可以用来获取非行间样式
//好像不可以用this
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,false)[attr];
    }
}
//通过类名获取元素，var aLi = getElementsByClassName(oUl,'swain');
function getElementsByClassName(parent,className){
    var aEls = parent.getElementsByTagName('*');
    var aResult = [];
    var re = new RegExp('\\b'+className+'\\b');//js风格，
    for( var i = 0;i<aEls.length;i++){
        if(re.test(aEls[i].className)){
            aResult.push(aEls[i]);
        } 
    }
        return aResult;
}
//判断value在数组arr中是否存在
function searchValue(arr,value){
    for(var i = 0;i<arr.length;i++){
        if(arr[i]==value)
            return i;//存在返回下标
        return -1;//不存在返回-1
    }
}
//给元素obj添加className
function addClass(obj,className){
    if(obj.className==''){
        obj.className = className;
    }
    else{
        //将obj元素的所有className以空格的方式劈成数组，数组名字为arrClassName
        var arrClassName = obj.className.split(' ');
        var _index = searchValue(arrClassName,className);
        //className原本就不存在
        if(_index==-1){
            obj.className += ''+className;
        }
    }
}
//给元素obj添加className
function removeClass(obj,className){
    //有className时
     if(obj.className!=''){
        var arrClassName = obj.className.split(' ');
        var _index = searchValue(arrClassName,className);
        //在存在的时候进行remove处理
        if(_index!=-1){
           arrClassName.splice(_index,1);//在arrClassName的_index下删除一个值
           obj.className = arrClassName.join('');
        }
    }
}
//判断字符串是否全部是数字
function isNumber(str){
    for(var i = 0;i<str.length;i++){
        if(str.charCodeAt(i)<48||str.charCodeAt(i)>57){
            return false;
        }
        else{
            return true;
        }
    }
}
function findStr(str,target){
    var arr = [];
    for(var i = 0;str.indexOf(target,i)!=-1;){
        arr.push(str.indexOf(target,i));
        i=str.indexOf(target,i)+target.length;
    }   
    return arr;
}
function ajax(url,funcSucc,funcFail){
    //创建一个ajax对象
    var oAjax = null;
    if(window.XMLHttpRequest){
        oAjax = new XMLHttpRequest();
    }
    else{
        oAjax = new ActiveXobject('Microsoft.XMLHTTP');
    }
    //连接服务器"/try/ajax/demo_get.php?t=" + Math.random()
    oAjax.open('GET',url+'?t='+new Date().getTime(),true);
    //发送请求
    oAjax.send();
    //接收返回
    oAjax.onreadystatechange = function(){
        if(oAjax.readyState == 4){
            if(oAjax.status == 200){
                 funcSucc(oAjax.responseText);
                //{
                //     //return oAjax.responseText;
                // }
            }
            else{
                if(funcFail){
                  funcFail(oAjax.status);
                }
                
            }
        }
    };

}
//数组去重
function elimateDup(arr){
    for(var i = 0;i<arr.length;i++){
        for(var j = i+1;j<arr.length;j++){
            if(arr[i]==arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
//字符串翻转
function strReverse(str){
        return str.split('').reverse().join('');
}
//获取元素到页面的绝对位置
//var p = getPos(oDiv);
//p.left;
//p.top;
function getPos(obj){
    var pos = {'left':0,'top':0};
    while(obj){
        pos.left += obj.offsetLeft;
        pos.top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return pos;  
}
//多个事件绑定的方法的封装(有问题)
function bind(obj,evName,fn){
    if(obj.addEventListener){
        obj.addEventListener(evName,fn,false);
    }
    else{
        obj.attachEvent('on'+evName,function(){
            fn.call(obj);
        });
    }
}
//生成新闻，在最前端插入
//insBefore(oLi,oUl);
function insBefore(element,parent){
    if(parent.children[0]){
        parent.insertBefore(element,parent.children[0]);
    }
    else{
        parent.appendChild(element);
    }
}
//拖拽的封装
//Drag(oImg);
function Drag(obj){
    obj.onmousedown = function(ev) {
        var ev = ev || event;
        
        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;
        //非标准ie下的全局捕获
        if ( obj.setCapture ) {
            obj.setCapture();
        }
        
        document.onmousemove = function(ev) {
            var ev = ev || event;
            var L =  ev.clientX - disX;
            var T =  ev.clientY - disY;
            /////////////////////////////////限制范围(可以删除，也可以设定为磁性吸附)/////////////////////////////////////
            if(L<0){
                L = 0;
            }else if(L>document.documentElement.clientWidth-obj.offsetWidth){
                L = document.documentElement.clientWidth-obj.offsetWidth;
            }
            if(T<0){
                T = 0;
            }else if(T>document.documentElement.clientHeight-obj.offsetHeight){
                T = document.documentElement.clientHeight-obj.offsetHeight;
            }
            /////////////////////////////////限制范围/////////////////////////////////////
            obj.style.left = L + 'px';
            obj.style.top = T + 'px';
        }
        
        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null;
            //释放全局捕获 releaseCapture();
            if ( obj.releaseCapture ) {
                obj.releaseCapture();
            }
        }
        //标准下阻止默认事件
        return false;
        
    }

}
//拖拽改变层大小
function dragAndChange(obj){
        obj.onmousedown = function(ev) {
        
        var ev = ev || event;
        
        var disW = this.offsetWidth;
        var disX = ev.clientX;
        var disL = this.offsetLeft;
        
        var b = '';
        
        if ( disX > disL + disW - 10 ) {
            //alert( 'right' );
            b = 'right';
        }
        if ( disX < disL + 10 ) {
            //alert( 'left' );
            b = 'left';
        }
        
        document.onmousemove = function(ev) {
            
            var ev = ev || event;
            
            switch( b ) {
                
                case 'left':
                    obj.style.width = disW - ( ev.clientX - disX ) + 'px';
                    obj.style.left = disL + ( ev.clientX - disX ) + 'px';
                    break;
                    
                case 'right':
                    obj.style.width = disW + ( ev.clientX - disX ) + 'px';
                    break;
                
            }
            
        }
        
        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null;
        }
        
        return false;
        
    }
    }
    //设置cookie的封装,有问题啊
    function setCookie(key,value,t){
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + t);
        document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
    }
    //取出cookie 有问题啊
    function getCookie(key){
        var arr1 = document.cookie.split('; ');
        for(var i = 0;i<arr1.length;i++){
            var arr2 = arr1[i].split('=');
            if(arr2[0]==key){
                return decodeURI(arr2[1]);
            }
        }
    }
    //清除cookie
    function removeCookie(key){
        setCookie(key,'',-1);
    }
//test