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
        function Contract(_a) {
            var _this = this;
            var init = _a.init, revert = _a.revert;
            _super.call(this, function (resolve, reject) {
                var chainedRevert = function () {
                    if (_this.previous)
                        _this.previous.invalidate();
                    if (revert)
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
                init(function (value) {
                    if (revert)
                        revert();
                    resolve(value);
                }, function (reason) {
                    if (revert)
                        revert();
                    reject(reason);
                });
            });
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
/*
Contract class code is based on `contract.ts` output.
*/
var Contract = EventPromise.Contract;
new Contract({
    init: function (resolve, reject) {
    },
    revert: function () {
    }
});
//# sourceMappingURL=eventpromise.js.map