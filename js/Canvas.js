class Canvas {
    radius = 8
    //scale = localStorage.getItem("scale")+0;
    scale=1;
    /*blockList: Block[]
    ctx: any
    canvas: any
    nowBlock: Block*/
    createBlock (option) {
        option.hierarchy = this.blockList.length
        option.Canvas = this
        this.blockList.push(new Block(option))
        this.painting()

    }
    rendering (block) {

        this.ctx.fillStyle = block.color
        this.ctx.beginPath()
        //this.ctx.fillRect(block.x, block.y, block.w, block.h)
        this.ctx.arc(block.x,block.y,this.radius,0,2*Math.PI)
        this.ctx.fill()
        this.ctx.closePath()
    }
    specialrendering (block) {

        this.ctx.fillStyle = "#2eea2e"
        this.ctx.beginPath()
        //this.ctx.fillRect(block.x, block.y, block.w, block.h)
        this.ctx.arc(block.x,block.y,this.radius,0,2*Math.PI)
        this.ctx.fill();
        this.ctx.closePath()
    }
    painting () {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 清空画布
        //this.ctx.fillStyle = '#fff'
        //this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.blockList.forEach(ele => {
            this.rendering(ele)
        })
        this.specialrendering(this.blockList[this.blockList.length-1])
    }
    mousedownEvent (e) {
        // 点击事件
        const x = e.offsetX
        const y = e.offsetY
        // 获取点中里层级最高的色块
        this.nowBlock = (this.blockList.filter(ele => ele.checkBoundary(x, y))).pop()
        // 如果没有捕获的色块直接退出
        if (!this.nowBlock) return
        // 将点击到的色块层级提高到最高
        this.nowBlock.hierarchy = this.blockList.length
        document.getElementById("cur").innerText=`x:${(this.nowBlock.x/this.scale).toFixed(3)} and y:${(this.nowBlock.y/this.scale).toFixed(3)}`
        // 重新排序(从小到大)
        this.blockList.sort((a, b) => a.hierarchy - b.hierarchy)
        // 在重新从0开始分配层级
        this.blockList.forEach((ele, idx) => ele.hierarchy = idx)
        // 重新倒序排序后再重新渲染。
        this.painting()
        this.nowBlock.mousedownEvent(e)

    }
    checkIsInPoint(ev) {
        const x = ev.offsetX
        const y = ev.offsetY
        this.canvas.style.cursor="default";
        this.blockList.forEach(ele => {
            if (ele.checkBoundary(x, y)){
                this.canvas.style.cursor="pointer";
            }
         })
    }
    constructor (ele) {
        this.canvas = ele
        this.ctx = this.canvas.getContext('2d')
        this.blockList = []
        // 事件绑定
        this.canvas.addEventListener('mousedown', this.mousedownEvent.bind(this))
        this.canvas.addEventListener('mousemove', this.checkIsInPoint.bind(this))
    }
}
class Block {
    //scale = localStorage.getItem("scale")+0;
    scale=1;
    /*
    x: number
    y: number
    color: string
    Canvas: Canvas
    hierarchy: number*/
    constructor ({ x, y, color, Canvas, hierarchy }) {
        this.x = x*this.scale;
        this.y = y*this.scale;
        this.color = color
        this.Canvas = Canvas
        this.hierarchy = hierarchy
    }
    /*checkBoundary (x, y) {
        return x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h)
    }*/
    //当前的鼠标位置为x,y
    checkBoundary (x,y){
        const n = Math.abs(x - this.x);
        const s = Math.abs(y - this.y);
        return Math.sqrt(n * n + s * s) < 8
    }

    mousedownEvent (e) {
        const disX = e.offsetX - this.x
        const disY = e.offsetY - this.y
        document.onmousemove = (mouseEvent) => {
            this.x = mouseEvent.offsetX - disX
            this.y = mouseEvent.offsetY - disY

            this.Canvas.painting()
            document.getElementById("cur").innerText=`x:${(this.x/this.scale).toFixed(3)} and y:${(this.y/this.scale).toFixed(3)}`
        }
        document.onmouseup = () => {
            document.onmousemove = document.onmousedown = null
        }
    }
}

/*
var canvas = new Canvas(document.getElementById('canvas'))
canvas.createBlock({x: 0, y: 0, color: '#f00'});
canvas.createBlock({x: 120, y: 120, color: '#f00'});
canvas.createBlock({x: 130, y: 130,color: '#f00'});
canvas.createBlock({x: 140, y: 140, color: '#f00'});
canvas.createBlock({x: 150, y: 150,  color: '#f00'});
canvas.createBlock({x: 200, y: 200, color: '#f00'});*/
