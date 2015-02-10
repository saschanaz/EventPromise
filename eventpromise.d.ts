declare module EventPromise {
    function waitEvent<T extends Event>(target: EventTarget, eventName: string): Promise<T>;
    function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
    function subscribeBlank(): EventSubscription;
    interface EventSubscription {
        previous?: EventSubscription;
        cease(options?: EventCessationOptions): void;
        cessation: Promise<void>;
        chain<T extends Event>(target: EventTarget, eventName: string, listener: (ev: T, subscription: EventSubscription) => any): EventSubscription;
    }
    interface EventCessationOptions {
        silently?: boolean;
        error?: any;
    }
}
declare class Contract<T> extends Promise<T> {
}
declare var c: Contract<number>;
