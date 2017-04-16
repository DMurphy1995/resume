function startOnePage(myInput){
    'use strict';

    var settings = myInput;

    // input values
    var frame = $(settings.frame),
        container = $(settings.container),
        sections = $(settings.sections),
        speed = settings.speed || 500,
        easing = settings.easing || "swing",
        basic=$(settings.basic),
        more=$(settings.more);
    var didScroll = true,
        isFocused = true;

    // common variables
    var height = $(window).height();

    // Index values for sections elements
    var totalSections = sections.length - 1;

    // currently displayed section number
    // modifying this variable will cause buggy behaviors.
    var num = 0; 
    // init function to initialize/reassign values of the variables
    // to prevent section misplacement caused by a window resize.
    function init(){
        height = $(window).height();
        frame.css({"overflow":"hidden", "height": height + "px"});
        sections.css({"height": height + "px"});
        didScroll = true;
        isFocused = true;
        end = - height * ( totalSections );    
        container.stop().animate({marginTop : 0}, 0, easing, function(){
            num = 0;
            didScroll = true;
        });
    }
    // event binding to init function
    $(window).bind("load", init);
    // animate scrolling effect
    var now, end;
    function animateScr(moveTo, duration, distance){
        var top;
        duration = duration || speed;
        switch(moveTo){
            case "down":
                top = "-=" + ( height * distance ) + "px";
                num += distance;
                break;
            case "up":
                top = "+=" + ( height * distance ) + "px";
                num -= distance;
                break;
            case "bottom":
                top = end;
                num = totalSections;
                break;
            case "top":
                top = 0;
                num = 0;
                break;
            default: console.log("(error) wrong argument passed"); return false;
        }

        container.not(":animated").animate({marginTop : top}, duration, easing, function(){
            didScroll = true;
        });
    }
    more.click(function(){
        now = parseInt( container.css("marginTop") );
        end = - height * ( totalSections );
        if (now!=end){ animateScr("down", 500, 1);}
    
    });
    basic.click(function(){
        now = parseInt( container.css("marginTop") );
        if (now != 0) {animateScr("up",500,1);}
        })
    
}
$(function () {
    var options = {
        id: 'box'
        , auto: false
    };
    var box = $('.box');
    box.initReveal(options);
    $('.btn-reveal').on('click', function () {
        box.performReveal(options);
    });
});

function replaceAllInstances(source, search, replacement) {
    var regex = new RegExp(search, "g");
    var result = source.replace(regex, replacement);
    return result;
}

$.fn.isOnScreen = function (x, y) {
    if (x == null || typeof x == 'undefined')
        x = 1;
    if (y == null || typeof y == 'undefined')
        y = 1;

    var win = $(window);

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var height = this.outerHeight();
    var width = this.outerWidth();

    if (!width || !height) {
        return false;
    }

    var bounds = this.offset();
    bounds.right = bounds.left + width;
    bounds.bottom = bounds.top + height;

    var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

    if (!visible) {
        return false;
    }

    var deltas = {
        top: Math.min(1, (bounds.bottom - viewport.top) / height),
        bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
        left: Math.min(1, (bounds.right - viewport.left) / width),
        right: Math.min(1, (viewport.right - bounds.left) / width)
    };

    return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;

};

$.fn.initReveal = function (options) {
    console.log('-------------');
    console.log('selector:' + this.selector);
    var parent = $(this).parent();

    //grab a copy of the contents, then remove it from DOM
    var contents = $(this).clone();
    $(this).empty();

    var revealHtmlBlock = "<div class='reveal'> <div class='text reveal__inner reveal__inner-{class}'> </div> <div class='reveal__cover reveal__cover-{class}'> <div class='reveal__cover-section reveal__100'></div> <div class='reveal__cover-section reveal__90'></div> <div class='reveal__cover-section reveal__80'></div> <div class='reveal__cover-section reveal__70'></div> <div class='reveal__cover-section reveal__60'></div> <div class='reveal__cover-section reveal__50'></div> <div class='reveal__cover-section reveal__40'></div> <div class='reveal__cover-section reveal__30'></div> <div class='reveal__cover-section reveal__20'></div> <div class='reveal__cover-section reveal__10'></div> </div> </div>";
    revealHtmlBlock = replaceAllInstances(revealHtmlBlock, "{class}", options.id);

    $(revealHtmlBlock).appendTo(parent);
    contents.appendTo($('.reveal__inner-' + options.id));

    //handle options

    //delay
    if (options.delay === undefined) {
        console.log('delay set to 0');
        options.delay = 0; //set default
    } else {
        console.log('delay set to:' + options.delay);
    }
    var revealElementFunction = function (options) {
        $(this).performReveal(options);
    };

    //background
    if (options.background !== undefined) {
        $('.reveal__cover-' + options.id + ' .reveal__cover-section').css({'background-color': options.background});
    }

    //trigger the reveal at the specified time, unless auto is present and set to false
    if (options.auto === undefined || (options.auto !== undefined && options.auto)) {
        setTimeout(function () {
            console.log('call');
            revealElementFunction(options);
        }, options.delay);
    }

    //trigger on-visible
    if (options.trigger !== undefined) {
        var revealOnScreenIntervalIdMap = {};
        function uncoverText() {
            var onscreen = $('.reveal__inner-box4').isOnScreen();
            if ($('.reveal__inner-' + options.id).isOnScreen()) {
                $('.reveal__cover-' + options.id).addClass('reveal__uncovered');
                revealOnScreenIntervalIdMap[options.id] = window.clearInterval(revealOnScreenIntervalIdMap[options.id]);
            }
        }
        function showTextWhenVisible() {
            revealOnScreenIntervalIdMap[options.id] = setInterval(uncoverText, 500);
        }
        showTextWhenVisible();
    }

};
$.fn.performReveal = function (options) {
    var _performReveal = function () {
        $('.reveal__cover-' + options.id).addClass('reveal__uncovered');
    };
    //allow time for init code to complete
    setTimeout(_performReveal, 10);
};
var fsBanner = function(container,options) {
    var self = this;

    var defaults = {
        'showName':true,    
        'toUpdate':{},
        'whenEmpty':{},
        'trigger':'click',
        'hideParent':null,
        'onChanged':null
    }

    this.options = $.extend({}, defaults, options);

    this.ilast = -1;

    this.setup = function() {
        this.container = $(container);
        this.items = this.container.find('div');

        if (!this.container.width()) this.container.width(this.container.parent().width());

        this.part = this.container.width() / this.items.length;
        this.mini = this.part/4;
        this.widmain = this.container.width() - (this.mini*this.items.length-1);

        this.items.css({'height':this.container.height(),'width':this.widmain+this.mini});  

        if (!this.options.showName) this.items.find('.name').hide();

        this.items.each(function(i) {
            var $item = $(this);
            $item.css({'z-index':i});
            if (self.options.trigger == 'click') $item.on('click',function() { self.selectItem($item,i); });
            if (self.options.trigger == 'mouse') $item.on('mouseenter',function() { self.selectItem($item,i,true); });
        });

        if (self.options.trigger == 'mouse') {
            this.container.on('mouseleave',function() { self.resetcss(); });
        }

        this.resetcss();
        this.container.show();
    }

    this.resetcss = function() {
        this.items.each(function(i) {
            var $item = $(this);
            $item.stop().animate({'left':i*self.part});

            if (self.options.showName) {
                var $name = $item.find('.name');
                if ($name.hasClass('minimized')) $name.hide().removeClass('minimized').fadeIn('fast');
            }
        });
        this.ilast = null;
        this.updateHtml();
    };

    this.selectItem = function($expanded,iexpanded,forceClick) {
        this.$lastexpanded = this.$expanded;

        if (forceClick) this.ilast = null;
        if (iexpanded == this.ilast) {
            this.$expanded = null;          
            this.resetcss();
        } else {
            this.$expanded = $expanded;         
            this.items.each(function(i) {
                var $item = $(this);
                if (i <= iexpanded) {
                    $item.stop().animate({'left':i*self.mini});
                } else {
                    $item.stop().animate({'left':i*self.mini+self.widmain});
                }
                if (self.options.showName) {
                    var $name = $item.find('.name');
                    var method = (i == iexpanded) ? 'removeClass' : 'addClass';             
                    if (method == 'addClass' && $name.hasClass('minimized')) method = '';
                    if (method) $name.hide()[method]('minimized').fadeIn('fast');
                }
            });
            this.ilast = iexpanded;
            this.updateHtml($expanded);
        }
        this.fireChanged();
    };

    this.updateHtml = function($expanded) {
        this.$expanded = $expanded;

        var $parent = $(self.options.hideParent);
        $.each(this.options.toUpdate,function(field,selector) {
            var $obj = $(selector);
            var showit = false;
            var value = '';
            if ($expanded) {
                $parent.show();
                value = $expanded.find('.'+field).html();
                showit = true;
            } else {
                if ($parent.length) {
                    showit = false;
                    $parent.hide();
                } else {
                    if (self.options.whenEmpty[field]) {
                        value = self.options.whenEmpty[field];
                        showit = true;
                    }
                }
            }
            $obj.hide();
            if (showit) $obj.html(value).fadeIn('fast');
        });
    };

    this.fireChanged = function() {
        if (this.options.onChanged) {
            this.options.onChanged(this.$expanded,this.$lastexpanded);
        }
    };

    this.setup();
};

$.fn.fsBanner = function(options) {
    return new fsBanner(this,options);
};
