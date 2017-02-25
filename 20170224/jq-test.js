/**
 * Created by qiuxiaoguang on 2017/2/25.
 */

(function () {

    var arr = [];
    var splice = arr.splice;
    var push = arr.push;

    var toString = Object.prototype.toString;
    var types = "Boolean Number String Function Array Object Math Date RegExp".split(" ");
    var class2type = {};
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        class2type["[object " + type + "]"] = type.toLowerCase();
    }
    ;

    function Sizzle(selector) {
        return document.querySelectorAll(selector);
    };

    function jQuery(selector) {
        return new jQuery.fn.init(selector);
    };

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        length: 0,
        init: function (selector) {

            splice.call(this, 0, this.length);

            if (selector == null) return this;

            if (jQuery.isString(selector)) {
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    //是"<div></div>"这种
                    var div = document.createElement("div");
                    div.innerHTML = selector;

                    push.apply(this, div.childNodes);
                } else {
                    //是"div"
                    var doms = Sizzle(selector);

                    push.apply(this, doms);
                }
                ;
            } else if (jQuery.isFunction(selector)) {
                //用于处理 $(function(){})--->相当于document.ready
                document.addEventListener("DOMContentLoaded", selector);
            } else if (selector.nodeType) {
                //DOM元素
                push.call(this, selector);
            } else {
                return selector;
            }
            ;
            return this;
        }
    };

    jQuery.prototype.init.prototype = jQuery.prototype;

    jQuery.fn.extend = jQuery.extend = function () {
        var i,
            arg0 = arguments[0],
            argLen = arguments.length,
            target,
            sources = [];
        if (argLen == 0) return this;
        if (argLen == 1) {
            target = this;
            sources.push(arg0);
        } else {
            target = arg0;
            sources.push(arg0, arguments);
        }
        ;
        for (i = 0; i < sources.length; i++) {
            var source = sources[i];
            for (var key in source) {
                target[key] = source[key];
            }
            ;
        }
        ;
    };

    function isLikeArray(obj) {
        if (jQuery.isFunction(obj) || obj === window) {
            return false;
        }
        if (jQuery.type(obj.length) === "number" && obj.length >= 0 && obj.length - 1 in obj) {
            return true;
        }
        return false;
    };

    jQuery.extend({
        type: function (obj) {
            return obj == null ?
                String(obj) :
                class2type[toString.call(obj)];
        },
        isString: function (str) {
            return jQuery.type(str) === "string";
        },
        isFunction: function (fn) {
            return jQuery.type(fn) === "function";
        },
        isArray: function (arr) {
            return Array.isArray ? Array.isArray(arr) : jQuery.type(arr) === "array";
        },
        each: function (obj, callback) {
            var i;
            if (isLikeArray(obj)) {
                for (i = 0; i < obj.length;) {
                    if (callback.call(obj[i], i, obj[i++]) === false) break;
                }
                ;
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) break;
                }
            }
            ;
        },
        map: function (obj, callback) {
            var i, newArr = [];
            if (isLikeArray(obj)) {
                for (i = 0; i < obj.length;) {
                    var res = callback.call(obj[i], i, obj[i++]);
                    newArr.push(res);
                }
                ;
            } else {
                for (i in obj) {
                    var res = callback.call(obj[i], i, obj[i]);
                    newArr.push(res);
                }
                ;
            }
            ;
            return newArr;
        },
        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, "");
        },
        error: function (msg) {
            throw new Error(msg);
        },
        merge: function (target, source) {
            return jQuery.each(source, function () {
                target[target.length++] = this;
            });
        },
        makeArray: function (obj) {
            return !jQuery.isString(obj) && isLikeArray(Object(obj)) ? jQuery.merge([], obj) : [obj];
        }
    });

    jQuery.fn.extend({
        each: function (callback) {
            jQuery.each(this, callback);
            return this;
        },
        map: function (callback) {
            jQuery.map(this, callback);
        }
    });


    /*
     *
     * CSS模块
     *
     * */

    jQuery.fn.extend({
        css: function () {
            var argLen = arguments.length,
                arg0 = arguments[0] || null,
                arg1 = arguments[1] || null;
            if (argLen == 0) return this;
            if (argLen == 1) {
                if (jQuery.isString(arg0)) {

                    return getStyle(this[0], arg0);
                } else {
                    return this.each(function () {
                        //每个DOM元素
                        var _this = this;
                        jQuery.each(arg0, function () {
                            _this.style[arguments[0]] = this;
                        });
                    });
                }
                ;
            } else {
                return this.each(function () {
                    this.style[arg0] = arg1;
                })
            }

        },
        hide: function () {
            return this.css("display", "none");
        },
        show: function () {
            return this.css("display", "block");
        },
        toggle: function () {
            this.each(function () {
                var $this = jQuery(this);
                $this[$this.css("display") === "none" ? "show" : "hide"]();
            });
            return this;
        }
    });

    function getStyle(obj, attr) {
        return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj, null)[attr];
    }
    ;

    jQuery.fn.extend({
        get: function (index) {
            return index == null ? jQuery.makeArray(this) :
                (index >= 0 ? this[index] : this[this.length + index]);
        }
    });


    /**
     *
     * DOM操作之 属性  类名
     *
     */
    jQuery.fn.extend({
        /*
         * 获取指定的属性
         * 设置单个属性
         * 设置多个属性
         */
        attr: function () {
            var argLen = arguments.length,
                arg0 = arguments[0] || null,
                arg1 = arguments[1] || null;
            if (argLen == 0) return this;
            if (argLen == 1) {
                if (jQuery.isString(arg0)) {
                    return this.getAttribute(arg0);
                } else {
                    return this.each(function () {
                        //每个DOM元素
                        var _this = this;
                        jQuery.each(arg0, function () {
                            _this.setAttribute(arguments[0], this);
                        });
                    });
                }
                ;
            } else {
                return this.each(function () {
                    this.setAttribute(arg0, arg1);
                })
            }
            ;
        },
        removeAttr: function () {
            return this.each(function () {
                this.removeAttribute(arguments[0]);
            });
        },
        prop: function () {
            var argLen = arguments.length,
                arg0 = arguments[0] || null,
                arg1 = arguments[1] || null;
            if (argLen == 0) return this;
            if (argLen == 1) {
                if (jQuery.isString(arg0)) {
                    return this.get(0)[arg0];
                } else {
                    return this.each(function () {
                        //每个DOM元素
                        var _this = this;
                        jQuery.each(arg0, function () {
                            _this[arguments[0]] = this;
                        });
                    });
                }
                ;
            } else {
                return this.each(function () {
                    this[arg0] = arg1;
                });
            }
            ;
        },
        /*
         * 功能：只要其中一个DOM元素含有指定的类名就返回true，反之返回false
         *
         * 要判断某个DOM元素是否含有指定的类名，应该满足以下2个条件之一
         * a、className在字符串中的位置，左边是字符串边界 ，右边必须是空格、或者也是字符串边界
         *       class="aaa" 要找"aaa"        class="aaa bbb" 要找"aaa"
         * b、className在字符串中的位置，左边是空格，右边必须是边界或者空格
         *       class="aaa bbb"    要找"bbb"    class="aaa bbb ccc" 要找"bbb"
         */
        hasClass: function (className) {
            var result = false;
            this.each(function () {
                var domClassName = " " + this.className + " ";
                var findClassName = " " + className + " ";
                if (domClassName.indexOf(findClassName) > -1) {
                    result = true;
                    return false;
                }
            });
            return result;
        },
        /**
         * 功能：给init实例中的每一个DOM元素添加一个或者多个类名，多个类名之间以空格隔开
         * $("div").addClass("aaa bbb ccc")
         */
        addClass: function () {
            var className = arguments[0].split(" ");
            var reg = /\w+/;
            return this.each(function () {
                var $this = $(this);
                jQuery.each(className, function () {
                    if (!$this.hasClass(this)) {
                        if (reg.exec($this.className)) {
                            $this.className += " " + this;
                        } else {
                            $this.className = this;
                        }
                        ;
                    }
                });
            });
        },
        /**
         * 删除一个或者多个或者全部
         * 如果删除多个类名，多个类名之间要以空格隔开
         * 如果删除全部，就不要传参
         */
        removeClass: function () {
            var reg = /^\s+|\s+$/g;
            if (arguments.length == 0) {
                return this.each(function () {
                    this.className = "";
                });
            } else {
                var singleDomChange, existClassName;
                var rmvClass = arguments[0].split(" ");
                this.each(function () {
                    existClassName = " " + this.className + " ";
                    jQuery.each(rmvClass, function () {
                        singleDomChange = " " + this + " ";
                        existClassName = existClassName.replace(singleDomChange, " ");
                    });
                    var result = existClassName.replace(reg, "");
                    this.className = result;
                });
            }
            ;
        },
        /**
         * 切换一个或者多个类名，如果存在该类名就删除，反之就添加
         */
        toggleClass: function () {
            var classNames = arguments[0].split(" ");
            return this.each(function () {
                //this:DOM元素
                var $this = $(this);
                jQuery.each(classNames, function () {
                    $this[$this.hasClass(arguments[1]) ? "removeClass" : "addClass"](arguments[1]);
                });
            });
        }
    });


    /**
     *
     * DOM操作之 添加删除标签
     *
     */

    jQuery.fn.extend({
        /**
         * 功能：将当前实例中保存的每一个DOM元素追加到参数中，并作为参数的末尾节点
         * 参数："body","div" or  DOM元素：document.body  $("div")[0]  or init对象
         */
        appendTo: function () {
            var $parents = $(arguments[0]);
            return this.each(function () {
                var childDom = this;
                $parents.each(function (i) {
                    this.appendChild(i == 0 ? childDom : childDom.cloneNode(true));
                });
            });
        },
        append: function () {
            var $children = $(arguments[0]);
            $children.appendTo(this);
            return this;
        },
        /**
         * 利用原生JS的parent.insertBefore(child,location);
         * 把第一个参数插入到第二个参数之前，如果第二个参数==null，则作用相当于appendChild
         */
        prependTo: function () {
            var $parents = $(arguments[0]);
            this.each(function () {
                var childs = this;
                $parents.each(function (i) {
                    this.insertBefore(i == 0 ? childs : childs.cloneNode(true), this.firstChild);
                });
            });
        },
        prepend: function () {
            var $children = $(arguments[0]);
            $children.prependTo(this);
            return this;
        },
        /**
         * $("div").remove()：将div从页面中移除
         * 原生JS：parent.removeChild(child)
         */
        remove: function () {
            var argLen = arguments.length;
            if (argLen == 0) {
                return this.each(function () {
                    this.parentNode.removeChild(this);
                });
            } else {
                //是否能交叉，交叉部分fuck up
                var $arg0 = $(arguments[0]);
                return this.each(function () {
                    var parent = this;
                    $arg0.each(function () {
                        if (parent === this) {
                            parent.parentNode.removeChild(parent);
                        }
                    });
                });
            }
        },
        /**
         * 无参数时，返回第一个匹配元素的内容。
         * 一个参数时，设置该元素的innerHTML
         */
        html: function () {
            var argLen = arguments.length;
            if (argLen == 0) {
                return this.get(0).innerHTML;
            } else {
                var content = arguments[0];
                return this.each(function () {
                    //不能用+=，该方法作用后是直接覆盖
                    this.innerHTML = content;
                });
            }
            ;
        },
        /**
         * 无参数时，返回所有元素的内容。
         * 一个参数时，设置该元素的innerText
         */
        text: function () {
            var argLen = arguments.length;
            var content = "";
            if (argLen == 0) {
                this.each(function () {
                    content += getContent(this);
                });
                return content;
            } else {
                var fixContent = arguments[0];
                return this.each(function () {
                    //不能用+=，该方法作用后是直接覆盖
                    setContent(this, fixContent);
                });
            }
            ;
        }
    });

    /**
     * 获取DOM元素的文本内容能力检测
     */
    function getContent(dom) {
        return dom.innerText ? dom.innerText : dom.textContent;
    };
    /**
     * 设置DOM元素的文本内容能力检测
     */
    function setContent(dom, content) {
        dom.innerText ? dom.innerText = content : dom.textContent = content;
    };


    /**
     *
     * DOM操作之 插入标签，获取表单元素值，兄弟元素等
     *
     */

    jQuery.fn.extend({
        /**
         * 在DOM元素之前添加  参数的 标签
         */
        before: function () {
            var $prev = $(arguments[0]);
            return this.each(function (i) {
                var self = this;
                $prev.each(function () {
                    self.parentNode.insertBefore(i == 0 ? this : this.cloneNode(true), self);
                });
            });
        },
        /**
         * 在DOM元素之后添加  参数的 标签
         */
        after: function () {
            var $next = $(arguments[0]);
            return this.each(function () {
                var self = this;
                $next.each(function () {
                    self.parentNode.insertBefore(i == 0 ? this : this.cloneNode(true), self.nextSibling);
                });
            });
        },
        /**
         * - 获取：获取【第一个DOM】元素的值 $("input").val()
         - 文本框、按钮、textarea：返回value属性的值
         - select：如果单选返回选中的option的value，如果是多选返回选中的文本组成数组
         - option：返回value属性的值或者文本
         - checkbox/radio：如果存在value属性就返回value属性的值，反之返回"on"

         - 设置：设置每一个DOM元素的值
         - 文本框、按钮、textarea：直接设置value属性的值
         - checkbox/radio：如果设置的值与checkbox的value属性匹配，就选中它(checked=true)
         - select：如果设置的值与下面的某个option的value值匹配就选中某个option，如果都不匹配就取消选中（selectedIndex = -1;）
         */
        val: function () {
            if (arguments.length == 0) {
                //获取值
                var firstDom = this[0];
                var fn = jQuery.valHooks[firstDom.type] || jQuery.valHooks[firstDom.nodeName.toLowerCase()];
                return fn.get(firstDom);
            } else {
                var arg0 = arguments[0]
                this.each(function () {
                    var fn = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                    return fn.set(this, arg0);
                });
            }
        },
        /**
         * 返回一个伪数组，为其所有兄弟元素（不包含文本节点）
         * this.parentNode--->找所有子节点，排除自身和非元素节点
         */
        siblings: function () {
            var $result = $();//返回一个jQuery对象
            this.each(function () {
                //DOM元素
                var self = this;
                var siblings = this.parentNode.childNodes;
                jQuery.each(siblings, function () {
                    if (this.nodeType === 1 && this !== self) {
                        if ($result.indexOf(this) == -1) {
                            push.call($result, this);
                        }
                    }
                });
            });
            return $result;
        },
        /**
         * $("div").next("span")：返回所有的div中下一个标签是span的这些DOM元素，组成一个jquery对象返回
         */
        next: function () {
            var $result = $();
            this.each(function () {
                var next = jQuery.nextDom(this);
                push.call($result, next);
            });
            if (arguments.length == 0) {
                return $result;
            } else {
                var $result2 = $();
                var $filter = jQuery(arguments[0]);
                $result.each(function () {
                    var result = this;
                    $filter.each(function () {
                        if (result === this) {
                            push.call($result2, this);
                        }
                    });
                });
                return $result2;
            }
            ;
        },
        nextAll: function () {
            var $result = $();
            this.each(function () {
                var nextDoms = jQuery.nextAllDomsFinal(this);
                var self = this;
                jQuery.each(nextDoms, function () {
                    //判断是否重复
                    if ($result.indexOf(this) == -1) {
                        push.call($result, this);
                    }
                });
            });
            return $result;
        },
        /**
         * $("div").prev("span")：返回所有的div中上一个标签是span的这些DOM元素，组成一个jquery对象返回
         */
        prev: function () {
            var $result = $();
            this.each(function () {
                var prevSib = jQuery.prevDom(this);
                push.call($result, prevSib);
            });
            if (arguments.length == 0) {
                return $result;
            } else {
                var $result2 = $();
                var $filter = jQuery(arguments[0]);
                $result.each(function () {
                    var result = this;
                    $filter.each(function () {
                        if (result === this) {
                            push.call($result2, this);
                        }
                    });
                });
                return $result2;
            }
        },
        prevAll: function () {
            var $result = $();
            this.each(function () {
                var prevDoms = jQuery.prevAllDomsFinal(this);
                var self = this;
                jQuery.each(prevDoms, function () {
                    //判断是否重复
                    if ($result.indexOf(this) == -1) {
                        push.call($result, this);
                    }
                });
            });
            return $result;
        }
    });

    jQuery.extend({
        valHooks: {
            select: {
                /**
                 *
                 * @param dom元素
                 * @returns 如果单选返回选中的option的value，如果是多选返回选中的文本组成数组
                 */
                get: function (dom) {
                    var isMutiple = dom.multiple;
                    var childrenOpts = dom.childNodes;

                    jQuery.each(childrenOpts, function () {
                        //要求子节点：1.是标签节点  2.节点名是OPTION   3.该节点selected属性为true--->被选中
                        if (this.nodeType == 1 && jQuery.nodeName(this, "option") && this.selected) {
                            var optVal = jQuery.valHooks["option"].get(this);
                            if (!isMutiple) {
                                //单选-->返回value
                                return optVal;
                            } else {
                                //复选-->返回数组
                                return push(optVal);
                            }
                            ;
                        }
                    });
                },
                /**
                 * $.valHooks.select.set(dom,"3");
                 * $.valHooks.select.set(dom,["3","5"]);
                 * @param dom
                 * @param values
                 * 如果设置的值与下面的某个option的value值匹配就选中某个option，如果都不匹配就取消选中（selectedIndex = -1;
                 */
                set: function (dom, values) {
                    values = jQuery.makeArray(values);
                    var isExist = false;
                    for (var i = 0; i < values.length; i++) {
                        var childrenOpts = dom.childNodes;
                        for (var j = 0; j < childrenOpts.length; j++) {
                            var childOpt = childrenOpts[j];
                            if (childOpt.nodeType == 1 && jQuery.valHooks.option.get(childOpt) === childOpt.values[i]) {
                                childOpt.selected = "true";
                                isExist = true;
                            }
                        }
                        ;
                    }
                    ;
                    if (!isExist) {
                        childOpt.selectedIndex = 1;
                    }
                }
            },
            option: {
                /**
                 *
                 * @param dom元素
                 * @returns 返回value属性的值或者文本
                 */
                get: function (dom) {
                    return dom.getAttributeNode("value") || getContent(dom);
                }
            }
        }
    });

    jQuery.each(("checkbox radio").split(" "), function () {
        jQuery.valHooks[this] = {
            /**
             *
             * @param dom元素
             * @returns 如果存在value属性就返回value属性的值，反之返回"on"
             */
            get: function (dom) {
                return dom.getAttribute("value") || "on";
            },
            /**
             *
             * @param dom
             * @param isChecked
             * 如果设置的值与checkbox的value属性匹配，就选中它(checked=true)
             */
            set: function (dom, isChecked) {
                dom.checked = isChecked;
            }
        }
    })

    jQuery.each(("text button textarea").split(" "), function () {
        jQuery.valHooks[this] = {
            /**
             *
             * @param dom元素
             * @returns 文本框、按钮、textarea：返回value属性的值
             */
            get: function (dom) {
                return dom.getAttribute("value");
            },
            /**
             *
             * @param dom
             * @param value
             * 文本框、按钮、textarea：直接设置value属性的值
             */
            set: function (dom, value) {
                dom.value = value;
            }
        }
    })

    jQuery.extend({
        nodeName: function (ele, tagName) {
            return ele.nodeName === tagName.toUpperCase();
        },
        /**
         *
         * @param dom   查询该元素的下一个兄弟元素
         * @returns {*} 递归函数
         * @returns {*} 返回下一个兄弟元素
         */
        nextDom: function (dom) {
            var nextSib = dom.nextSibling;
            if (nextSib == null) return null;
            if (nextSib.nodeType !== 1) {
                return jQuery.nextDom(nextSib);
            } else {
                return nextSib;
            }
            ;
        },
        /**
         *
         * @param result  数组用于储存所有的兄弟元素
         * @param dom     查询该元素的兄弟元素
         */
        nextAllDoms: function (result, dom) {
            var $nextDom = jQuery.nextDom(dom);
            //下一个元素是否存在
            if ($nextDom) {
                result.push($nextDom);
                //递归，不断查询其兄弟元素
                jQuery.nextAllDoms(result, $nextDom);
            }
        },
        /**
         *
         * 多一个函数，只为了少一个参数需要传递，更利于用户使用
         * 因为需要递归使用，如果在函数内部赋值result=[]，则无法保存上次数据，而且会重新清空，
         * 当然可以定义一个全局变量resul=[]，不过全局变量...你懂的
         * @param dom       查询该元素
         * @returns {Array} 所有兄弟元素
         */
        nextAllDomsFinal: function (dom) {
            var result = [];
            jQuery.nextAllDoms(result, dom);
            return result;
        },
        prevDom: function (dom) {
            var prevSib = dom.previousSibling;
            if (prevSib == null) return null;
            if (prevSib.nodeType !== 1) {
                return jQuery.prevDom(prevSib);
            } else {
                return prevSib;
            }
            ;
        },
        prevAllDoms: function (result, dom) {
            var $prevDom = jQuery.prevDom(dom);
            //上一个元素是否存在
            if ($prevDom) {
                result.push($prevDom);
                //递归，不断查询其兄弟元素
                jQuery.prevAllDoms(result, $prevDom);
            }
        },
        prevAllDomsFinal: function (dom) {
            var result = [];
            jQuery.prevAllDoms(result, dom);
            return result;
        }
    });

    jQuery.fn.extend({
        indexOf: function (node) {
            var index = -1;
            this.each(function () {
                if (this === node) {
                    index = arguments[0];
                }
            });
            return index;
        }
    });


    /**
     *
     * 事件绑定、解绑
     *
     */
    jQuery.each("on off".split(" "), function (i, fnName) {
        jQuery.fn[fnName] = function (type, callback) {
            return this.each(function () {
                this[fnName === "on" ? "addEventListener" : "removeEventListener"](type, callback);
            });
        };
    });

    var eventTypes = "load,click,dblclick,mouseenter,mouseleave,mouseover,mouseout,mousemove,keydown,keyup,keypress".split(",");

    jQuery.each(eventTypes, function () {
        var event = this;
        jQuery.fn[event] = function (callback) {
            return this.on(event, callback);
        };
    });

    window.$ = window.jQuery = jQuery;
})();
