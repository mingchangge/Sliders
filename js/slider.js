/* ; :一种容错机制，有点sql中Go的意思，就是把上面的代码跟自己的这个扩展插件给分开，
 * 因为插件是被引入到页面，如果这个插件上面有错误，且别人忘记以" ; "结尾，
 * 那么我们写的这个插件就会受到影响，所以加上开头的分号；
 */
/*自执行函数,JS中无法用花括号方便地创建作用域，但函数却可以形成一个作用域，域内的代码是无法被外界访问的。
 *如果我们将自己的代码放入一个函数中，那么就不会污染全局命名空间，同时不会和别的代码冲突。
 *自调用匿名函数里面的代码会在第一时间执行，页面准备好过后，上面的代码就将插件准备好了，以方便在后面的代码中使用插件
 */
//undefined,是为了防止别人把undefined定义成别的。注意最后传参数没有传第二个参数，正保证undefined是原生的。
/*还可传参数window和document，如果插件用不上，可以不写。目的是为了快速查找window和document。也便于代码压缩
*例如window可能给压缩成w，如果不写，代码就会报错了
*/
;(function($,undefined){  //($)防止$冲突
	// $.fn其实就是jQuery.prototype,原型
	$.fn.Sliders=function(options){
		var defaults={
			index:0,
			timer:null,
			speed:3000,
			min:0.3,     //和../css/slider.css的sliders_box li中的opacity值一样
			max:1,
			runTime:1000    //动画速度
		};
		var opts = $.extend(defaults,options); 
		// 显示第一张图片和为标号1添加active类
		// console.log(this);//this是绑定的dom。此处是id为sliders的ul
		this.find("li").eq(0).show().stop()
			.animate({ opacity: opts.max}, opts.runTime).siblings("li").hide().stop().css({opacity: opts.min });
		this.next("#sliders_point").find("li").eq(0).addClass("active");
		/*
		 //不用ES6箭头函数，需要指定this，鉴于ES6可能有兼容问题，暂时保存这个方法
		 var _this=this;  
		 var core=function(){
		 	if(opts.index==parseInt(_this.find("li").length)){
		 		opts.index=0;
		 	}else if(opts.index<0){
		 		opts.index=parseInt(_this.find("li").length-1);
			}
		 	_this.find("li").eq(opts.index).show().stop()
		 	.animate({ opacity: opts.max }, opts.runTime).siblings("li").hide().stop().css({ opacity: opts.min });
		 	_this.next("#sliders_point").find("li").eq(opts.index).addClass("active").siblings("li").removeClass("active");
		 }
		*/
		var core=()=>{  //箭头函数完全修复了this的指向，this总是指向词法作用域，也就是外层调用者，此处是此处是id为sliders
			// console.log(this);
			if(opts.index==parseInt(this.find("li").length)){
				opts.index=0;
			}else if(opts.index<0){
				opts.index=parseInt(this.find("li").length-1);
			}
			this.find("li").eq(opts.index).show().stop()
			.animate({ opacity: opts.max }, opts.runTime).siblings("li").hide().stop().css({ opacity: opts.min });
			this.next("#sliders_point").find("li").eq(opts.index).addClass("active").siblings("li").removeClass("active");
		}
		 //点击按钮，前一张图片
		this.parent().find("#pre").click(function(){
			clearInterval(opts.timer);
			opts.index--;
			core();
			start();
		});
		this.parent().hover(function(){
			$(this).parent().find(".btn").css("opacity",1);
		},function(){
			$(this).parent().find(".btn").css("opacity",0);
		});
		 //点击按钮，后一张图片
		this.parent().find("#next").click(function(){
			opts.index++;
			core();
		});
		// 鼠标移上标号标签，切换到相应的图片
		this.next("#sliders_point").find("li").hover(function(){
			clearInterval(opts.timer);
			opts.index=$(this).index();
			core();
			start();
			// console.log(this);
			// console.log($(this));
		},function(){
			clearInterval(opts.timer);
			start();
		});
		/*
		// 点击标号标签，切换到相应的图片
		this.next("#sliders_point").find("li").click(function(){
			clearInterval(opts.timer);
			opts.index=$(this).index();
			core();
			start();
		});*/
		// 定时器
		var start=function(){
			opts.timer=setInterval(function(){
				opts.index++;
				core();
			},opts.speed);
		}
		start();
	}
})(jQuery);
$("#sliders").Sliders();