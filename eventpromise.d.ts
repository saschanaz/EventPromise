/// <reference path="submodules/subclassj/subclassj.d.ts" />
declare var __extends: (d: any, b: any) => void;
declare module EventPromise {
    module _Temp {
        class Promise<T> {
            constructor(init: (resolve: (value?: T | Promise<T>) => void, reject: (reason?: any) => void) => void);
            then<TResult>(onfulfilled?: (value: T) => TResult | Promise<TResult>, onrejected?: (reason: any) => TResult | Promise<TResult>): Promise<TResult>;
            catch(onrejected?: (reason: any) => T | Promise<T>): Promise<T>;
            static all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
            static all(values: Promise<void>[]): Promise<void>;
            static race<T>(values: (T | Promise<T>)[]): Promise<T>;
            static reject(reason: any): Promise<void>;
            static reject<T>(reason: any): Promise<T>;
            static resolve<T>(value: T | Promise<T>): Promise<T>;
            static resolve(): Promise<void>;
        }
    }
    class Contract<T> extends _Temp.Promise<T> {
        previous: Contract<any>;
        status: string;
        finish: (value: T | Promise<T>) => void;
        cancel: (error: any) => void;
        invalidate: () => void;
        constructor(init: (resolve: (value?: T | Promise<T>) => void, reject: (reason?: any) => void) => void, options?: ContractOptionBag<T>);
        chain<TNext>(next: (value: T) => Contract<TNext>): Contract<TNext>;
    }
}
interface Window {
    SubclassJ: typeof SubclassJ;
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
interface ContractOptionBag<T> {
    /** Reverting listener for a contract. This will always be called after a contract gets finished in any status. */
    revert?: (status: string) => void;
}
interface ContractConstructor {
    prototype: Contract<any>;
    new <T>(init: (resolve: (value?: T | Promise<T>) => void, reject: (reason?: any) => void) => void, options: ContractOptionBag<T>): Contract<T>;
}
declare var Contract: ContractConstructor;
declare module EventPromise {
    function waitEvent<T extends Event>(target: EventTarget, eventName: string): Contract<T>;
    function subscribeEvent<T extends Event>(target: EventTarget, eventName: string, listener: (evt: T, contract: Contract<any>) => any): Contract<T>;
}
