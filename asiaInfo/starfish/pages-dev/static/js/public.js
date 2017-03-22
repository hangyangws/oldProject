/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-10-08.
 * public.js
 * return F -> friday(my english name)
 */

// 元素matches兼容(类似jQuery的is)
// ;
// ! function(ePrototype) {
//     ePrototype.matches =
//         ePrototype.matches ||
//         ePrototype.matchesSelector ||
//         ePrototype.webkitMatchesSelector ||
//         ePrototype.msMatchesSelector ||
//         function(s) {
//             var node = this,
//                 nodes = (node.parentNode || doc).querySelectorAll(s),
//                 i = -1;
//             while (nodes[++i] && nodes[i] != node);
//             return !!nodes[i];
//         }
// }(Element.prototype);

// ! function(win) {
//     'use strict';
//     // DOM operation
//     var doc = document,
//         friday = {
//             // DOM获取
//             DOM: function(s, dom) {
//                 dom = dom || doc;
//                 return /^#\w+$/.test(s) ? dom.querySelector(s) : dom.querySelectorAll(s);
//             },
//             closest: function(e, s) {
//                 while (e) {
//                     if (e.matches(s)) {
//                         return e;
//                     } else {
//                         e = e.parentElement;
//                     }
//                 }
//                 return null;
//             }
//         };

//     win.F = friday;
// }(window || this);
//
//
//
// fastclick.js兼容
(function(win, undefined) {
    win.FastClick && FastClick.attach(document.body);
    win.method = /AppleWebKit.*Mobile.*/.test(navigator.userAgent) ? 'tap' : 'click'; // 事件
})(window || this);
