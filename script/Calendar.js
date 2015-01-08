/**
 * Created by mich on 15-1-7.
 */
//日历
CALENDAR = function(){
    this.CURRENT_DATE = new Date();
    this.cells = [];
    this.monthcells = [];
    this.yearcells = [];
    this._mode = 0;//0 : 日历月视图   1：月份选择  (操作)　　２：年份选择
    var _this = this;

    //初始化日历数据结构
    for (var r = 0; r < DAYCELL.ROW; r++) {
        this.cells[r] = [];
        for (var c = 0; c < DAYCELL.COL; c++) {
            this.cells[r][c] = new DAYCELL(this,r, c).render($('.daily'));
        }
    }
    var WEEK = ['日', '一', '二', '三', '四', '五', '六'];
    for (var i = 0; i < WEEK.length; i++) {
        new DAYCELL(this,0, i).render($('.dailyHeader')).setTxt(WEEK[i]);
    }


    //事件
    $('.daily').delegate('.day', 'click', function () {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            //切换当前月份
            _this.initMonthView($(this).data('cell').d);
            return;
        }
        $this.toggleClass('selected');
        console.log($(this).data('cell').d);
    });

    $('#opt > .pre').click(function(){
        switch (_this._mode){
            case 0:
                _this.initMonthView(_this.CURRENT_DATE.DateSub('m',1));
                break;
            case 1:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateSub('y',1);
                _this.showCurrentDate('YYYY');
                break;
            case 2:
                _this.initYearView(_this.CURRENT_DATE.DateSub('y',10).getFullYear());
                break;
            default:
                break;
        }

    });
    $('#opt > .next').click(function(){
        switch (_this._mode){
            case 0:
                _this.initMonthView(_this.CURRENT_DATE.DateAdd('m',1));
                break;
            case 1:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateAdd('y',1);
                _this.showCurrentDate('YYYY');
                break;
            case 2:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateAdd('y',10);
                _this.initYearView(_this.CURRENT_DATE.getFullYear());
                break;
            default:
                break;
        }

    });

    $('#opt > #current').click(function(){
        switch (_this._mode){
            case 0:
                $('#current').html(_this.CURRENT_DATE.Format('YYYY'));
                $('.monthly').show();
                $('.daily').hide();
                _this._mode++;
                break;
            case 1:
                _this.initYearView(_this.CURRENT_DATE.getFullYear());
                $('.yearly').show();
                $('.monthly').hide();
                _this._mode++;
                break;
            case 2:

                break;
            default:
                break;
        }



    });




    var top = $('.dailyPanel').offset().top;
    var width = $('.dailyPanel').outerWidth();
    var contentWidth = $('.daily').outerWidth();
    var left = (width - contentWidth)/2;
    $('<div class="monthly"></div>').css({top:top,left:left}).appendTo($('.dailyPanel')).hide();
    $('<div class="yearly"></div>').css({top:top,left:left}).appendTo($('.dailyPanel')).hide();

    //初始化月份数据结构
    for (var r = 0; r < MONTHCELL.ROW; r++) {
        this.monthcells[r] = [];
        for (var c = 0; c < MONTHCELL.COL; c++) {
            this.monthcells[r][c] = new MONTHCELL(r, c).render($('.monthly'));
        }
    }
    //初始化年份数据结构
    for (var r = 0; r < YEARCELL.ROW; r++) {
        this.yearcells[r] = [];
        for (var c = 0; c < YEARCELL.COL; c++) {
            this.yearcells[r][c] = new YEARCELL(r, c).render($('.yearly'));
        }
    }
    this.yearcells[0][0].disabled();
    this.yearcells[YEARCELL.ROW-1][YEARCELL.COL-1].disabled();




    $('.monthly').delegate('.month', 'click', function () {
        var $this = $(this);
        var m = $(this).data('cell').m - 1;
        _this.CURRENT_DATE.setMonth(m);
        _this.initMonthView();
        _this._mode = 0;
        $('.monthly').hide();
        $('.daily').show();
    });

    $('.yearly').delegate('.year', 'click', function () {
        _this._mode = 1;
        var $this = $(this);
//        if ($this.hasClass('disabled')) {
//            //切换年份
//            _this.initMonthView($(this).data('cell').d);
//            return;
//        }

        var y = $this.data('cell').y;
        _this.CURRENT_DATE.setFullYear(y);
        _this.showCurrentDate('YYYY');
        $('.monthly').show();
        $('.yearly').hide();

    });
}

CALENDAR.prototype.setCurrentDate = function(){

}
CALENDAR.prototype.getCurrentDate = function(){
    return this.CURRENT_DATE;
}
CALENDAR.prototype.showCurrentDate = function(format){
    $('#current').html(this.CURRENT_DATE.Format(format));
}
/**
 * 根据日期渲染当前月视图
 * @param date
 */
CALENDAR.prototype.initMonthView = function(date){
    this.CURRENT_DATE = date || this.CURRENT_DATE;
    this.showCurrentDate('YYYY年MM月');
    var f = this.CURRENT_DATE.FirstDayOfMonth();
    var days = this.CURRENT_DATE.MaxDayOfDate()
    var w = f.getDay();
    if (w == 0) {
        //cells[1][0].setDate(f);
        var sub = 1;
        for (var c = DAYCELL.COL - 1; c >= 0; c--) {
            this.cells[0][c].setDate(f.DateSub('d', sub++));
        }
        sub = 0;
        for (var r = 1; r < DAYCELL.ROW; r++) {
            for (var c = 0; c < DAYCELL.COL; c++)
                this.cells[r][c].setDate(f.DateAdd('d', sub++));
        }

    } else {
        //cells[0][w].setDate(f);
        var sub = 1;
        for (var c = w - 1; c >= 0; c--) {
            this.cells[0][c].setDate(f.DateSub('d', sub++));
        }
        sub = 0;
        for (var r = 0; r < DAYCELL.ROW; r++) {
            for (var c = 0; c < DAYCELL.COL; c++) {
                if (r == 0 && c < w)
                    continue;
                this.cells[r][c].setDate(f.DateAdd('d', sub++));
            }
        }
    }
}
/**
 * 根据日期渲染当前年选择视图
 * @param date
 */
CALENDAR.prototype.initYearView = function(year){

    var yu = year % 10;
    var r = Math.floor((yu+1)/YEARCELL.COL);
    var c = (yu - r * YEARCELL.COL) + 1;

    this.yearcells[r][c].setY(year);
    var y = year;
    for(var i=r; i>=0;i--){
        for(var j=YEARCELL.COL-1;j>=0;j--){
            if(i==r && j>=c)
                continue;
            this.yearcells[i][j].setY(--y);
        }
    }
    y = year;
    for(var i=r;i<YEARCELL.ROW;i++){
        for(var j=0;j<YEARCELL.COL;j++){
            if(i==r && j<=c)
                continue;
            this.yearcells[i][j].setY(++y);
        }
    }

    $('#current').html(this.yearcells[0][1].y + '-'+ this.yearcells[YEARCELL.ROW-1][YEARCELL.COL-2].y);
}

/**
 * 月视图的单元格
 * @param c 日历
 * @param row 行
 * @param col 列
 * @constructor
 */
DAYCELL = function (c,row, col) {
    this.c = c;
    this.row = row;
    this.col = col;
    this.createEl();
    this.setEl();
}
DAYCELL.prototype.createEl = function () {
    this.el = $('<div></div>');
}
DAYCELL.prototype.render = function (p) {
    if (p) {
        p.append(this.el);
    } else {

    }
    return this;
}
DAYCELL.prototype.setEl = function (el) {
    this.el = el || this.el;
    this.el.css({position: 'absolute', top: DAYCELL.H * this.row, left: DAYCELL.W * this.col, height: DAYCELL.H, width: DAYCELL.W, lineHeight: DAYCELL.H + 'px', textAlign: 'center'});
    this.el.addClass('day');
    this.el.data('cell', this);
    this.setTxt((this.row + 1) * this.col);
}
DAYCELL.prototype.setTxt = function (txt) {
    this.el.html(txt);
}
DAYCELL.prototype.disabled = function () {
    this.el.addClass('disabled');
}
DAYCELL.prototype.enable = function () {
    this.el.removeClass('disabled');
}
DAYCELL.prototype.setDate = function (date) {
    this.d = date;
    if (this.isCurrentMonth()) {
        this.enable();
    } else {
        this.disabled();
    }
    this.setTxt(this.d.toArray()[2]);
}
DAYCELL.prototype.isCurrentMonth = function () {
    var arr = this.d.toArray();
    var cur = this.c.getCurrentDate().toArray();
    return arr[0] == cur[0] && arr[1] == cur[1];
}

DAYCELL.H = 100;
DAYCELL.W = 100;
DAYCELL.COL = 7;
DAYCELL.ROW = 6;

/**
 * 年份面板
 * @param row
 * @param col
 * @constructor
 */
YEARCELL = function(row,col){
    this.row = row;
    this.col = col;
    this.y = 0;
    this.createEl();
    this.setEl();
}
YEARCELL.prototype.createEl = function () {
    this.el = $('<div></div>');
}
YEARCELL.prototype.render = function (p) {
    if (p) {
        p.append(this.el);
    } else {

    }
    return this;
}
YEARCELL.prototype.setEl = function (el) {
    this.el = el || this.el;
    this.el.css({position: 'absolute', top: YEARCELL.H * this.row, left: YEARCELL.W * this.col, height: YEARCELL.H, width: YEARCELL.W, lineHeight: YEARCELL.H + 'px', textAlign: 'center'});
    this.el.addClass('year');
    this.el.data('cell', this);
}
YEARCELL.prototype.setTxt = function (txt) {
    this.el.html(txt);
}
YEARCELL.prototype.setY = function (y) {
    this.y = y;
    this.el.html(y);
}
YEARCELL.prototype.disabled = function () {
    this.el.addClass('disabled');
}
YEARCELL.prototype.enable = function () {
    this.el.removeClass('disabled');
}

YEARCELL.H = 200;
YEARCELL.W = 175;
YEARCELL.COL = 4;
YEARCELL.ROW = 3;


/**
 * 月份面板
 * @param row
 * @param col
 * @constructor
 */
MONTHCELL = function(row,col){
    this.row = row;
    this.col = col;
    this.m = (this.row) * MONTHCELL.COL + this.col + 1
    this.createEl();
    this.setEl();
}
MONTHCELL.prototype.createEl = function () {
    this.el = $('<div></div>');
}
MONTHCELL.prototype.render = function (p) {
    if (p) {
        p.append(this.el);
    } else {

    }
    return this;
}
MONTHCELL.prototype.setEl = function (el) {
    this.el = el || this.el;
    this.el.css({position: 'absolute', top: MONTHCELL.H * this.row, left: MONTHCELL.W * this.col, height: MONTHCELL.H, width: MONTHCELL.W, lineHeight: MONTHCELL.H + 'px', textAlign: 'center'});
    this.el.addClass('month');
    this.el.data('cell', this);
    this.setTxt(this.m+ '月');
}
MONTHCELL.prototype.setTxt = function (txt) {
    this.el.html(txt);
}
MONTHCELL.H = 200;
MONTHCELL.W = 175;
MONTHCELL.COL = 4;
MONTHCELL.ROW = 3;
