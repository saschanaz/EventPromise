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
var EventPromise;
(function (EventPromise) {
    function waitEvent(target, eventName) {
        return new Promise(function (resolve, reject) {
            var eventListener = function (event) {
                target.removeEventListener(eventName, eventListener);
                resolve(event);
            };
            target.addEventListener(eventName, eventListener);
        });
    }
    EventPromise.waitEvent = waitEvent;
    function subscribeEvent(target, eventName, listener) {
        var base = createSubscriptionBase(target, eventName, listener);
        target.addEventListener(eventName, base.eventListener);
        return base.subscription;
    }
    EventPromise.subscribeEvent = subscribeEvent;
    function subscribeBlank() {
        var subscription = createChainableBase();
        subscription.cease = function (options) { };
        subscription.cessation = Promise.resolve();
        return subscription;
    }
    EventPromise.subscribeBlank = subscribeBlank;
    function createSubscriptionBase(target, eventName, listener) {
        var oncessation;
        var onerror;
        var subscription = createChainableBase();
        subscription.cease = function (options) {
            if (options === void 0) { options = {}; }
            if (subscription.previous)
                subscription.previous.cease({ silently: true });
            target.removeEventListener(eventName, eventListener);
            if (options.error)
                onerror(options.error);
            else if (!options.silently)
                oncessation();
        };
        subscription.cessation = new Promise(function (resolve, reject) {
            oncessation = function () { return resolve(); };
            onerror = function (error) { return reject(error); };
        });
        var eventListener = function (event) {
            listener.call(target, event, subscription);
        };
        return { subscription: subscription, eventListener: eventListener };
    }
    function createChainableBase() {
        var chainable = {
            cease: null,
            cessation: null,
            chain: function (target, eventName, listener) {
                var chained = createSubscriptionBase(target, eventName, listener);
                chainable.cessation.then(function () { return target.addEventListener(eventName, chained.eventListener); });
                chained.subscription.previous = chainable;
                return chained.subscription;
            }
        };
        return chainable;
    }
})(EventPromise || (EventPromise = {}));
/*
Contract class code is based on `contract.ts` output.
*/
var Contract = (function (_super) {
    var Contract = function (_a) {
        var _this = this;
        var init = _a.init, revert = _a.revert;
        _super.call(this, function (resolve, reject) {
            var chainedRevert = function () {
                if (_this.previous)
                    _this.previous.invalidate();
                revert();
            };
            _this.finish = function (value) {
                chainedRevert();
                resolve(value);
            };
            _this.cancel = function (error) {
                chainedRevert();
                reject(error);
            };
            _this.invalidate = function () {
                return chainedRevert();
            };
            init(resolve, reject);
        });
    };
    (function () {
        Contract.prototype = Object.create(Promise.prototype, {
            constructor: {
                value: Contract,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        Contract.__proto__ = Promise;
    })();
    //__extends(Contract, _super);
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
            revert: function () { }
        });
        nextContract.previous = this;
        return nextContract;
    };
    return Contract;
})(Promise);
new Contract({ init: function (resolve, reject) { }, revert: function () { } });
//# sourceMappingURL=eventpromise.js.map