let $ = function (sel) {
    return document.querySelector(sel);
}
//select选择
function selected(sel) {
    var obj = sel//定位id
    var index = obj.selectedIndex; // 选中索引
    var text = obj.options[index].value; // 选中文本
    return text;
}
//仪表盘
function drawLine(my, day) {
    let myChart = echarts.init(my);
    let surplusDay = 80 - day;
    myChart.setOption({
        series: [{
            name: '',
            type: 'gauge',
            textStyle: {
                color: "#999",
                fontSize: 18
            },

            clockwise: true,
            axisLine: {            // 坐标轴线  
                lineStyle: {       // 属性lineStyle控制线条样式  
                    width: 12,
                    color: [[0.8, '#5D7CF2'], [1, '#dddddd']]
                }
            },
            axisLabel: {            // 坐标轴小标记
                show: false,
            },
            min: "0",
            max: "100",
            splitLine: { //分割线样式（及10、20等长线样式）
                length: 0,
                lineStyle: { // 属性lineStyle控制线条样式
                    width: 0
                }
            },
            axisTick: { //刻度线样式（及短线样式）
                length: 0
            },
            pointer: {
                width: 4, //指针的宽度
                length: "70%", //指针长度，按照半圆半径的百分比
            },
            detail: {
                formatter: '8/20',
                textStyle: {       // 其余属性默认使用全局文本样式
                    fontWeight: 'bolder',
                    fontSize: 18
                }
            },
            data: [{
                value: surplusDay
            }]
        }]

    });
}
//账号退出
function accountOut() {
    let userName = $("header .right .rRight");
    let out = $("header .right .rRight .out");
    userName.onclick = function (e) {
        e.stopPropagation();
        out.classList.toggle("hide");
    }
    document.onclick = function () {
        out.classList.add("hide");
    }
    out.onclick = function () {
        window.location.href = "http://www.yuqing.pro/Login.aspx"
    }
}
//分页跳转
class pageJump {
    constructor() {
        //上一页
        this.pageTop = $(".page .pageIndex .icon-zuo");
        //分页输入框
        this.pageIpt = $(".page .go input");
        //下一页
        this.pageBtm = $(".page .pageIndex .icon-you")
        //总数
        this.total = $(".page .total #total");
        //当前页码
        this.pageIndex = 1;
        //当前页条目数
        this.pageSize = 10;
        //条目数选择
        this.pageSel = $(".page #pageSize");
        //页数展示
        this.pageList = $(".page .pageIndex #pageIndex");
        //总页数
        this.brrNum = 0;
        //最多一次展示分页数
        this.maxNum = 0;
    }
    init() {
        if (this.pageBtm) {
            this.getList();
            this.bindEvent();
        }
    }
    bindEvent() {
        this.pageIpt.addEventListener("blur", this.getPageList.bind(this), false);
        this.pageTop.addEventListener("click", this.getPageTop.bind(this), false);
        this.pageBtm.addEventListener("click", this.getpageBtm.bind(this), false);
        this.pageList.addEventListener("click", this.pageIndexChange.bind(this), false);
        this.pageSel.addEventListener("change", this.pageSizeChange.bind(this), false)
    }
    //切换页码
    pageIndexChange(e) {
        var e = e || window.event;
        var tar = e.target || e.srcElement;
        if (tar.nodeName == "A") {
            this.pageIndex = tar.innerHTML;
            window.location.hash = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
            this.getList();
        }
    }
    //切换页数
    pageSizeChange() {
        this.pageIndex = 1;
        this.pageSize = selected(this.pageSel) * 1;
        window.location.hash = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
        this.getList();
    }
    //上一页
    getPageTop() {
        this.pageIpt.value = this.pageIpt.value * 1 - 1;
        this.pageChange();
    }
    //下一页
    getpageBtm() {
        this.pageIpt.value = this.pageIpt.value * 1 + 1;
        this.pageChange();
    }
    //获取列表
    getPageList() {
        this.pageChange();
    }
    pageChange() {
        if (this.pageIndex == this.pageIpt.value) {
            return;
        }
        this.pageIndex = this.pageIpt.value * 1;
        if (this.pageIndex < 1) {
            this.pageIndex = 1;
        }
        if (this.pageIndex > this.brrNum * 1) {
            this.pageIndex = this.brrNum * 1;
        }
        this.pageIpt.value = this.pageIndex;
        window.location.hash = `pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
        this.getList();
    }
    getList() {
        if (window.location.hash) {
            this.pageIndex = window.location.hash.split("&")[0].split("=")[1] * 1;
            this.pageSize = window.location.hash.split("&")[1].split("=")[1] * 1;
            this.pageIpt.value = this.pageIndex;
            this.pageSel.querySelectorAll("option").forEach((x, i) => {
                if (x.value == this.pageSize) {
                    this.pageSel.selectedIndex = i;
                }
            })
        }
        //分页总条目
        this.total.innerHTML = 700;
        //最多展示分页数
        this.maxNum = 7;
        //左右显示数量
        this.leftNum = parseInt(this.maxNum / 2);
        //保存总条目数
        var len = this.total.innerHTML;
        //一页展示多少条
        var num = this.pageSize;
        //求页码数
        this.brrNum =
            len % num === 0 ? len / num : Math.floor(len / num + 1);
        //拼接翻页标签
        let htm = ``;
        //总页码数大于最大展示页码数
        if (this.brrNum > this.maxNum) {
            //当前页码 + 其左侧可显示页码数 大于 总页码数 （一般为最后一页）
            if (this.pageIndex + this.leftNum > this.brrNum) {
                for (let i = this.brrNum - this.maxNum + 1; i <= this.brrNum; i++) {
                    htm += `<a href="javascript:;">${i}</a>`
                }
            } else {
                //页码数大于左右显示页码数（一般为第二页到倒数第二页）
                if (this.pageIndex > this.leftNum) {
                    for (let i = this.pageIndex - this.leftNum; i <= this.pageIndex + this.leftNum; i++) {
                        htm += `<a href="javascript:;">${i}</a>`
                    }
                } else {
                    //页码数小于左右显示页码数（一般为第一页）
                    for (let i = 1; i <= this.maxNum; i++) {
                        htm += `<a href="javascript:;">${i}</a>`
                    }
                }
            }
        } else {
            //总页码数小于等于最大展示页码数
            for (let i = 1; i <= this.brrNum; i++) {
                htm += `<a href="javascript:;">${i}</a>`
            }
        }
        this.pageList.innerHTML = htm;
        let aLen = this.pageList.querySelectorAll("a").length;
        if (this.pageIndex + this.leftNum > this.brrNum) {
            let index = this.pageIndex * 1 + aLen - 1 - this.brrNum;
            this.pageList.querySelectorAll("a")[index].classList.add("active");
        } else {
            if (this.pageIndex > this.leftNum) {
                this.pageList.querySelectorAll("a")[this.leftNum].classList.add("active");
            } else {
                this.pageList.querySelectorAll("a")[this.pageIndex - 1].classList.add("active");
            }
        }
    }
}
//设置页面
class set {
    constructor() {
        //仪表盘
        this.echart = $("section .setCon .conTop .Topright .topLeft #echart");
        //剩余天数
        this.surplusDay;
    }
    init() {
        if (this.echart) {
            this.echartInit();
        }
    }
    echartInit() {
        this.show_time();
        drawLine(this.echart, this.surplusDay);
    }
    //显示时间函数
    show_time() {
        //当前时间
        var time_now_server,
            time_now_client,
            //结束时间
            time_end,
            //时间差
            time_server_client,
            timerID;
        //结束时间
        time_end = new Date("2019/08/20");
        time_end = time_end.getTime();
        //开始的时间:如果不填入时间日期默认为当前的日期时间
        time_now_server = new Date;
        time_now_server = time_now_server.getTime();
        time_now_client = new Date();
        time_now_client = time_now_client.getTime();
        //时间差
        time_server_client = time_now_server - time_now_client;
        //剩余天数
        var timer = $("section .setCon .conTop .Topright .topRight .trTOP span");
        if (!timer) {
            return;
        }
        timer.innerHTML = time_server_client;
        var time_now, time_distance, str_time;
        var int_day, int_hour, int_minute, int_second;
        var time_now = new Date();
        time_now = time_now.getTime() + time_server_client;
        time_distance = time_end - time_now;
        if (time_distance > 0) {
            int_day = Math.floor(time_distance / 86400000)
            str_time = time_distance % 86400000 == 0 ? int_day : int_day + 1;
            timer.innerHTML = str_time;
            this.surplusDay = str_time;
        } else {
            timer.innerHTML = timer.innerHTML;
            clearTimeout(timerID)
        }
    }
}
//新建任务
class newTask {
    constructor() {
        //是否霸屏开关
        this.switch = $("section .newCON .ConBtm .detailTOP .lie .right .switch");
        //网址输入框
        this.webUrl = $("section .new .search input");
        //网址搜索
        this.webSeach = $("section .new .search .btn");
        //loading
        this.loading = $("section .new .loading");
        //搜索结果
        this.newCON = $("section .newCON");
        //搜索前
        this.newDiv = $("section .new");
        //表格列表
        this.tableList = $("section .newCON .detailTOP #tableList");
        //预 览
        this.preview = $("section .newCON .detailTOP .detailCon .yulan #preview");
        //返回
        this.back = $("section .newCON .detailTOP .detailCon .yulan #back");
        //开始任务
        this.start = $("section .newCON .detailTOP .detailCon .yulan #start");
        //任务成功提示框
        this.prompt = $("#prompt");
        //总点赞数
        this.sumGiveLove = $("section .newCON .detailTOP #tableList #sumGiveLove");
        //当前选中的
        this.index = 0;
        //当前取消的值
        this.removeCon = 0;
        //存储选中的表格内容
        this.tabArr = [];
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        if (this.switch) {
            //是否霸屏
            this.switch.addEventListener("click", this.switchOpen.bind(this), false);
            //
            this.webSeach.addEventListener("click", this.SeachDetail.bind(this), false);
            //新建任务表格选择
            this.tableList.addEventListener("click", this.tabSelect.bind(this), false);
            //预 览
            this.preview.addEventListener("click", this.tabPreview.bind(this), false);
            //返回
            this.back.addEventListener("click", this.tabBack.bind(this), false);
            //开始任务
            this.start.addEventListener("click", this.tabStart.bind(this), false);
            //点赞平分
            this.sumGiveLove.addEventListener("blur", this.divideThe.bind(this), false);
        }
    }
    //平分点赞数
    divideThe() {
        let sum = this.sumGiveLove.value * 1;
        this.sumGiveLove.value = sum;
        let loveList = this.tableList.querySelectorAll("tr td input");
        let arr = [];
        loveList.forEach((x, i) => {
            if (i != 0) {
                arr.push(x)
            }
        })
        let zan = sum % arr.length == 0 ? sum / arr.length : Math.floor(sum / arr.length) + 1;
        arr.forEach((x, i) => {
            if (zan * (i + 1) > sum) {
                x.value = zan;
                arr[i].value = sum - zan * i;
                if (arr[i].value < 0) {
                    arr[i].value = 0;
                }
            } else {
                x.value = zan;
            }
        })
    }
    //求点赞数和
    divideSum() {
        let loveList = this.tableList.querySelectorAll("tr td input");
        let arr = [];
        loveList.forEach((x, i) => {
            if (i != 0) {
                arr.push(x)
            }
        })
        let sum = 0;
        arr.forEach((x) => {
            sum += x.value * 1;
        })
        this.sumGiveLove.value = sum;
    }
    //预览
    tabPreview() {
        this.preview.classList.add("hide");
        this.back.classList.remove("hide");
        let loveList = this.tableList.querySelectorAll("tr td span.icon-weixuanzhong");
        loveList.forEach((x) => {
            x.parentNode.parentNode.classList.add("hide");
        })
    }
    //返回
    tabBack() {
        this.preview.classList.remove("hide");
        this.back.classList.add("hide");
        let loveList = this.tableList.querySelectorAll("tr td span.icon-weixuanzhong");
        loveList.forEach((x) => {
            x.parentNode.parentNode.classList.remove("hide");
        })
    }
    //开始任务
    tabStart() {
        this.prompt.classList.remove("hide");
        setTimeout(() => {
            this.prompt.classList.add("hide");
        }, 800)
    }
    //霸屏开关
    switchOpen() {
        this.switch.classList.toggle("switch-on");
        this.tableList.classList.toggle("switch-on");
        let list = this.tableList.querySelectorAll("tr td.last");
        list.forEach((x) => {
            x.classList.toggle("hide");
        })

    }
    //详情搜索
    SeachDetail() {
        if (this.loading.getAttribute("class") == 'loading') {
            return false;
        }
        let urlstr = this.webUrl.value.trim();
        if (urlstr != "") {
            this.loading.classList.remove("hide");
            this.newCON.classList.add("hide");
            this.newDiv.classList.add("newSearch");
            //搜索中模拟
            setTimeout(() => {
                this.loading.classList.add("hide");
                this.newCON.classList.remove("hide");
                this.newDiv.classList.remove("newSearch");
            }, 500)
        }
    }
    //取消
    conIndexChange() {
        let spanList = this.tableList.querySelectorAll("tr td .num");
        this.index = spanList.length;
        spanList.forEach((x, i) => {
            if (x.innerHTML > this.removeCon) {
                x.innerHTML = x.innerHTML * 1 - 1;
            }
        })
    }
    tabSelect(e) {
        var e = e || window.event;
        var tar = e.target || e.srcElement;
        let _this = this;
        if (tar.nodeName == "SPAN" && tar.classList.contains("iconfont")) {
            tar.classList.toggle("icon-xuanzhong1")
            tar.classList.toggle("icon-weixuanzhong")
            //点赞
            let loveTd = tar.parentNode.parentNode.querySelectorAll("td")[4];
            //跟评
            let conTd = tar.parentNode.parentNode.querySelectorAll("td")[1];
            //跟评内容
            let conHtm = conTd.innerHTML;
            if (tar.classList.contains("icon-xuanzhong1")) {
                //点赞输入框
                let htm = `<input type="text" value='0'>`;
                loveTd.innerHTML = htm;
                loveTd.querySelector('input').oninput = function () {
                    this.value = this.value.replace(/[^\d]/g, '') * 1;
                    _this.divideSum();
                }
                this.index = this.index + 1;
                conTd.innerHTML = `<span class='num'>${this.index}</span>${conHtm}`
                let idHtm = tar.parentNode.parentNode;
                //存储选中的html
                this.tabArr.push(idHtm)
            } else if (tar.classList.contains("icon-weixuanzhong")) {
                this.removeCon = conTd.querySelector("span").innerHTML * 1;
                loveTd.innerHTML = "";
                conTd.querySelector("span").remove();
                this.conIndexChange();
                //移除选中的html
                this.tabArr.forEach((x, i) => {
                    if (x == tar.parentNode.parentNode) {
                        this.tabArr.splice(i, 1);
                    }
                })
            }
            this.divideSum();
        }
    }
}
//任务管理详情
class taskdetail {
    constructor() {
        //状态选择
        this.stateSelect = $("section .ConBtm .right .btnRight");
        //状态选项
        this.stateOption = $("section .ConBtm .right .btnRight .show");
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        if (this.stateSelect) {
            this.stateSelect.addEventListener("click", this.stateChange.bind(this), false);
        }
    }
    //状态改变切换
    stateChange(e) {
        let stateSelected = this.stateSelect.querySelector(".t1");
        var e = e || window.event;
        var tar = e.target || e.srcElement;
        this.stateOption.classList.toggle("showhide");
        if (tar.nodeName == "DIV" && tar.getAttribute("class") == 'lie') {
            let htm = tar.innerHTML;
            if (tar.innerHTML.trim() == '终止') {
                stateSelected.innerHTML = `${htm}`;
                this.stateSelect.querySelector(".t1").classList.add('no')
            } else {
                stateSelected.innerHTML = `${htm}<span class="iconfont icon-xia"></span>`;
            }
        }
    }

}
window.onload = function () {
    //账号退出
    accountOut();
    //分页跳转
    new pageJump().init();
    //设置
    new set().init();
    //新建任务
    new newTask().init();
    //任务详情
    new taskdetail().init();
}