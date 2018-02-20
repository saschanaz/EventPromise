declare module EventPromise {
    function waitEvent<T extends Event>(target: EventTarget, eventName: string): CancelablePromise<T>;
    function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (evt: T, contract: CancelablePromise<any>) => any): CancelablePromise<{}>;
}
