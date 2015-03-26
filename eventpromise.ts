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

// Modified for Win10 10041 EdgeHTML bug workaround
var __extends = function (d: any, b: any) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  d.prototype = Object.create(b.prototype);
  d.__proto__ = b;
};

module EventPromise {
  export module _Temp {
    export declare class Promise<T> {
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
  (<any>_Temp).Promise = Promise;

  export class Contract<T> extends _Temp.Promise<T> {
    previous: Contract<any>;
    status: string;

    finish: (value: T | Promise<T>) => void;
    cancel: (error: any) => void;
    invalidate: () => void;
    
    constructor({init, revert}: ContractEntrance<T>) {
      super((resolve, reject) => {
        // TODO: implement SubclassJ
        let newThis = this;

        var chainedRevert = () => {
          if (newThis.previous)
            newThis.previous.invalidate();
          singleRevert();
        };
        var singleRevert = () => {
          if (revert)
            revert(newThis.status);
        }


        newThis.finish = (value) => { newThis.status = "resolved"; chainedRevert(); resolve(value); };
        newThis.cancel = (error) => { newThis.status = "rejected"; chainedRevert(); reject(error) };
        newThis.invalidate = () => { newThis.status = "invalidated"; chainedRevert(); }
        init(
          (value) => { newThis.status = "resolved"; singleRevert(); resolve(value) },
          (reason?) => { newThis.status = "rejected"; singleRevert(); reject(reason) }
          );

        return newThis;
      });
    }

    chain<TNext>(next: (value: T) => Contract<TNext>): Contract<TNext> {
      var nextContract = new Contract<TNext>({
        init: (resolve, reject) => {
          this.then((value) => next(value))
            .then((value) => resolve(value), (reason) => reject(reason));
        },
        revert: () => { }
      });
      nextContract.previous = this;
      return nextContract;
    }
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
  /** Initiating listener for a contract. */
  init: (resolve: (value?: T | Promise<T>) => void, reject: (reason?: any) => void) => void;
  /** Reverting listener for a contract. This will always be called after a contract gets finished in any status. */
  revert?: (status: string) => void;
}

interface ContractConstructor {
    prototype: Contract<any>;
    new <T>(entrance: ContractEntrance<T>): Contract<T>;
}

var Contract: ContractConstructor = EventPromise.Contract;

//new Contract<number>({ init: (resolve, reject) => { }, revert: () => { } });
