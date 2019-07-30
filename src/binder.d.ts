export interface ObjectMap<T> {
    [key: string]: T | undefined;
}

export type Binder<T, MODE=binderMode.DefaultMode> = binderInternals.InternalBaseBinder<T, MODE> & binderInternals.InternalBinder<T, MODE>;
export type PBinder<T, MODE=binderMode.PreInitializedMode> = Binder<T, MODE>;
export type PFBinder<T, MODE=binderMode.PreInitializedAndIncludeFunctionsMode> = Binder<T, MODE>;
export type FBinder<T, MODE=binderMode.IncludeFunctionsMode> = Binder<T, MODE>;

export declare function createBinder<T>(value: T, update?: binderUtils.UpdateBinder<T, binderMode.DefaultMode>, initialize?: binderUtils.InitializeValueBinder<binderMode.DefaultMode>): Binder<T, binderMode.DefaultMode>;
export declare function createBinderIncludingFunctions<T>(value: T, update?: binderUtils.UpdateBinder<T, binderMode.IncludeFunctionsMode>, initialize?: binderUtils.InitializeValueBinder<binderMode.IncludeFunctionsMode>): Binder<T, binderMode.IncludeFunctionsMode>;
export declare function createPreInitializedBinder<T>(value: T, update?: binderUtils.UpdateBinder<T, binderMode.PreInitializedMode>, initialize?: binderUtils.InitializeValueBinder<binderMode.PreInitializedMode>): Binder<T, binderMode.PreInitializedMode>;
export declare function createPreInitializedBinderIncludingFunctions<T>(value: T, update?: binderUtils.UpdateBinder<T, binderMode.PreInitializedAndIncludeFunctionsMode>, initialize?: binderUtils.InitializeValueBinder<binderMode.PreInitializedAndIncludeFunctionsMode>): Binder<T, binderMode.PreInitializedAndIncludeFunctionsMode>;

export declare function withBinderMode<MODE>(): binderUtils.BinderCreator<MODE>;
export declare function withSameBinderMode<MODE>(otherBinder: Binder<any, MODE>): binderUtils.BinderCreator<MODE>;

export declare function isBinder<T, Q = any, MODE = binderMode.DefaultMode>(maybeBinder: T | Binder<Q, MODE>): maybeBinder is Binder<Q, MODE>;

export declare function deriveBinderFrom<SOURCE, DERIVED, MODE_SOURCE, MODE_TARGET>(
    sourceBinder: Binder<SOURCE, MODE_SOURCE>,
    createDerivedBinder: (sourceBinder: Binder<SOURCE, MODE_SOURCE>) => Binder<DERIVED, MODE_TARGET>,
    setSourceValue: (sourceBinder: Binder<SOURCE, MODE_SOURCE>, newDerivedBinder: Binder<DERIVED, MODE_TARGET>) => Binder<SOURCE, MODE_SOURCE>,
    derivationName: string
): Binder<DERIVED, MODE_TARGET>;

export declare function notBinder<MODE>(source: Binder<boolean, MODE>): Binder<boolean, MODE>;
export declare var inheritedExtras: string[];

/* Compatibility definitions */
export type ArrayBinder<T, MODE=binderMode.DefaultMode> = Binder<T[], MODE>;
export type ObjectBinder<T/* extends object *//*commented for compatibity reason*/, MODE=binderMode.DefaultMode> = Binder<T, MODE>;
export type MapBinder<T, MODE=binderMode.DefaultMode> = Binder<ObjectMap<T>, MODE>;

export declare module binderMode {
    export type DefaultMode = { defaultMode: 'defaultMode' };
    export type PreInitializedMode = DefaultMode & { preInitializedMode: 'preInitializedMode' };
    export type IncludeFunctionsMode = DefaultMode & { includeFunctionsMode: 'includeFunctionsMode' };
    export type PreInitializedAndIncludeFunctionsMode = PreInitializedMode & IncludeFunctionsMode;
}

/*
 * Utils types, It is not the intention that you have have your own variables explicitly typed with this types
 * This definitions can appear in the public interfaces
 */
declare module binderUtils {
    type UpdateBinder<T, MODE> = (newRootBinder: Binder<T, MODE>, newBinder: Binder<any, MODE>, oldBinder: Binder<any, MODE>) => void;
    type InitializeValueBinder<MODE> = (newValue: any, oldBinder: Binder<any, MODE>) => any;

    interface DerivedBinderFrom {
        sourceBinder: Binder<any, any>
        createDerivedBinder: (sourceBinder: Binder<any, any>) => Binder<any, any>
        setSourceValue: (sourceBinder: Binder<any, any>, newDerivedBinder: Binder<any, any>) => Binder<any, any>
        derivationName: string
    }

    interface BinderCreator<MODE> {
        createBinder<T>(value: T, update?: UpdateBinder<T, MODE>, initialize?: InitializeValueBinder<MODE>): Binder<T, MODE>
    }

    type AbstractBinder<T, MODE=binderMode.DefaultMode> = binderInternals.InternalBaseBinder<T, MODE> & binderInternals.InternalAbstractBinder<T, MODE>;
    type AnyObjectBinder<MODE=binderMode.DefaultMode> = binderInternals.InternalBaseBinder<any, MODE> & binderInternals.InternalAnyObjectBinder<MODE>;
}

/*
 * Internal types, these types are not for depend directly in the code
 */
declare module binderInternals {
    /*
     * Extends type allows to know if the extact type extends of the other one, even when it is a union type
     * Example: if you have
     *   type IsArray<T> = T extends Array<any> ? 'isArray' : 'notArray'
     *   declare var myVar1: IsArray<number> // the type is 'notArray' 
     *   declare var myVar2: IsArray<number[]> // the type is 'isArray' 
     *   declare var myVar3: IsArray<number[] | string> // the type is 'isArray' | 'notArray' 
     * But if you have
     *   type IsArray<T> = 'yes' extends Extends<T, Array<any>> ? 'isArray' : 'notArray'
     *   declare var myVar1: IsArray<number> // the type is 'notArray' 
     *   declare var myVar2: IsArray<number[]> // the type is 'isArray' 
     *   declare var myVar3: IsArray<number[] | string> // the type is 'notArray' 
     */
    //type Extends<A, B> = { _extends(): A } extends { _extends(): B } ? 'yes' : 'no'

    type KeyOfExcludingFuntions<T> = ({ [K in keyof T]-?: T[K] extends Function ? never : K })[keyof T];

    /*
     * Join of the type of the diffent properties in the object
     */
    type ValuesTypes<T, KEYS extends keyof T> = ({ [K in keyof T]: T[K]})[KEYS];

    /*
     * MandatoryProperties retunrs never and OptionalProperties returns all properties 
     * when strictNullCheck is not enabled
     * 
     * Note: mandatory and optional properties take in consideration only the properties maked with ?, but not
     * those whose type allows undefined but not marked with ? 
     */
    type ObjectKeysAux<T, KEYS extends keyof T> = ({ [K in KEYS]: T[K] extends never ? never : K });
    type MandatoryPropertiesAux<T, KEYS extends keyof T> = ({ [K in KEYS]-?: undefined extends T[K] ? never : K })[KEYS];
    type OptionalPropertiesAux<T, KEYS extends keyof T> = ({ [K in KEYS]-?: undefined extends T[K] ? K : never })[KEYS];
    type MandatoryProperties<T, KEYS extends keyof T> = MandatoryPropertiesAux<ObjectKeysAux<T, KEYS>, KEYS>;
    type OptionalProperties<T, KEYS extends keyof T> = OptionalPropertiesAux<ObjectKeysAux<T, KEYS>, KEYS>;

    type RequiredType<T> = T extends null | undefined ? never : T;

    type TypeWhenAny<T, Twhen, Telse> = { _extends(): T } extends { _extends(): '__binder_any_type__' } ? Twhen : Telse;
    type TypeWhenArray<T, Twhen, Telse> = { _extends(): T } extends { _extends(): Array<any> } ? Twhen : Telse;    

    class InternalBaseBinder<T, MODE> {
        private _mode : MODE;
        private _value : T;

        // Cast functions
        // This methos must be keeped in this class instead of be placed in InternalAbstractBinder to allow 
        // asign to binderUtils.AnyObjectBinder, Binder<any[]> and Binder<ObjectMap<any>> from the no any version
        isObjectBinder(): this is TypeWhenAny<T, binderUtils.AnyObjectBinder<MODE>, Binder<TypeWhenAny<T, undefined, T>, MODE>>;
        isMapBinder(): this is TypeWhenAny<T, Binder<ObjectMap<any>, MODE>, Binder<T, MODE>>;
        isArrayBinder(): this is TypeWhenAny<T, Binder<any[], MODE>, Binder<T, MODE>>;
    }

    /*
     * Due to the bug
     * https://github.com/Microsoft/TypeScript/issues/21592
     * tha causes 'Excessive stack depth comparing types' error,
     * there are some restrictions:
     * - In the type Binder<SomeType[][]> it is not posible to use use the
     *   indexer syntax to access to the indices in the firt array, it returns an 
     *   abstract binder instead of the proper binder type, you must
     *   use the get method instead.
     * - There is a different type between the object of a concrete type and
     *   the any type.
     * - The concat method in the binder of an array receive ValueBinder instead
     *   Binder
     * - All methods that receives o returns a binder uses a generic argument Q
     *   (and sometimes QR) even when in the code looks that make no sense
     */

    interface InternalAbstractBinder<T, MODE> {
        getValue(): T;
        setValue(value: T, force?: boolean): this;

        toString(): string;
        toLocaleString(locales?: string | string[], options?: any): string;

        // Additional information
        getExtras(): any;
        getParent(): Binder<any, MODE> | null;
        getKey(): string | number | null;
        isValidBinder(): boolean;
        getDerivedFrom(): binderUtils.DerivedBinderFrom | null;

        // advanced updates
        updateExtras(newTemporalExtras?: { [key: string]: any }, newPermanentExtras?: { [key: string]: any }, force?: boolean): this;
        setValueAndUpdateExtras(value: T, newTemporalExtras?: { [key: string]: any }, newPermanentExtras?: { [key: string]: any }, force?: boolean): this;
        updateExtrasInCurrentBinder(newTemporalExtras?: { [key: string]: any }, newPermanentExtras?: { [key: string]: any }): void;
        setValueFromDeribedBinder(value: T, deribedBinder: Binder<any, any>, newTemporalExtras?: { [key: string]: any }, newPermanentExtras?: { [key: string]: any }): this;

        // Cast functions
        /*keeped for compatibility reasons*/ _(): Binder<T, MODE>;

        hasValue(): this is Binder<binderInternals.RequiredType<T>, MODE>;
        sameValue(otherBinder: this): boolean
        sameValue(value: T): boolean

        // Binder type information
        isValueBinder(): this is Binder<T, MODE>;

        // Validations
        setEditedValueByTheUser(value: T, force?: boolean): this;
        setEditedValueByTheUserAndUpdateExtras(value: T, newTemporalExtras?: { [key: string]: any }, newPermanentExtras?: { [key: string]: any }, force?: boolean): this;

        getError(): string | null
        setError(error: Promise<string | null | undefined>): Promise<this>
        setError(error: string | null | undefined): void
        wasTouchedByTheUser(): boolean
        setTouchedByTheUser(touchedByTheUser: boolean): this
        wasEditedByTheUser(): boolean
        setEditedByTheUser(editedByTheUser: boolean): this
        setTouchedAndEditedByTheUser(touchedByTheUser: boolean, editedByTheUser: boolean): this
        containsErrors(): boolean
        childrenContainErrors(): boolean
    }

    interface InternalValueBinder<T, MODE> extends InternalAbstractBinder<T, MODE> {
    }

    interface InternalMapBinder<T, MODE> extends InternalAbstractBinder<ObjectMap<T>, MODE> {
        size: number;

        get(key: string): Binder<T, MODE> | undefined;
        set(key: string, value: T): this;

        clear(): this;
        delete(key: string): this;
        has(key: string): boolean;

        forEach(callbackfn: (value: Binder<T, MODE>, key: string, mapBinder: this) => void): void;
    }

    interface InternalAnyMapBinder<MODE> extends InternalAbstractBinder<ObjectMap<any>, MODE> {
        size: number;

        get(key: string): Binder<any, MODE> | undefined;
        set(key: string, value: any): this;

        clear(): this;
        delete(key: string): this;
        has(key: string): boolean;

        forEach(callbackfn: (value: Binder<any, MODE>, key: string, mapBinder: this) => void): void;
    }

    interface InternalArrayBinder<T, MODE> extends InternalAbstractBinder<T[], MODE> {
        length: number;
        //readonly [index: number]: Binder<T, MODE>; // Not suported due the mentioned bug
        readonly [index: number]: TypeWhenArray<T, binderUtils.AbstractBinder<T>, Binder<TypeWhenArray<T, undefined, T>, MODE>>;

        get(index: number): Binder<T, MODE>;
        set(index: number, value: T): this;

        // Basic array mutator
        splice(start: number, deleteCount?: number): this;
        splice(start: number, deleteCount: number, ...items: T[]): this;

        // Array mutator
        pop(): this;
        push(...items: T[]): this;
        shift(): this;
        unshift(...items: T[]): this;

        // Extra mutator
        insertAt(index: number, value: T): this;
        removeAt(index: number, deleteCount?: number): this;

        // Other methods
        concat(...items: (Binder<T[], MODE> | Binder<T, MODE> | Binder<T, MODE>[] | ReadonlyArray<Binder<T, MODE>>)[]): Binder<T, MODE>[];
        join(separator?: string): string;
        slice(start?: number, end?: number): Binder<T, MODE>[];

        // Search in an Array
        includes(searchElement: T, fromIndex?: number): boolean;
        includes(searchElement: Binder<T, MODE>, fromIndex?: number): boolean;
        indexOf(searchElement: T, fromIndex?: number): number;
        indexOf(searchElement: Binder<T, MODE>, fromIndex?: number): number;
        lastIndexOf(searchElement: T, fromIndex?: number): number;
        lastIndexOf(searchElement: Binder<T, MODE>, fromIndex?: number): number;

        // Iterator
        forEach(callbackfn: (value: Binder<T, MODE>, index: number, arrayBinder: this) => void): void;
        every(callbackfn: (value: Binder<T, MODE>, index: number, arrayBinder: this) => boolean): boolean;
        some(callbackfn: (value: Binder<T, MODE>, index: number, arrayBinder: this) => boolean): boolean;
        map<U>(callbackfn: (value: Binder<T, MODE>, index: number, arrayBinder: this) => U): U[];
        filter(callbackfn: (value: Binder<T, MODE>, index: number, arrayBinder: this) => boolean): Binder<T, MODE>[];
        find(predicate: (value: Binder<T, MODE>, index: number, arrayBinder: this) => boolean): Binder<T, MODE> | undefined;
        findIndex(predicate: (value: Binder<T, MODE>, index: number, arrayBinder: this) => boolean): number;
        reduce(predicate: (previousValue: Binder<T, MODE>, currentValue: Binder<T, MODE>, currentIndex: number, arrayBinder: this) => Binder<T, MODE>, initialValue?: Binder<T, MODE>): Binder<T, MODE>;
        reduce<U>(predicate: (previousValue: U, currentValue: Binder<T, MODE>, currentIndex: number, arrayBinder: this) => U, initialValue: U): U;
        reduceRight(predicate: (previousValue: Binder<T, MODE>, currentValue: Binder<T, MODE>, currentIndex: number, arrayBinder: this) => Binder<T, MODE>, initialValue?: Binder<T, MODE>): Binder<T, MODE>;
        reduceRight<U>(predicate: (previousValue: U, currentValue: Binder<T, MODE>, currentIndex: number, arrayBinder: this) => U, initialValue: U): U;
    }

    interface InternalAnyArrayBinder<MODE> extends InternalAbstractBinder<any[], MODE> {
        length: number;
        readonly [index: number]: Binder<any, MODE>;

        get(index: number): Binder<any, MODE>;
        set(index: number, value: any): this;

        // Basic array mutator
        splice(start: number, deleteCount?: number): this;
        splice(start: number, deleteCount: number, ...items: any[]): this;

        // Array mutator
        pop(): this;
        push(...items: any[]): this;
        shift(): this;
        unshift(...items: any[]): this;

        // Extra mutator
        insertAt(index: number, value: any): this;
        removeAt(index: number, deleteCount?: number): this;

        // Other methods
        concat(...items: (Binder<any[], MODE> | Binder<any, MODE> | Binder<any, MODE>[] | ReadonlyArray<Binder<any, MODE>>)[]): Binder<any, MODE>[];
        join(separator?: string): string;
        slice(start?: number, end?: number): Binder<any, MODE>[];

        // Search in an Array
        includes(searchElement: any, fromIndex?: number): boolean;
        includes(searchElement: Binder<any, MODE>, fromIndex?: number): boolean;
        indexOf(searchElement: any, fromIndex?: number): number;
        indexOf(searchElement: Binder<any, MODE>, fromIndex?: number): number;
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        lastIndexOf(searchElement: Binder<any, MODE>, fromIndex?: number): number;

        // Iterator
        forEach(callbackfn: (value: Binder<any, MODE>, index: number, arrayBinder: this) => void): void;
        every(callbackfn: (value: Binder<any, MODE>, index: number, arrayBinder: this) => boolean): boolean;
        some(callbackfn: (value: Binder<any, MODE>, index: number, arrayBinder: this) => boolean): boolean;
        map<U>(callbackfn: (value: Binder<any, MODE>, index: number, arrayBinder: this) => U): U[];
        filter(callbackfn: (value: Binder<any, MODE>, index: number, arrayBinder: this) => boolean): Binder<any, MODE>[];
        find(predicate: (value: Binder<any, MODE>, index: number, arrayBinder: this) => boolean): Binder<any, MODE> | undefined;
        findIndex(predicate: (value: Binder<any, MODE>, index: number, arrayBinder: this) => boolean): number;
        reduce(predicate: (previousValue: Binder<any, MODE>, currentValue: Binder<any, MODE>, currentIndex: number, arrayBinder: this) => Binder<any, MODE>, initialValue?: Binder<any, MODE>): Binder<any, MODE>;
        reduce<U>(predicate: (previousValue: U, currentValue: Binder<any, MODE>, currentIndex: number, arrayBinder: this) => U, initialValue: U): U;
        reduceRight(predicate: (previousValue: Binder<any, MODE>, currentValue: Binder<any, MODE>, currentIndex: number, arrayBinder: this) => Binder<any, MODE>, initialValue?: Binder<any, MODE>): Binder<any, MODE>;
        reduceRight<U>(predicate: (previousValue: U, currentValue: Binder<any, MODE>, currentIndex: number, arrayBinder: this) => U, initialValue: U): U;
    }

    interface InternalObjectBinder<T, MANDATORYKEYS extends keyof T, KEYS extends keyof T, MODE> extends InternalAbstractBinder<T, MODE> {
        get<KEY extends MANDATORYKEYS>(key: KEY): Binder<T[KEY], MODE>;
        get<KEY extends KEYS>(key: KEY): Binder<T[KEY], MODE> | undefined;
        set<KEY extends KEYS>(key: KEY, value: T[KEY]): this;

        delete(key: OptionalProperties<T, KEYS>): this;
        has(key: KEYS): boolean;

        // forEach(callbackfn: (value: Binder<T, MODE>, key: KEYS, objectBinder: this) => void): void; // it can't be because it doesn't allows the mode overload
        forEach<Q extends T>(callbackfn: (value: Binder<ValuesTypes<Q, KEYS>, MODE>, key: keyof T, objectBinder: this) => void): void;
    }

    interface InternalAnyObjectBinder<MODE> extends InternalAbstractBinder<any, MODE> {
        get(key: string): Binder<any, MODE> | undefined;
        set(key: string, value: any): this;

        delete(key: any): this;
        has(key: any): boolean;

        // forEach(callbackfn: (value: Binder<T, MODE>, key: KEYS, objectBinder: this) => void): void; // it can't be because it doesn't allows the mode overload
        forEach(callbackfn: (value: Binder<any, MODE>, key: string, objectBinder: this) => void): void;
    }

    /*
     * Binder object with optional keys as optionals
     */
    type InternalObjectBinderOptionalKeys<T, KEYS extends keyof T, MODE> = {
        readonly [K in KEYS]/*-?*/: Binder<T[K], MODE>;
        /*
         * Optional properties are not marked as required because the binder create the property
         * binder if the entry exists in the object
         */
    }

    /*
     * Binder object with optional keys as optionals
     */
    type InternalObjectBinderAllKeys<T, KEYS extends keyof T, MODE> = {
        readonly [K in KEYS]-?: Binder<T[K], MODE>;
        /*
         * Optional properties are marked as required; the value must be preinitialized
         */
    }

    /*
     * Detect if the type allows nulls or undefined, when the type is any returns 'yes', then, 
     * when strictNullCheck is not enabled always returns 'no' 
     */
    type AllowNullOrUndefined<T> = { _extends(): T } extends { _extends(): '__binder_any_type__' } ? 'yes' // type is any
        : null extends string ? 'no' /*strictNullCheck is not enabled*/
        : { _extends(): null | undefined } extends { _extends(): T } ? 'yes' : 'no';

    type IsValueType<A> = 'yes' extends (A extends boolean | Boolean | number | Number | string | String | Date | Function ? 'yes' : 'no') ? 'yes' : 'no'

    type InternalBinder<T, MODE> =
        'yes' extends AllowNullOrUndefined<T> ? InternalValueBinder<T, MODE> :
        'yes' extends IsValueType<T> ? InternalValueBinder<T, MODE> :
        { _extends(): T } extends { _extends(): Array<infer Q> } ? (
            { _extends(): Q } extends { _extends(): '__binder_any_type__' } ? InternalAnyArrayBinder<MODE> : InternalArrayBinder<Q, MODE>
        ) :
        { _extends(): string } extends { _extends(): keyof T } ? (
            { _extends(): T } extends { _extends(): ObjectMap<infer Q> } ? (
                { _extends(): Q } extends { _extends(): '__binder_any_type__' } ? InternalAnyMapBinder<MODE> : InternalMapBinder<Q, MODE>
            ) :
            InternalValueBinder<T, MODE>
        ) :
        { _extends(): MODE } extends { _extends(): '__binder_any_type__' } ? /*ObjectBinder of any mode*/ InternalObjectBinder<T, MandatoryProperties<T, KeyOfExcludingFuntions<T>>, KeyOfExcludingFuntions<T>, MODE> & InternalObjectBinderOptionalKeys<T, KeyOfExcludingFuntions<T>, MODE> :
        { _extends(): MODE } extends { _extends(): binderMode.PreInitializedMode } ? (
            { _extends(): MODE } extends { _extends(): binderMode.IncludeFunctionsMode } ? /*PFObjectBinder*/ InternalObjectBinder<T, keyof T, keyof T, MODE> & InternalObjectBinderAllKeys<T, keyof T, MODE> :
            [KeyOfExcludingFuntions<T>] extends [never]? InternalValueBinder<T, MODE>: // We use [never] here because: https://github.com/Microsoft/TypeScript/issues/23182
            /*PObjectBinder*/ InternalObjectBinder<T, keyof T, KeyOfExcludingFuntions<T>, MODE> & InternalObjectBinderAllKeys<T, KeyOfExcludingFuntions<T>, MODE>
        ) : { _extends(): MODE } extends { _extends(): binderMode.IncludeFunctionsMode } ? /*FObjectBinder*/ InternalObjectBinder<T, MandatoryProperties<T, keyof T>, keyof T, MODE> & InternalObjectBinderOptionalKeys<T, keyof T, MODE> :
        [KeyOfExcludingFuntions<T>] extends [never] ? InternalValueBinder<T, MODE> : // We use [never] here because: https://github.com/Microsoft/TypeScript/issues/23182
        /*ObjectBinder*/ InternalObjectBinder<T, MandatoryProperties<T, KeyOfExcludingFuntions<T>>, KeyOfExcludingFuntions<T>, MODE> & InternalObjectBinderOptionalKeys<T, KeyOfExcludingFuntions<T>, MODE>
}
