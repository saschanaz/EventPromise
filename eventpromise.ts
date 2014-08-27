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
        var oncessation: () => any;
        var subscription: EventSubscription = {
            cease() {
                target.removeEventListener(eventName, eventListener);
                oncessation();
            },
            cessation: new Promise<void>((resolve, reject) => {
                oncessation = () => {
                    resolve(undefined);
                };
            })
        };

        var eventListener = (event: T) => {
            listener.call(target, event, subscription);
        };
        target.addEventListener(eventName, eventListener);
        return subscription;
    }

    export interface EventSubscription {
        cease(): void;
        cessation: Promise<void>
    }
}