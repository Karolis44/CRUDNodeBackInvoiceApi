/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ (() => {

if (document.querySelector('[data-msg]')) {
  var msg = document.querySelector('[data-msg]');
  setTimeout(function (_) {
    msg.remove();
  }, 3000);
}
var items = document.querySelectorAll('[data-item]');
var itemTotalUpdater = function itemTotalUpdater(_) {
  items.forEach(function (item) {
    var qtyEl = item.querySelector('[data-item-qty]');
    var discEurEl = item.querySelector('[data-item-discount-eur]');
    var discPEl = item.querySelector('[data-item-discount-p]');
    var qty = parseInt(item.querySelector('[data-item-qty]').value);
    var price = parseFloat(item.querySelector('[data-item-price]').innerText);
    var discEur = parseFloat(item.querySelector('[data-item-discount-eur]').value);
    var discP = parseFloat(item.querySelector('[data-item-discount-p]').value);
    var itemTotal = item.querySelector('[data-item-discounted-total]');
    qtyEl.addEventListener('input', function (e) {
      qty = parseInt(item.querySelector('[data-item-qty]').value);
      var total;
      if (discEur && discEur > 0) {
        total = qty * price - discEur;
      } else {
        total = qty * price;
      }
      total > 0 ? total : total = 0;
      discP = discEur * 100 / (price * qty);
      if (discP <= 0 || !discP) {
        discP = '';
      } else if (discP > 100) {
        discEur = qty * price;
        discP = 100;
        discP = parseFloat(discP).toFixed(2);
      }
      if (!discEur) {
        discEur = '';
      } else {
        discEur = parseFloat(discEur).toFixed(2);
      }
      ;
      discEurEl.value = discEur;
      discPEl.value = discP;
      itemTotal.innerText = total.toFixed(2);
      totalsUpdater();
    });
    discEurEl.addEventListener('input', function (e) {
      discEur = parseFloat(item.querySelector('[data-item-discount-eur]').value);
      var total;
      if (discEur && discEur > 0) {
        total = qty * price - discEur;
      } else {
        total = qty * price;
      }
      total > 0 ? total : total = 0;
      itemTotal.innerText = total.toFixed(2);
      discPEl.value = (discEur * 100 / (price * qty)).toFixed(2);
      if (discEur === 0 || !discEur || discEur < 0) {
        discPEl.value = '';
      } else if (discEur > total) {
        discPEl.value = 100;
      }
      totalsUpdater();
    });
    discPEl.addEventListener('input', function (e) {
      discP = parseFloat(item.querySelector('[data-item-discount-p]').value);
      discEur = price * qty - price * qty * (1 - discP / 100);
      var total;
      if (discEur && discEur > 0) {
        total = qty * price - discEur;
      } else {
        total = qty * price;
      }
      total > 0 ? total : total = 0;
      itemTotal.innerText = total.toFixed(2);
      if (discP === 0 || !discP || discP < 0) {
        discEur = '';
      } else if (discP > 100) {
        discEur = (price * qty).toFixed(2);
      } else {
        discEur = discEur.toFixed(2);
      }
      ;
      discEurEl.value = discEur;
      totalsUpdater();
    });
  });
};
var totalsUpdater = function totalsUpdater(_) {
  var subtotal = 0;
  var vat = 0;
  var totalDiscounts = 0;
  var subtotalHtml = document.querySelector('[data-pre-total]');
  var shipping = document.querySelector('[data-shipping-price]').innerText;
  shipping = parseFloat(shipping);
  var vatHtml = document.querySelector('[data-vat]');
  var totalDiscountsHtml = document.querySelector('[data-total-discounts]');
  var grandTotalHtml = document.querySelector('[data-total-final]');
  items.forEach(function (item) {
    var qty = parseInt(item.querySelector('[data-item-qty]').value);
    var price = parseFloat(item.querySelector('[data-item-price]').innerText);
    var discEur = parseFloat(item.querySelector('[data-item-discount-eur]').value);
    if (!discEur) {
      discEur = 0;
    }
    ;
    console.log(discEur);
    var itemTotal = qty * price;
    subtotal += itemTotal;
    totalDiscounts += discEur;
  });
  vat = (subtotal + shipping) * 0.21;
  subtotalHtml.innerText = subtotal.toFixed(2);
  vatHtml.innerText = vat.toFixed(2);
  totalDiscountsHtml.innerText = totalDiscounts.toFixed(2);
  grandTotalHtml.innerText = (subtotal + shipping + vat - totalDiscounts).toFixed(2);
};
var init = function init(_) {
  itemTotalUpdater();
};
init();

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/invstyle.scss":
/*!***************************!*\
  !*** ./src/invstyle.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/public/app": 0,
/******/ 			"public/invstyle": 0,
/******/ 			"public/style": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkinvoiceapicrud"] = self["webpackChunkinvoiceapicrud"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["public/invstyle","public/style"], () => (__webpack_require__("./src/app.js")))
/******/ 	__webpack_require__.O(undefined, ["public/invstyle","public/style"], () => (__webpack_require__("./src/style.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["public/invstyle","public/style"], () => (__webpack_require__("./src/invstyle.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;