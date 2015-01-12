/**
 * Created by mich on 15-1-7.
 */
//日历面板
CALENDARPANEL = function () {
    this.CURRENT_DATE = new Date();
    this.cells = [];
    this.monthcells = [];
    this.yearcells = [];
    this.yearscells = [];
    this._mode = 0;//0 : 日历月视图   1：月份选择  (操作)　　２：年份选择  3: 年份区间选择
    var _this = this;

    var inited = false;
    var init = function(){
        if(inited)
            return;
        var top = $('.dailyPanel').offset().top;
        var width = $('.dailyPanel').outerWidth();
        var contentWidth = $('.daily').outerWidth();
        var left = (width - contentWidth) / 2 ;
        $('.monthly').css({top: 0, left: left});
        $('.yearly').css({top: 0, left: left});
        $('.yearsly').css({top: 0, left: left});
    }

    //初始化日历数据结构
    for (var r = 0; r < DAYCELL.ROW; r++) {
        this.cells[r] = [];
        for (var c = 0; c < DAYCELL.COL; c++) {
            this.cells[r][c] = new DAYCELL(this, r, c).render($('.daily'));
        }
    }
    var WEEK = ['日', '一', '二', '三', '四', '五', '六'];
    for (var i = 0; i < WEEK.length; i++) {
        new DAYCELL(this, 0, i).render($('.dailyHeader')).setTxt(WEEK[i]);
    }


    $('#opt > .pre').click(function () {
        switch (_this._mode) {
            case 0:
                _this.initMonthView(_this.CURRENT_DATE.DateSub('m', 1));
                break;
            case 1:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateSub('y', 1);
                _this.showCurrentDate('YYYY');
                break;
            case 2:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateSub('y', 10);
                _this.initYearView(_this.CURRENT_DATE.getFullYear());
                break;
            case 3:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateSub('y', 100);
                _this.initYearSetView(_this.CURRENT_DATE.getFullYear());
            default:
                break;
        }

    });
    $('#opt > .next').click(function () {
        switch (_this._mode) {
            case 0:
                _this.initMonthView(_this.CURRENT_DATE.DateAdd('m', 1));
                break;
            case 1:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateAdd('y', 1);
                _this.showCurrentDate('YYYY');
                break;
            case 2:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateAdd('y', 10);
                _this.initYearView(_this.CURRENT_DATE.getFullYear());
                break;
            case 3:
                _this.CURRENT_DATE = _this.CURRENT_DATE.DateAdd('y', 100);
                _this.initYearSetView(_this.CURRENT_DATE.getFullYear());
                break;
            default:
                break;
        }

    });

    $('#opt > #current').click(function () {
        init();
        switch (_this._mode) {
            case 0:
                $('#current').html(_this.CURRENT_DATE.Format('YYYY'));
                $('.monthly').fadeIn();
                $('.daily').fadeTo(40,0);
                $('.dailyHeader').fadeTo(40,0);
                _this._mode++;
                break;
            case 1:
                _this.initYearView(_this.CURRENT_DATE.getFullYear());
                $('.yearly').fadeIn();
                $('.monthly').fadeOut(40);
                _this._mode++;
                break;
            case 2:
                _this.initYearSetView(_this.CURRENT_DATE.getFullYear());
                $('.yearsly').fadeIn();
                $('.yearly').fadeOut(40);
                _this._mode++
                break;
            default:
                break;
        }
    });


    $('<div class="monthly"></div>').appendTo($('.dailyPanel')).hide();
    $('<div class="yearly"></div>').appendTo($('.dailyPanel')).hide();
    $('<div class="yearsly"></div>').appendTo($('.dailyPanel')).hide();

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
    this.yearcells[YEARCELL.ROW - 1][YEARCELL.COL - 1].disabled();

    //初始化年份段数据结构
    for (var r = 0; r < YEARSCELL.ROW; r++) {
        this.yearscells[r] = [];
        for (var c = 0; c < YEARSCELL.COL; c++) {
            this.yearscells[r][c] = new YEARSCELL(r, c).render($('.yearsly'));
        }
    }
    this.yearscells[0][0].disabled();
    this.yearscells[YEARSCELL.ROW - 1][YEARSCELL.COL - 1].disabled();


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

    $('.monthly').delegate('.month', 'click', function () {
        var $this = $(this);
        var m = $(this).data('cell').m - 1;
        _this.CURRENT_DATE.setMonth(m);
        _this.initMonthView();
        _this._mode = 0;
        $('.monthly').fadeOut(40);
        $('.daily').fadeTo(40,1);
        $('.dailyHeader').fadeTo(40,1);
    });

    $('.yearly').delegate('.year', 'click', function () {
        _this._mode = 1;
        var $this = $(this);

        var y = $this.data('cell').y;
        _this.CURRENT_DATE.setFullYear(y);
        _this.showCurrentDate('YYYY');
        $('.monthly').fadeIn();
        $('.yearly').fadeOut(40);

    });
    $('.yearsly').delegate('.years', 'click', function () {
        _this._mode = 2;
        var $this = $(this);
        var y = $this.data('cell').b;
        _this.initYearView(y);
        $('.yearly').fadeIn();
        $('.yearsly').fadeOut(40);

    });
}

CALENDARPANEL.prototype.setCurrentDate = function () {

}
CALENDARPANEL.prototype.getCurrentDate = function () {
    return this.CURRENT_DATE;
}
CALENDARPANEL.prototype.showCurrentDate = function (format) {
    $('#current').html(this.CURRENT_DATE.Format(format));
}
/**
 * 根据日期渲染当前月视图
 * @param date
 */
CALENDARPANEL.prototype.initMonthView = function (date) {
    this.CURRENT_DATE = date || this.CURRENT_DATE;
    this.showCurrentDate('YYYY年MM月');
    var f = this.CURRENT_DATE.FirstDayOfMonth();
    var days = this.CURRENT_DATE.MaxDayOfDate()
    var w = f.getDay();
    if (w == 0) {
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
 * @param year  年份
 */
CALENDARPANEL.prototype.initYearView = function (year) {

    var yu = year % 10;
    var r = Math.floor((yu + 1) / YEARCELL.COL);
    var c = (yu - r * YEARCELL.COL) + 1;

    this.yearcells[r][c].setY(year);
    var y = year;
    for (var i = r; i >= 0; i--) {
        for (var j = YEARCELL.COL - 1; j >= 0; j--) {
            if (i == r && j >= c)
                continue;
            this.yearcells[i][j].setY(--y);
        }
    }
    y = year;
    for (var i = r; i < YEARCELL.ROW; i++) {
        for (var j = 0; j < YEARCELL.COL; j++) {
            if (i == r && j <= c)
                continue;
            this.yearcells[i][j].setY(++y);
        }
    }

    $('#current').html(this.yearcells[0][1].y + '-' + this.yearcells[YEARCELL.ROW - 1][YEARCELL.COL - 2].y);
}
/**
 * 根据日期渲染年段选择视图
 * @param year  年份
 */
CALENDARPANEL.prototype.initYearSetView = function (year) {
    var century = Math.floor(year / 100);
    var begin = century * 100 - 10;
    for (var i = 0; i < YEARSCELL.ROW; i++) {
        for (var j = 0; j < YEARSCELL.COL; j++) {
            this.yearscells[i][j].setB(begin);
            begin = begin + 10;
        }
    }
    $('#current').html(this.yearscells[0][1].b + '-' + this.yearscells[YEARSCELL.ROW - 1][YEARSCELL.COL - 2].e);
}

/**
 * 月视图的单元格
 * @param c 日历
 * @param row 行
 * @param col 列
 * @constructor
 */
DAYCELL = function (c, row, col) {
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
 * 月份面板
 * @param row
 * @param col
 * @constructor
 */
MONTHCELL = function (row, col) {
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
    this.setTxt(this.m + '月');
}
MONTHCELL.prototype.setTxt = function (txt) {
    this.el.html(txt);
}
MONTHCELL.H = 200;
MONTHCELL.W = 175;
MONTHCELL.COL = 4;
MONTHCELL.ROW = 3;


/**
 * 年份面板
 * @param row
 * @param col
 * @constructor
 */
YEARCELL = function (row, col) {
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
 * 年份段面板
 * @param row
 * @param col
 * @constructor
 */
YEARSCELL = function (row, col) {
    this.row = row;
    this.col = col;
    this.b = 0;
    this.e = 0;
    this.createEl();
    this.setEl();
}
YEARSCELL.prototype.createEl = function () {
    this.el = $('<div></div>');
}
YEARSCELL.prototype.render = function (p) {
    if (p) {
        p.append(this.el);
    } else {

    }
    return this;
}
YEARSCELL.prototype.setEl = function (el) {
    this.el = el || this.el;
    this.el.css({position: 'absolute', top: YEARSCELL.H * this.row, left: YEARSCELL.W * this.col, height: YEARSCELL.H, width: YEARSCELL.W});
    this.el.addClass('years');
    this.el.data('cell', this);
}
YEARSCELL.prototype.setTxt = function (txt) {
    this.el.html(txt);
}
YEARSCELL.prototype.setB = function (b) {
    this.b = b;
    this.e = b + 9;
    this.el.html(this.b + '-' + this.e);
}
YEARSCELL.prototype.disabled = function () {
    this.el.addClass('disabled');
}
YEARSCELL.prototype.enable = function () {
    this.el.removeClass('disabled');
}

YEARSCELL.H = 200;
YEARSCELL.W = 175;
YEARSCELL.COL = 4;
YEARSCELL.ROW = 3;


