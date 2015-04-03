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
    var Contract = (function (_super) {
        __extends(Contract, _super);
        function Contract(init, options) {
            if (options === void 0) { options = {}; }
            var resolver;
            var rejector;
            var revert = options.revert;
            var chainedRevert = function () {
                if (newThis.previous)
                    newThis.previous.invalidate();
                singleRevert();
            };
            var singleRevert = function () {
                breakMethods();
                if (revert)
                    revert(newThis.status);
                revert = null;
            };
            var changeStatusDelayed = function (status) {
                var change = function () { return newThis.status = status; };
                newThis ? change() : Promise.resolve().then(change);
            };
            var breakMethods = function () {
                newThis.finish = newThis.cancel = newThis.invalidate = function () { };
            };
            var listener = function (resolve, reject) {
                resolver = resolve;
                rejector = reject;
                init(function (value) { changeStatusDelayed("resolved"); singleRevert(); resolve(value); }, function (reason) { changeStatusDelayed("rejected"); singleRevert(); reject(reason); });
            };
            var subclassj = !!window.SubclassJ && SubclassJ.required;
            var newThis = subclassj ? SubclassJ.getNewThis(Contract, Promise, [listener]) : this;
            if (!subclassj)
                _super.call(this, listener);
            newThis.status = "unresolved";
            newThis.finish = function (value) { newThis.status = "resolved"; chainedRevert(); resolver(value); };
            newThis.cancel = function (error) { newThis.status = "rejected"; chainedRevert(); rejector(error); };
            newThis.invalidate = function () {
                newThis.status = "invalidated";
                chainedRevert();
            };
            return newThis;
        }
        Contract.prototype.chain = function (next) {
            var _this = this;
            // ISSUE 1: Two Contract objects here will not always have same status while they should.
            // ISSUE 2: .invalidate() within constructor will not run chainedRevert()
            var nextContract = new Contract(function (resolve, reject) {
                _this.then(function (value) { return next(value); })
                    .then(function (value) { return resolve(value); }, function (reason) { return reject(reason); });
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
        return new EventPromise.Contract(function (resolve, reject) {
            eventListener = function (evt) { return resolve(evt); };
            target.addEventListener(eventName, eventListener);
        }, {
            revert: function () { return target.removeEventListener(eventName, eventListener); }
        });
    }
    EventPromise.waitEvent = waitEvent;
    function subscribeEvent(target, eventName, listener) {
        var eventListener = function (evt) { return listener.call(target, evt, contract); };
        var contract = new EventPromise.Contract(function (resolve, reject) {
            target.addEventListener(eventName, eventListener);
        }, {
            revert: function () { return target.removeEventListener(eventName, eventListener); }
        });
        return contract;
    }
    EventPromise.subscribeEvent = subscribeEvent;
})(EventPromise || (EventPromise = {}));
//new Contract<number>({ init: (resolve, reject) => { }, revert: () => { } });
//# sourceMappingURL=eventpromise.js.map