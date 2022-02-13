//核心思想：pic与dot一起刷新！

var canvas, context;
/*var showTips = null, originalPos = null;*/
var img, imgX = 0, imgY = 0, imgScale = 1, scaleRate = 1;
var MINIMUM_SCALE = 1 ,pos={},posl={},dragging = false;
let flag;
let current;
let textarea = document.getElementById("textarea");
let p_info = document.getElementById("p_info");
const input1 = document.getElementById("upload");

if(typeof FileReader==='undefined'){
    alert("抱歉，您的浏览器不支持 FileReader,请尝试更换浏览器");
    input1.setAttribute('disabled','disabled');
}else{
    input1.onclick=function (){
        if(sessionStorage.getItem("isRead")==="false"){
            alert("请先上传JSON数据文件")
            return false;
        }
    }
    input1.addEventListener('change',readFile,false);
}


function readFile(){
    if(sessionStorage.getItem("isRead")==="false"){
        alert("请先上传JSON数据文件")
        return false;
    }
    const file = this.files[0];//获取上传文件列表中第一个文件
    if(!/image\/\w+/.test(file.type)){
        //图片文件的type值为image/png或image/jpg
        alert("文件必须为图片！");
        return false; //结束进程
    }
    const reader = new FileReader();//实例一个文件对象
    reader.readAsDataURL(file);//把上传的文件转换成url
    //当文件读取成功便可以调取上传的接口
    reader.onload = function(e){
        let scale = 0;
        img = new Image();
        // 设置src属性
        img.src = this.result;
        canvas = document.getElementById('canvas_pic'); //画布对象
        //canvasdot = document.getElementById('canvas_dot');

        context = canvas.getContext('2d');//画布显示二维图片
        //ctx = canvasdot.getContext('2d');
        var initWidth = 0, initHeight = 0
        loadImgs();
        canvasEventsInits();
        tabInits();
        textarea.oninput = function (ev){
            if(current!==undefined){
                let obj = JSON.parse(textarea.value.toString());
                window.localStorage.setItem(current+"", JSON.stringify({...obj,isChecked:true}));
                drawImages();
            }
        }

        chartAppendOne();
        chartAppendTwo();
        chartAppendThree();

        chartInitsOne();
        chartInitsTwo();
        chartInitsThree();

    }

};

function loadImgs() {
    //img = new Image();
    img.onload = function () {
        if(img.width>=img.height){
            scaleRate = img.width/canvas.width;//让长宽保持相同缩放比例
            //MINIMUM_SCALE = canvas.width/img.width;
            initWidth = img.width * scaleRate;
            initHeight = img.height * scaleRate;
        }else{
            scaleRate = img.height/canvas.height;//让长宽保持相同缩放比例
            //MINIMUM_SCALE = canvas.width/img.width;
            initWidth = img.width * scaleRate;
            initHeight = img.height * scaleRate;
        }

        console.log("initWidth=" + initWidth + ",initHeight=" + initHeight + ", scaleRate=" + scaleRate);
        drawImages();

        //imgScale = scaleRate;
    }
    //img.src = 'https://static.zhihu.com/liukanshan/images/comics/bg-89c9bdc3.jpg';
    /*img.src = './qqqqqq.jpg'*/
}

function drawImages() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 保证  imgX  在  [img.width*(1-imgScale),0]   区间内
    ///**
    if(imgX<img.width*(1-imgScale) /scaleRate) {
        imgX = img.width*(1-imgScale)/scaleRate ;
    }else if(imgX>0) {
        imgX=0
    }
    // 保证  imgY   在  [img.height*(1-imgScale),0]   区间内
    if(imgY<img.height*(1-imgScale)/scaleRate) {
        imgY = img.height*(1-imgScale)/scaleRate;
    }else if(imgY>0) {
        imgY=0
    }
    context.shadowBlur=3;
    context.shadowColor="black";
    context.shadowOffsetX=2;
    context.shadowOffsetY=2;

    context.drawImage(
        img, //规定要使用的图像、画布或视频。
        0, 0, //开始剪切的 xy 坐标位置。
        initWidth, initHeight,  //被剪切图像的高度。
        //img.width,img.height,

        imgX, imgY,//在画布上放置图像的 x 、y坐标位置。
        img.width * imgScale, img.height * imgScale  //要使用的图像的宽度、高度
        //1700,1200
    );
    for(var i = 0; i< window.localStorage.length; i++){
        var key = window.localStorage.key(i);

        var pp = JSON.parse(window.localStorage.getItem(key));
        if(pp.isChecked===true){
            makeCircle(context, pp.center.x, pp.center.y, false,true);
        }else {
            makeCircle(context, pp.center.x, pp.center.y, false,false);
        }
    }

}


function canvasEventsInits() {
    canvas.onmousedown = function (event) {
        let tmpx;
        let tmpy;
        flag=false;
        for(let i = 0; i< window.localStorage.length; i++){
            //const key = window.localStorage.key(i);
            const pp = JSON.parse(window.localStorage.getItem(i+""));
            //makeCircle(context, pp.x, pp.y, false);
            posq = windowToCanvas(event.clientX, event.clientY);
            tmpx=(pp.center.x/img.width*(img.width*imgScale) + imgX*scaleRate)/scaleRate;
            tmpy=(pp.center.y/img.height*(img.height*imgScale) + imgY*scaleRate)/scaleRate;

            if(checkBoundarys(tmpx,tmpy,posq.x,posq.y)){
                flag=true;
                console.log(flag);
                for(let j=0;j<window.localStorage.length;j++){
                    const qq = JSON.parse(window.localStorage.getItem(j+""));
                    if(qq.isChecked===true){
                        window.localStorage.setItem(j+"", JSON.stringify({...qq,isChecked:false}));
                    }
                }
                //window.localStorage.setItem(i+"", JSON.stringify({x: pp.x, y: pp.y,isChecked:true}));
                window.localStorage.setItem(i+"", JSON.stringify({...pp,isChecked:true}));
                current=i;

                //p_info = document.getElementById("p_info")
                /*p_info.innerHTML="<p>厂商：</p>\n" +
                    "                        <p>品牌：</p>\n" +
                    "                        <p>品名：</p>\n" +
                    "                        <p>行：</p>\n" +
                    "                        <p>列：</p>"*/
                p_info.innerHTML=`<p>厂商：<b>${pp.company}</b></p><p>品牌：<b>${pp.brand}</b></p><p>品名：<b>${pp.category}</b></p><p>行：<b>${pp.row+1}</b></p><p>列：<b>${pp.col+1}</b></p>`
                //textarea = document.getElementById("textarea")
                //textarea.innerText=`${JSON.stringify(pp)}`
                textarea.value=`{
  "center": {
    "x": ${pp.center.x},
    "y": ${pp.center.y}
  },
  "row": ${pp.row},
  "col": ${pp.col},
  "category": "${pp.category}",
  "brand": "${pp.brand}",
  "company": "${pp.company}",
  "case_bar_code": ""
}`
                drawImages();
                break;
            }
        }
        if(flag===false){
        /*if(showTips == null){*/
            dragging = true;
            pos = windowToCanvas(event.clientX, event.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标
            //console.log(pos)
        //}
        }

        //console.log(pos);
    };
    canvas.onmousemove = function (evt) {  //移动

        if(flag){
            var p = windowToCanvas (evt.clientX, evt.clientY);
            const tmpp = JSON.parse(window.localStorage.getItem(current+""));
            window.localStorage.setItem(current+"", JSON.stringify({...tmpp,center:{...tmpp.center,x:(Math.abs(imgX) + Math.abs(p.x))/imgScale*scaleRate,y: (Math.abs(imgY) + Math.abs(p.y))/imgScale*scaleRate},isChecked:true}));
            //window.localStorage.setItem(current+"", JSON.stringify({x: (Math.abs(imgX) + Math.abs(p.x))/imgScale, y: (Math.abs(imgY) + Math.abs(p.y))/imgScale,isChecked:true}));
            //makeCircle(context, (Math.abs(imgX) + Math.abs(p.x))/imgScale, (Math.abs(imgY) + Math.abs(p.y))/imgScale, false,true);
            textarea.value=`{
  "center": {
    "x": ${tmpp.center.x},
    "y": ${tmpp.center.y}
  },
  "row": ${tmpp.row},
  "col": ${tmpp.col},
  "category": "${tmpp.category}",
  "brand": "${tmpp.brand}",
  "company": "${tmpp.company}",
  "case_bar_code": ""
}`

            drawImages();
        }

            if(dragging){
                posl = windowToCanvas(evt.clientX, evt.clientY);

                var x = posl.x - pos.x, y = posl.y - pos.y;
                //console.log("dx"+x,"dy"+y);
                imgX  += x;
                imgY  += y;
                pos = JSON.parse(JSON.stringify(posl));

                //document.body.style.cursor = 'Handle';
                drawImages();  //重新绘制图片
            }/*else{
                pos3 = windowToCanvas(evt.clientX, evt.clientY);
                //console.log("pos=" + pos3.x + "," + pos3.y + "; ");
                if(context.isPointInPath(pos3.x, pos3.y)){
                    console.log("进入区域");
                }
            }*/
    };
    canvas.onmouseup = function (evt) {

            dragging = false;
            if(flag===true){
                flag=false;
            }

        //document.body.style.cursor = 'default';
    };

    window.onmouseup=function (evt){
        ppp = windowToCanvas(evt.clientX, evt.clientY);
        if(ppp.x>canvas.width||ppp.x<0||ppp.y>canvas.height||ppp.y<0){
            dragging = false;
        }
    }


    canvas.onmousewheel = canvas.onwheel = function (event) {    //滚轮放大缩小
        event.preventDefault();
        var pos = windowToCanvas (event.clientX, event.clientY);
        event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
        var newPos = {x:((pos.x-imgX)/imgScale).toFixed(2) , y:((pos.y-imgY)/imgScale).toFixed(2)};
        //console.log("newPos==========" + newPos.x + "," + newPos.y)
        if (event.wheelDelta > 0) {// 放大
            imgScale +=0.1;
            imgX = (1-imgScale)*newPos.x+(pos.x-newPos.x);
            imgY = (1-imgScale)*newPos.y+(pos.y-newPos.y);
        } else {//  缩小
            imgScale -=0.1;
            if(imgScale<MINIMUM_SCALE) {//最小缩放1
                imgScale = MINIMUM_SCALE;
            }
            imgX = (1-imgScale)*newPos.x+(pos.x-newPos.x);
            imgY = (1-imgScale)*newPos.y+(pos.y-newPos.y);
            //console.log(imgX,imgY);
        }
        //console.log("wheel.imgY = " + imgY);
        drawImages();   //重新绘制图片

    };
    canvas.ondblclick = function(event){
        console.log("双击：鼠标坐标【"  + (event.clientX + "," + event.clientY) + "】图片左上角坐标【" +imgX + "," +imgY + "】" +
            "图片比例尺【" + scaleRate + "】 缩放比例【" +imgScale+"】分辨率【" +img.width + "X" + img.height +"】");

        var p = windowToCanvas (event.clientX, event.clientY);
        makeCircle(context, (Math.abs(imgX) + Math.abs(p.x))/imgScale*scaleRate, (Math.abs(imgY) + Math.abs(p.y))/imgScale*scaleRate, true,false);
        console.log(" 距离画布边框【" +p.x + "  " + p.y+"】");
        //console.log((Math.abs(Math.abs(imgX) - event.clientX)) + "@@@" + (Math.abs(Math.abs(imgY) -event.clientY)));

    }
}

function tabInits(){
    let tab_row = document.getElementById("tab_row");
    let tab_company = document.getElementById("tab_company");
    let tab_brand = document.getElementById("tab_brand");
    let tab_nums = document.getElementById("tab_nums");
    let tab_sku = document.getElementById("tab_sku");

    tab_row.innerText = sessionStorage.getItem("row")+"行";
    tab_company.innerText = sessionStorage.getItem("company")+"个";
    tab_brand.innerText = sessionStorage.getItem("brand")+"个";
    tab_nums.innerText = sessionStorage.getItem("nums")+"盒";
    tab_sku.innerText = sessionStorage.getItem("sku")+"种";
}

function chartAppendOne(){
    const companyHeight = sessionStorage.getItem("company")*40;

    let wrapperOne = document.getElementById("wrapperOne");
    wrapperOne.innerHTML="<div style=\"width: 1200px;height: 20px\"></div>\n" +
        "    <div style=\"height: 400px;width: 1200px;margin:0 auto;overflow-y: auto;background: #eceef3\">\n" +
        "        <div id=\"containerOne\" style=\"width: 1000px;margin: 25px auto 25px auto;height:"+ companyHeight +"px;background: white;\"></div>\n" +
        "    </div>"
}

function chartAppendTwo(){

    const brandHeight = sessionStorage.getItem("brand")*40;
    let wrapperTwo = document.getElementById("wrapperTwo");
    wrapperTwo.innerHTML="<div style=\"width: 1200px;height: 20px\"></div>\n" +
        "    <div style=\"height: 400px;width: 1200px;margin:0 auto;overflow-y: auto;background: #eceef3\">\n" +
        "        <div id=\"containerTwo\" style=\"width: 1000px;margin: 25px auto 25px auto;height:"+ brandHeight +"px;background: white;\"></div>\n" +
        "    </div>"
}

function chartAppendThree(){

    const skuHeight = sessionStorage.getItem("sku")*40;
    let wrapperTwo = document.getElementById("wrapperThree");
    wrapperTwo.innerHTML="<div style=\"width: 1200px;height: 20px\"></div>\n" +
        "    <div style=\"height: 400px;width: 1200px;margin:0 auto;overflow-y: auto;background: #eceef3\">\n" +
        "        <div id=\"containerThree\" style=\"width: 1000px;margin: 25px auto 25px auto;height:"+ skuHeight +"px;background: white;\"></div>\n" +
        "    </div>"
}


function chartInitsOne(){
    const dom = document.getElementById("containerOne");
    const myChart = echarts.init(dom);
    let option;

    option = {
        title: {
            text: '厂商上柜率',
            subtext: '按从高到低顺序排列',
            left: 'center'
        },

        dataset: {

        },


        grid: {
            bottom:'-0.1%',
            containLabel: true
        },
        xAxis: { type:'value', name: 'amount' ,axisLabel:{formatter:'{value}%'}},
        yAxis: { type: 'category' ,axisTick:{show:false}},

        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "product" column to Y axis
                    y: 'product'
                },
                barWidth:20,
                barCategoryGap: "15%",
                label:{
                    show:true,
                    position:"right",
                    formatter: function (value) {
                        return value.data.amount+'%'
                    }
                }
            }
        ]
    };


    let obj_tmp = JSON.parse(sessionStorage.getItem("company_map"));
    let arr=[];
    for(const key in obj_tmp){
        let obj = {product:key,amount:obj_tmp[key]};
        arr.push(obj);
    }
    option.dataset.source=arr;

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}

function chartInitsTwo(){
    const dom = document.getElementById("containerTwo");
    const myChart = echarts.init(dom);
    ///var app = {};

    let option;

    option = {
        title: {
            text: '品牌上柜率',
            subtext: '按从高到低顺序排列',
            left: 'center'
        },

        dataset: {
        },


        grid: {
            /*left: '3%',
            right: '4%',
            bottom: '3%',*/
            bottom:'-0.1%',
            containLabel: true
        },
        xAxis: { type:'value', name: 'amount' ,axisLabel:{formatter:'{value}%'}},
        yAxis: { type: 'category' ,axisTick:{show:false}},

        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "product" column to Y axis
                    y: 'product'
                },
                barWidth:20,
                barCategoryGap: "15%",
                label:{
                    show:true,
                    position:"right",
                    formatter: function (value) {
                        return value.data.amount+'%'
                    }
                }
            }
        ]
    };

    let obj_tmp = JSON.parse(sessionStorage.getItem("brand_map"));
    let arr=[];
    for(const key in obj_tmp){
        let obj = {product:key,amount:obj_tmp[key]};
        arr.push(obj);
    }
    option.dataset.source=arr;

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}

function chartInitsThree(){
    const dom = document.getElementById("containerThree");
    const myChart = echarts.init(dom);
    ///var app = {};

    let option;

    option = {
        title: {
            text: '规格上柜率',
            subtext: '按从高到低顺序排列',
            left: 'center'
        },

        dataset: {
        },


        grid: {
            /*left: '3%',
            right: '4%',
            bottom: '3%',*/
            bottom:'-0.1%',
            containLabel: true
        },
        xAxis: { type:'value', name: 'amount' ,axisLabel:{formatter:'{value}%'}},
        yAxis: { type: 'category' ,axisTick:{show:false}},

        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "product" column to Y axis
                    y: 'product'
                },
                barWidth:20,
                barCategoryGap: "15%",
                label:{
                    show:true,
                    position:"right",
                    formatter: function (value) {
                        return value.data.amount+'%'
                    }
                }
            }
        ]
    };

    let obj_tmp = JSON.parse(sessionStorage.getItem("sku_map"));
    let arr=[];
    for(const key in obj_tmp){
        let obj = {product:key,amount:obj_tmp[key]};
        arr.push(obj);
    }
    option.dataset.source=arr;

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}

/*坐标转换*/
function windowToCanvas(x,y) {
    var box = canvas.getBoundingClientRect();
    //console.log( "x=" + (x - box.left - (box.width - canvas.width) / 2) + ",y=" + (y - box.top - (box.height - canvas.height) / 2));
    //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
    return {
        x: x - box.left - (box.width - canvas.width) / 2,
        y: y - box.top - (box.height - canvas.height) / 2
    };
}

function windowToC2(x,y){
    var box = canvas.getBoundingClientRect();
    //console.log( "x=" + (x - box.left - (box.width - canvas.width) / 2) + ",y=" + (y - box.top - (box.height - canvas.height) / 2));
    //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
    return {
        x: x - box.left,
        y: y - box.top
    };
}


function checkBoundarys (ppx,ppy,x,y){
    const n = Math.abs(x - ppx);
    const s = Math.abs(y - ppy);
    //console.log(Math.sqrt(n * n + s * s))
    return Math.sqrt(n * n + s * s) < 8
}


function makeCircle(context, posX, posY, isCreate,isChecked){
    var resetX = (posX/img.width*(img.width*imgScale) + imgX*scaleRate)/scaleRate;
    var resetY = (posY/img.height * (img.height * imgScale) + imgY*scaleRate)/scaleRate;
    context.beginPath();//这里可以理解为另外起笔，如果忽略这个步骤那么下面的样式就会继承上面的，所以最好不要忽略

    //context.fillStyle = 'red';//渐变填充样式
    if(isChecked){
        context.shadowBlur=3;
        context.shadowColor="black";
        context.shadowOffsetX=2;
        context.shadowOffsetY=2;
        context.fillStyle = 'rgba(255,0,0,0.9)';//渐变填充样式
    }else {
        context.shadowBlur=3;
        context.shadowColor="black";
        context.shadowOffsetX=2;
        context.shadowOffsetY=2;
        context.fillStyle = 'rgba(76,255,77,0.96)';//渐变填充样式
    }
    context.lineWidth = 2;//定义线性的线宽，宽是从圆圈向内外两边同时加粗的
    context.arc(resetX,  resetY,  12 * (imgScale>1?0.5:0.5/*imgScale*/),0,2*Math.PI);//定义圆[这五个参数分别是（横坐标，纵坐标，半径，起始的点(弧度)，结束的点(弧度)）]
    //context.closePath();
    //context.globalAlpha = 0.1;
    context.fill();//定义圆为面性即圆面
    //console.log("resetX:"+resetX,resetY);
    //context.stroke();//只有加上这行才有边框
    //context.restore();

    if(isCreate){
        const cur = window.localStorage.length;
        //window.localStorage.setItem(posX+"_" + posY, JSON.stringify({x: posX, y: posY}));
        window.localStorage.setItem(cur+"", JSON.stringify({center:{x:posX,y:posY},row:0,col:0,category:"",brand:"",company:"",case_bar_code:"",isChecked:false}));
        //window.localStorage.setItem(cur+"", JSON.stringify({x: posX, y: posY,isChecked:false}));
    }

}