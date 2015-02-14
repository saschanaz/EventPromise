var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Contract = (function (_super) {
    __extends(Contract, _super);
    function Contract(_a) {
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
            _this.invalidate = function () { return chainedRevert(); };
            init(resolve, reject);
        });
    }
    Contract.prototype.chain = function (next) {
        var _this = this;
        var nextContract = new Contract({
            init: function (resolve, reject) {
                _this.then(function (value) { return next(value); }).then(function (value) { return resolve(value); }, function (reason) { return reject(reason); });
            },
            revert: function () { }
        });
        nextContract.previous = this;
        return nextContract;
    };
    return Contract;
})(Promise);
//# sourceMappingURL=contract.js.map