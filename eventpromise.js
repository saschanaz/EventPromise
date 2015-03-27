/*
The MIT License(MIT)

Copyright(c) 2014 SaschaNaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files(the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="submodules/subclassj/subclassj.d.ts" />
// Modified for Win10 10041 EdgeHTML bug workaround
var __extends = function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    d.prototype = Object.create(b.prototype);
    d.__proto__ = b;
};
var EventPromise;
(function (EventPromise) {
    var _Temp;
    (function (_Temp) {
    })(_Temp = EventPromise._Temp || (EventPromise._Temp = {}));
    _Temp.Promise = Promise;
    var setImmediate = window.setImmediate || function (expression) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return window.setTimeout.apply(window, [expression, 0].concat(args));
    };
    var Contract = (function (_super) {
        __extends(Contract, _super);
        function Contract(_a) {
            var init = _a.init, revert = _a.revert;
            var resolver;
            var rejector;
            var chainedRevert = function () {
                if (newThis.previous)
                    newThis.previous.invalidate();
                singleRevert();
            };
            var singleRevert = function () {
                if (!revert)
                    return;
                revert(newThis.status);
                delete revert;
            };
            var changeStatus = function (status) {
                var change = function () {
                    newThis.status = status;
                    singleRevert();
                };
                if (newThis)
                    change();
                else
                    setImmediate(change);
            };
            var listener = function (resolve, reject) {
                resolver = resolve;
                rejector = reject;
                init(function (value) {
                    changeStatus("resolved");
                    resolve(value);
                }, function (reason) {
                    changeStatus("rejected");
                    reject(reason);
                });
            };
            var subclassj = !!window.SubclassJ && SubclassJ.required;
            var newThis = subclassj ? SubclassJ.getNewThis(Contract, Promise, [
                listener
            ]) : this;
            if (!subclassj)
                _super.call(this, listener);
            newThis.status = "unresolved";
            newThis.finish = function (value) {
                changeStatus("resolved");
                resolver(value);
            };
            newThis.cancel = function (error) {
                changeStatus("rejected");
                rejector(error);
            };
            newThis.invalidate = function () {
                newThis.finish = newThis.cancel = function () {
                };
                changeStatus("invalidated");
            };
            return newThis;
        }
        Contract.prototype.chain = function (next) {
            var _this = this;
            var nextContract = new Contract({
                init: function (resolve, reject) {
                    _this.then(function (value) {
                        return next(value);
                    }).then(function (value) {
                        return resolve(value);
                    }, function (reason) {
                        return reject(reason);
                    });
                },
                revert: function () {
                }
            });
            nextContract.previous = this;
            return nextContract;
        };
        return Contract;
    })(_Temp.Promise);
    EventPromise.Contract = Contract;
})(EventPromise || (EventPromise = {}));
var Contract = EventPromise.Contract;
//new Contract<number>({ init: (resolve, reject) => { }, revert: () => { } });
/*
The MIT License(MIT)

Copyright(c) 2014 SaschaNaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files(the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
///<reference path="contract.ts" />
var EventPromise;
(function (EventPromise) {
    function waitEvent(target, eventName) {
        var eventListener;
        return new EventPromise.Contract({
            init: function (resolve, reject) {
                eventListener = function (evt) {
                    return resolve(evt);
                };
                target.addEventListener(eventName, eventListener);
            },
            revert: function () {
                return target.removeEventListener(eventName, eventListener);
            }
        });
    }
    EventPromise.waitEvent = waitEvent;
})(EventPromise || (EventPromise = {}));
//new Contract<number>({ init: (resolve, reject) => { }, revert: () => { } });
//# sourceMappingURL=eventpromise.js.map