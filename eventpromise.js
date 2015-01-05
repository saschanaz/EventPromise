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
        var oncessation;
        var onerror;
        var subscription = {
            cease: function (options) {
                if (options === void 0) { options = {}; }
                if (subscription.previous)
                    subscription.previous.cease({ silently: true });
                target.removeEventListener(eventName, eventListener);
                if (options.error)
                    onerror(options.error);
                else if (!options.silently)
                    oncessation();
            },
            cessation: new Promise(function (resolve, reject) {
                oncessation = function () { return resolve(); };
                onerror = function (error) { return reject(error); };
            }),
            chain: function (target, eventName, listener) {
                var chained = subscribeEvent(target, eventName, listener);
                chained.previous = subscription;
                return chained;
            }
        };
        var eventListener = function (event) {
            listener.call(target, event, subscription);
        };
        target.addEventListener(eventName, eventListener);
        return subscription;
    }
    EventPromise.subscribeEvent = subscribeEvent;
})(EventPromise || (EventPromise = {}));
//# sourceMappingURL=eventpromise.js.map