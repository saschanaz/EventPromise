﻿/*
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

module EventPromise {
    export function waitEvent<T extends Event>(target: EventTarget, eventName: string) {
        return new Promise<T>((resolve, reject) => {
            var eventListener = (event: T) => {
                target.removeEventListener(eventName, eventListener);
                resolve(event);
            };
            target.addEventListener(eventName, eventListener);
        });
    }

    export function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any) {
        var base = createSubscriptionBase(target, eventName, listener);
        target.addEventListener(eventName, base.eventListener);
        return base.subscription;
    }

    export function subscribeBlank() {
        var subscription = createChainableBase();
        subscription.cease = (options: EventCessationOptions) => { };
        subscription.cessation = Promise.resolve();
        return subscription;
    }

    function createSubscriptionBase<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any) {
        var oncessation: () => void;
        var onerror: (error: any) => void;
        var subscription = createChainableBase();
        subscription.cease = (options: EventCessationOptions = {}) => {
            if (subscription.previous)
                subscription.previous.cease({ silently: true });
            target.removeEventListener(eventName, eventListener);
            if (options.error)
                onerror(options.error);
            else if (!options.silently)
                oncessation();
        };
        subscription.cessation = new Promise<void>((resolve, reject) => {
            oncessation = () => resolve();
            onerror = (error) => reject(error);
        });

        var eventListener = (event: T) => {
            listener.call(target, event, subscription);
        };
        return { subscription, eventListener };
    }

    function createChainableBase(): EventSubscription {
        var chainable: EventSubscription = {
            cease: null,
            cessation: null,
            chain<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any) {
                var chained = createSubscriptionBase(target, eventName, listener);
                chainable.cessation.then(() => target.addEventListener(eventName, chained.eventListener));
                chained.subscription.previous = chainable;
                return chained.subscription;
            }
        };
        return chainable;
    }

    export interface EventSubscription {
        previous?: EventSubscription;
        cease(options?: EventCessationOptions): void;
        cessation: Promise<void>;
        chain<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
    }

    export interface EventCessationOptions {
        silently?: boolean;
        error?: any;
    }
}

interface Contract<T> extends Promise<T> {
    previous?: Contract<any>;

    finish(value?: T): void;
    cancel(reason?: any): void;
    invalidate(): void;
    chain<TNext>(next: (value: T) => Contract<TNext>): Contract<TNext>;
}
interface ContractControl<T> {
    resolve(value?: T | Promise<T>): void;
    reject(reason?: any): void;
    forget(): void;
}
interface ContractEntrance<T> {
    init: (resolve: (value?: T | Promise<T>) => void, reject: (reason?: any) => void) => void;
    revert: () => void;
}
// TODO: How can a Contract receive external canceling event? - Resolved: revert() function - to be called in .cancel()/.invalidate()

interface ContractConstructor {
    prototype: Contract<any>;
    new <T>(entrance: ContractEntrance<T>): Contract<T>;
    
    resolve(): Contract<void>;
    reject(): Contract<void>;
}


/*
Contract class code is based on `contract.ts` output.
*/
var Contract: ContractConstructor = <any>(function (_super: any) {
    var Contract: any = function (_a: any) {
        var _this = this;
        var init = _a.init, revert = _a.revert;
        _super.call(this, function (resolve: any, reject: any) {
            var chainedRevert = function () {
                if (_this.previous)
                    _this.previous.invalidate();
                revert();
            };
            _this.finish = function (value: any) {
                chainedRevert();
                resolve(value);
            };
            _this.cancel = function (error: any) {
                chainedRevert();
                reject(error);
            };
            _this.invalidate = function () { return chainedRevert(); };
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

    Contract.prototype.chain = function (next: any) {
        var _this = this;
        var nextContract = new Contract({
            init: function (resolve: any, reject: any) {
                _this.then(function (value: any) { return next(value); }).then(function (value: any) { return resolve(value); }, function (reason: any) { return reject(reason); });
            },
            revert: function () { }
        });
        nextContract.previous = this;
        return nextContract;
    };
    return Contract;
})(Promise);

new Contract<number>({ init: (resolve, reject) => { }, revert: () => { } });