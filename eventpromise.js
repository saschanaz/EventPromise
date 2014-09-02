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
                if (typeof options === "undefined") { options = {}; }
                target.removeEventListener(eventName, eventListener);
                if (options.error)
                    onerror(options.error);
                else if (!options.silently)
                    oncessation();
            },
            cessation: new Promise(function (resolve, reject) {
                oncessation = function () {
                    return resolve();
                };
                onerror = function (error) {
                    return reject(error);
                };
            })
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
