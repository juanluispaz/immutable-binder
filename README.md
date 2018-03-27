# immutable-binder

**immutable-binder** is a JavaScript library that allows to create **immutable** data cursors (called here binders).

**immutable-binder** allows you to edit immutable complex data in a easy way, allowing you to navigate through the data in the same way that it is structured.

The binder handles the contained data in an immutable way, as well, the binder itself is an immutable object; every time you update a binder a new binder is created. Immutable binders allow to pass it as parameter in frameworks such as **react** where you are expecting immutable data.

**immutable-binder** allows you to use **TypeScript** without losing the type validations, in other words, your binders are **full typed** in TypeScript.

With **immutable-binder** you can have the advantages of the two-way data bindings in an immutable environment (like React) running in a safe and immutable way.

The **immutable-binder** is a very small library (12 kb minified, 3 kb gzipped) with near to 600 loc in JavaScript and 250 loc in TypeScript of type definitions. The code is full tested in JavaScript and TypeScript and it has **100% of test coverage**.

# Summary

* [Example](#example)
* [How it works](#how-it-works)
* [Binder's members](#binders-members)
	* [Binder](#binder)
		* [Basic methods](#basic-methods)
		* [Additional methods](#additional-methods)
	* [Object binder](#object-binder)
	* [Map binder](#map-binder)
		* [Properties](#properties)
		* [Methods](#methods)
		* [Unsupported methods](#unsupported-methods)
	* [Array Binder](#array-binder)
		* [Properties](#properties-1)
		* [Accessor](#accessor)
		* [Basic methods](#basic-methods-1)
		* [Mutators](#mutators)
		* [Extra mutators](#extra-mutators)
		* [Iterators](#iterators)
		* [Reducers](#reducers)
		* [Search](#search)
		* [Other methods](#other-methods)
		* [Unsupported methods](#unsupported-methods-1)
* [Extra data management](#extra-data-management)
* [Derived binder](#derived-binder)
	* [Example: not binder](#example-not-binder)
	* [Example: String binder from a number binder](#example-string-binder-from-a-number-binder)
	* [Recovering the derivation information](#recovering-the-derivation-information)
	* [Automatically copied extras to a derived binder](#automatically-copied-extras-to-a-derived-binder)
* [Create a binder](#create-a-binder)
* [Using with React](#using-with-react)
* [Limitations](#limitations)
* [License](#license)

# Example

```js
import { createBinder } from 'immutable-binder';

var initialBook = {
	name: 'The Little Prince',
	languages: [
		{
			language: 'English',
			stock: 10
		}, {
			language: 'French',
			stock: 9
		}
	]
};

var rootBinder;
rootBinder = createBinder(initialBook, (newRootBinder) => {
	/*
	 * This function is executed every time something changes.
	 * The current root binder and its contained value never changes;
	 * instead of it, a new binder with the new value is created and
	 * this function is invoked, allowing in this way to update the root
	 * binder.
	 */
	rootBinder = newRootBinder;
});

rootBinder.languages[0].stock.setValue(5);
rootBinder.languages.put({
	language: 'Spanish',
	stock: 7
});

console.log(rootBinder.getValue());
```

**Output**

```js
{
	name: 'The Little Prince',
	languages: [
		{
			language: 'English',
			stock: 5
		}, {
			language: 'French',
			stock: 9
		}, {
			language: 'Spanish',
			stock: 7
		}
	]
}
```
# How it works

When you create a binder, every element in the object tree is wrapped in a binder object, keeping the same shape of the original object; in consequence, you can navigate through the data in the same way you navigate through the plain object.

When you modify a binder, a new binder is created with the data updated, without modifying the old one.

**Important**: Once you modified a binder, you cannot modify it again; if you try to do it, you will get an exception. 

# Binder's members

There are different types of binders; the basic one, and several specialisations that extend the first: in case of an array, in case of an object, or in case of an object map (only in TypeScript, in JavaScript the case of object or an object map are the same). These specialisations add extra methods to handle the data contained by the handler.

**Important**: Any object of type `Date`, `Number`, `Function` or `String` are considered as a simple value (even when in JavaScript they are considered as an object).

All methods that modify the binder return the new binder at the same level in the tree, so, if you modify the value of a property, the new binder that represents this property will be returned (don't confuse this binder with the new root binder created because the root object changes as well). If you try to modify a binder with the same data, these methods will return the same current binder without changes.

**Note**: The generic `T` argument represents the type contained by the binder.

## Binder

This is the basic representation of any binder.

### Basic methods

- **`getValue(): T`**: returns the value contained by the binder.

- **`setValue(value: T, force?: boolean): Binder<T>`**: sets the value to the binder, returns the new binder that represents the same node in the new tree. This method receives a secondary optional argument, that if it is set to `true`, it forces to create a new tree even when the value is the same as the current one.

- **`hasValue(): boolean`**: returns `true` if the contained value is different to `null` or `undefined`, otherwise returns `false`.

- **`getParent(): Binder<any> | null`**: returns the parent binder that contains this binder. This method returns `null` when this binder is the root binder.

- **`getKey(): string | number | null`**: returns the key in the parent binder that contains this binder; that means, if the parent is an object, this method returns the name of the property that contains this binder; if the parent is an array, this method returns the position in the array that contains this binder. This method returns `null` when this binder is the root binder.

- **`isValidBinder(): boolean`**: returns `true` if this instance is a valid binder that you can use to update the value; returns `false` when this instance is an outdated instance that you cannot use to update the value.

### Additional methods

- **`isValueBinder(): boolean`**: returns `true` when the contained data represents a leaf in the tree, otherwise, returns `false` when the contained data is an object or an array.

- **`isArrayBinder(): boolean`**: returns `true` when the contained data is an array, otherwise returns `false`. In TypeScript, when this method returns `true`, the current binder is downcast to an array binder.

- **`isObjectBinder(): boolean`**: returns `true` when the contained data is an object, otherwise returns `false`. In TypeScript, when it returns `true`, the current binder is downcast to an object binder (only if the contained type is compatible).

- **`isMapBinder(): boolean`**: returns `true` when the contained data is an object, otherwise returns `false`. This method is similar to `isObjectBinder` but in TypeScript, when this method returns `true` the current binder is downcast to a map binder (only if the contained type is compatible).

- **`_(): this`**: returns the same binder where it is invoked (return `this`). This method is useful in TypeScript because it allows to downcast a binder to object binder, map binder or array binder (if applicable).

## Object binder

When the contained value is an object, the binder is a specialised version that contains the same properties of the object, where each property is a binder with its corresponding value.

**Note**: in JavaScript an object binder and map binder are the same; then you can use all the map binder methods in an object binder or access the properties with the property name like in an object binder.

**Important**: if you want to modify a property value, use the method `setValue` in the binder stored in the property, or, if you are in JavaScript, use the method `set` defined in the map binder.

## Map binder

When the contained value is an object map, a specialised binder is created; that binder looks like the `Map` type of binders.

**Important**: A value of type `Map` is not supported.
 
 An object map is any type compatible with:
 
 ```typescript
interface ObjectMap<I> {
    [key: string]: I | undefined;
}
 ```

**Note**: in JavaScript an object binder and map binder are the same; then you can use all the map binder methods in an object binder or access the properties with the property name like in an object binder.

### Properties

- **`size: number`**: as in a `Map` type the binder contains a read-only property with the size of the map. That means, the number of keys contained by the map.

### Methods

All of the following methods are supported by the `Map` type as well by a map binder. The difference with the `Map` type are the methods `set`, `clear`, and `delete` return the new binder.

The supported methods are:

- **`get(key: string): Binder<T> | undefined`**: returns the property of key passed as argument. Returns the binder that contains the value of that property. In JavaScript write `mapBinder.get('key')` is the same as `mapBinder.key`.

- **`set(key: string, value: T): MapBinder<T>`**:  this method allows to set the value of a specified key. This method returns the new binder that contains the updated object. In JavaScript this method is an alternative to: `mapBinder[key].setValue(value).getParent()`.

- **`clear(): MapBinder<T>`**: drops all the keys contained by the binder. This method returns the new binder that contains the updated object.

- **`delete(key: string): MapBinder<T>`**: drops the specified key passed as argument in the binder. This method returns the new binder that contains the updated object.

- **`has(key: string): boolean`**: returns true if the key passed by arguments exists in the current binder. Otherwise, returns `false`.

- **`forEach(callbackfn: (value: Binder<T>, key: string, mapBinder: MapBinder<T>) => void): void`**: this method allows to iterate over each element contained by the map binder; for each element call the function passed as argument with the binder contained in the key, the key, and the current binder.

### Unsupported methods

The following methods are supported by the `Map` type but are not supported by an array binder:

- **`[Symbol.iterator]()`**
- **`entries()`**
- **`keys()`**

## Array Binder

When the contained value is an array, a specialised binder is created; that binder looks like an array of binders.

### Properties

- **`length: number`**: as in an array, the binder contains a read-only property with the length of the contained array. This property is read-only (in a JavaScript array you can modify it).

### Accessor

- **`[index: number]: Binder<T>`**: you can access any element in the array using the notation `binder[index]`, but you cannot assign a value to an index using this notation (use instead the method `set`). In TypeScript, if you use this notation to access an element, the result is not downcasted properly; it is recommended to use the method `get` instead to use the accessor.

### Basic methods

These methods don't exists in JavaScript array but they are useful to access or modify an array binder.

- **`get(index: number): Binder<T>`**: this method is alternative to the accessor and it is useful in TypeScript because the result is downcasted to the proper binder type automatically.

- **`set(index: number, value: T): ArrayBinder<T>`**: set the value of a specified index. This method returns the new binder that contains the updated array. This method is an alternative to: `arrayBinder[index].setValue(value).getParent()`.

### Mutators

An array binder supports the same mutators methods as a JavaScript array, but, with the difference that those methods return the new binder.

- **`splice(start: number, deleteCount?: number): ArrayBinder<T>`**
- **`splice(start: number, deleteCount: number, ...items: T[]): ArrayBinder<T>`**
- **`pop(): ArrayBinder<T>`**
- **`push(...items: T[]): ArrayBinder<T>`**
- **`shift(): ArrayBinder<T>`**
- **`unshift(...items: T[]): ArrayBinder<T>`**

**Note**: the method `splice` could receive a third or more arguments values to be inserted in the contained array.

### Extra mutators

These mutators methods are useful but not included in the JavaScript array object.

- **`insertAt(index: number, value: T): ArrayBinder<T>`**: insert a value in a specified index. Returns the new binder.

- **`removeAt(index: number, deleteCount?: number): ArrayBinder<T>`**:  remove the value in the specified index. Optionally, you can specify the number of elements to be removed as a second argument (default 1). Returns the new binder.

### Iterators

An array binder supports the same iterators methods as a JavaScript array.

Defining:

```typescript
type Callback<T,R> = (value: Binder<T>, index: number, arrayBinder: ArrayBinder<T>) => R
```

The iterators methods are:

- **`forEach(callbackfn: Callback<T, void>): void`**
- **`every(callbackfn: Callback<T, boolean>): boolean`**
- **`some(callbackfn: Callback<T, boolean>): boolean`**
- **`map<U>(callbackfn:  Callback<T, U>): U[]`**
- **`filter(callbackfn: Callback<T, boolean>): Binder<T>[]`**
- **`find(predicate: Callback<T, boolean>): Binder<T> | undefined`**
- **`findIndex(predicate: Callback<T, boolean>): number`**

### Reducers

An array binder supports the same reducers methods as a JavaScript array.

Defining:

```typescript
type Predicate<T,U> = (previousValue: U, currentValue: Binder<T>, currentIndex: number, arrayBinder: ArrayBinder<T>) => U
```

The reducer methods are:
- **`reduce(predicate: Predicate<Binder<T>,U>, initialValue?: Binder<T>): U`**
- **`reduce<U>(predicate: Predicate<T,U>, initialValue: U): U`**
- **`reduceRight(predicate: Predicate<Binder<T>,U>, initialValue?: Binder<T>): U`**
- **`reduceRight<U>(predicate: Predicate<T,U>, initialValue: U): U`**

### Search

An array binder supports the same search methods as a JavaScript array, but allows to specify the search element in the binder to search or the value contained by it.

The search methods are:

- **`includes(searchElement: T, fromIndex?: number): boolean`**
- **`includes(searchElement: Binder<T>, fromIndex?: number): boolean`**
- **`indexOf(searchElement: T, fromIndex?: number): number`**
- **`indexOf(searchElement: Binder<T>, fromIndex?: number): number`**
- **`lastIndexOf(searchElement: T, fromIndex?: number): number`**
- **`lastIndexOf(searchElement: Binder<T>, fromIndex?: number): number`**

### Other methods

These methods exist in JavaScript array and are supported as well by an array binder:

- **`concat(...items: (Binder<T> | Binder<T>[] | ArrayBinder<T>>)[]): Binder<T>[]`**
- **`join(separator?: string): string`**
- **`slice(start?: number, end?: number): Binder<T>[]`**

**Note**: The `concat` method can receive by argument an array of binders or an array of array of binders, both of them functioning in the same expected way.

### Unsupported methods

The following methods are supported by a JavaScript array but are not supported by an array binder:

- **`[Symbol.iterator]()`**
- **`entries()`**
- **`keys()`**
- **`values()`**
- **`copyWithin(...)`**
- **`fill(...)`**
- **`reverse()`**
- **`sort(...)`**

# Extra data management

In a binder you can store extra data, like metadata. There are two different kind of extras: *temporal* or *permanent*; the temporal one only exists in the current binder, but if the binder is updated the value is lost; the permanent one exists even if the binder is updated.

**Note**: Permanent extras are kept when the binder is updated directly, but if a parent or the source of a derived binder is updated, the permanent extras are lost.

In order to handle the extra data, the binder object has the following methods:

- **`getExtras(): any`**: this method returns an object with the extra data stored in the binder.

- **`updateExtras(newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<T>`**: this method updates the temporal extra data stored in the object passed as first argument and the permanent extra data stored in the object passed as second argument, coping it to the extra object in a new binder. Returns the new binder that represents the same node in the new tree. This method receives a third optional argument, that if it is set to `true`, it forces to create a new tree even when no changes are detected in respect to the current status (by default if no changes are detected, it returns the same current binder with no changes).

- **`setValueAndUpdateExtras(value: T, newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}, force?: boolean): Binder<T>`**: this method allows to perform a `setValue` and `updateExtras` at the same time. Receives as first argument the value to store in the binder, as secondary and third argument the properties to be copied into the extra object as temporal and permanent extras in a new binder. This method receives a fourth optional argument, that if it is set to `true`, it forces to create a new tree even when no changes are detected in respect to the current status (by default if no changes are detected, it returns the same current binder with no changes).

- **`updateExtrasInCurrentBinder(newTemporalExtras?: {[key: string]: any}, newPermanentExtras?: {[key: string]: any}): void`**: this method updates the temporal extra data stored in the object passed as first argument and the permanent extra data stored in the object passed as second argument, coping it to the extra object in the current binder. This method allows you to update the extra data without creating a new binder (mutating the current extras object).

# Derived binder

You can create a derived binder from another binder. The derived binder has a modified version of the data contained in the source value, and all the modifications made in the derived binder must be reflected in the source binder.

To do it, we need:

- **`sourceBinder`**: this is the source binder to derive.

- **`createDerivedBinder`**: this function creates the derived binder from the source binder (only will be executed when it is required). The signature of this function must be:
	```typescript
	(sourceBinder: Binder<SOURCE>) => Binder<DERIVED>
	```
- **`setSourceValue`**: this function updates the source binder with the data coming from the derived binder; this function must return the new binder resulting on updating the source binder. The signature of this function must be:

	```typescript
	(sourceBinder: Binder<SOURCE>, newDerivedBinder: Binder<DERIVED>) => Binder<SOURCE>
	```

	**Note**: it is important that when you update the source binder, you force the update, even if there are no changes in order to allow the extra data management to work properly.

- **`derivationName`**: string with a unique name for the new derived binder; this name is used to cache the derived binder. If you try to recreate this derived binder over the source binder, the previous derived binder will be returned.

Then you need to call the function `deriveBinderFrom` exposed by the `immutable-binder` library. The signature of this function is:

```typescript
function deriveBinderFrom<SOURCE, DERIVED>(
    sourceBinder: Binder<SOURCE>,
    createDerivedBinder: (sourceBinder: Binder<SOURCE>) => Binder<DERIVED>,
    setSourceValue: (sourceBinder: Binder<SOURCE>, newDerivedBinder: Binder<DERIVED>) => Binder<SOURCE>,
    derivationName: string
): Binder<DERIVED>
```

## Example: not binder

In this example we will create the function `notBinder` that returns a binder with the negated value.

**Note**: The `notBinder` is already included in the `immutable-binder` library.

```js
import {createBinder, deriveBinderFrom} from 'immutable-binder';

function notBinder(binderToNegate) {
    var createDerivedBinder = (sourceBinder) => {
	    var negatedValue = !sourceBinder.getValue();
	    return createBinder(negatedValue);
	};
    var setSourceValue = (sourceBinder, newDerivedBinder) => {
	    var newValue = !newDerivedBinder.getValue();
	    return sourceBinder.setValue(newValue, true);
	};
    return deriveBinderFrom(binderToNegate, createDerivedBinder, setSourceValue, 'notBinder');
}

var booleanBinder;
booleanBinder = createBinder(false, (newRootBinder) => {
	booleanBinder = newRootBinder;
});

var negatedBinder = notBinder(booleanBinder);
expect(negatedBinder.getValue()).toBe(true);

negatedBinder = negatedBinder.setValue(false);
expect(negatedBinder.getValue()).toBe(false);
expect(booleanBinder.getValue()).toBe(true);

var negatedBinder2 = notBinder(booleanBinder);
expect(negatedBinder2).toBe(negatedBinder);
```

The `notBinder` is already exported in the `immutable-binder` library as the following function:

```typescript
function notBinder(source: Binder<boolean>): Binder<boolean>
```

If you want to use it, you only need to do the following:

```js
import {createBinder, notBinder} from 'immutable-binder';

...
var negatedBinder = notBinder(booleanBinder);
...
```

## Example: String binder from a number binder

In this example we will create the function `stringBinderFromNumberBinder` that returns a binder that contains the string representation of a number; and, if the derived binder changes, the number will be updated, but not when the string is an invalid number; in this case, the source binder remains with the original value and the derived binder will include as extra data the error property with an error message.

```js
import {createBinder, deriveBinderFrom} from 'immutable-binder';

function createStringBinderfromNumberBinder(sourceValue) {
    var stringValue = sourceValue + ''; // cast the number to string
    return createBinder(stringValue);
}

function setValueAsNumber(sourceBinder, newDerivedBinder) {
    var newValue = +newDerivedBinder.getValue(); // cast the string to number
    if (!isNaN(newValue)) {
        return sourceBinder.setValue(newValue, true);
    }
    
    newDerivedBinder.updateExtrasInCurrentBinder({error: 'This must be a number'});
    return sourceBinder.setValue(sourceBinder.getValue(), true);
}
    
function stringBinderFromNumberBinder(sourceNumberBinder) {
    return deriveBinderFrom(sourceNumberBinder, createStringBinderfromNumberBinder, setValueAsNumber, 'stringBinderFromNumberBinder');
}

var numberBinder;
numberBinder = createBinder(10, (newRootBinder) => {
	numberBinder = newRootBinder;
});

var stringBinder = stringBinderFromNumberBinder(numberBinder);
expect(stringBinder.getValue()).toBe('10');

stringBinder = stringBinder.setValue('hello');
expect(stringBinder.getValue()).toBe('hello');
expect(stringBinder.getExtras().error).toBe('This must be a number');
expect(numberBinder.getValue()).toBe(10);

stringBinder = stringBinder.setValue('23');
expect(stringBinder.getValue()).toBe('23');
expect(stringBinder.getExtras().error).toBe(undefined);
expect(numberBinder.getValue()).toBe(23);

var stringBinder2 = stringBinderFromNumberBinder(numberBinder);
expect(stringBinder2).toBe(stringBinder);
```

## Recovering the derivation information

In a derived binder you can retrieve the derivation information used to create the derived binder. In order to do it, the binder object has the following method:
- **`getDerivedFrom(): DerivedBinderFrom | null`**: this method returns an object with the information used to create the derived binder, or `null` if the current binder is not a derived binder.

The `DerivedBinderFrom` definition is:

```typescript
interface DerivedBinderFrom {
    sourceBinder: Binder<any>
    createDerivedBinder: (sourceBinder: Binder<any>) => Binder<any>
    setSourceValue: (sourceBinder: Binder<any>, newDerivedBinder: Binder<any>) => Binder<any>
    derivationName: string
}
```

In this object each property corresponds to an argument passed to the function `deriveBinderFrom` but the `sourceBinder` is kept updated, so, in an a valid derived binder (no matters if it in a previous version was updated) the `sourceBinder` will be the valid one that generates this derived binder instead of the one used in the function `deriveBinderFrom`.

## Automatically copied extras to a derived binder

Some extras are automatically copied from the source binder to the derived binder when the derived binder is created or updated. All the extras copied from the source binder to the derived binder are created as *temporal*. The list of extras to be copied automatically is in the property `inheritedExtras` exposed by  the `immutable-binder` library as an array of strings.

By default `inheritedExtras` only includes the property `error`.

**Example**:
```js
import {createBinder, notBinder} from 'immutable-binder';

var ageBinder = ...
var age = ageBinder.getValue();
if (age < 0 || age > 99) {
	ageBinder.updateExtrasInCurrentBinder({error: 'age must be a number between 0 and 99'});
}

var stringAgeBinder = stringBinderFromNumberBinder(ageBinder);
expect(stringAgeBinder.getExtras().error).toBe('age must be a number between 0 and 99');
```

If you wants to add another property you, must do something similar to:
```js
import {inheritedExtras} from 'immutable-binder';

inheritedExtras.push('myExtraPropety');
```

# Create a binder

In order to create a binder you need to call the function `createBinder` exposed by the `immutable-binder` library. The signature of this function is:

```typescript
export declare function createBinder<T>(value: T, update?: UpdateBinder<T>, initialize?: InitializeValueBinder): Binder<T>;
```

This function receives the following arguments:

- **`value`**: value to be encapsulated inside the binder.

- **`update`**: optional. Function to be executed when the binder is updated. The definition of this function must be:

	```typescript
	type UpdateBinder<T> = (newRootBinder: Binder<T>, newBinder: Binder<any>, oldBinder: Binder<any>) => void
	```

	This function will receive the following parameters:
	
	- **`newRootBinder`**: new instance of the root binder created before updating the contained data.
	- **`newBinder`**: new instance of the source binder node that originated the changes.
	- **`oldBinder`**: old instance of the source binder node that originated the changes.

-  **`initialize`**: optional. Function to be executed when a value is going to change; this function allows to modify the value to be stored in the binder. This function will be executed only once per change with the information of the changes (not with the parents affected by the changes). The definition of this function must be:

	```typescript
	type InitializeValueBinder = (newValue: any, oldBinder: Binder<any>) => any
	```

	This function will receive the following parameters:
	
	- **`newValue`**: new value to be stored in the source binder that will originate the changes.
	- **`oldBinder`**: old instance of the source binder node that will originate the changes.

# Using with React

When you use binders with React, typically, when you create the binder you store the binder in the state, and you pass the binder as props to the child components. Because each binder contains the data and the function to change it, when you use child components, you don't need to pass the data and the callback, you only need to pass the binder itself and no more, making it simpler.

**Example**:

```js
import {createBinder} from 'immutable-binder';
import {stringBinderFromNumberBinder} from './utils';

class TextEditor extends React.Component {
    render() {
        var {binder, label} = this.props;
        var value = binder.getValue();
        var error = binder.getExtras().error;

        return (
            <label>
                {label}
                <input type='text' 
                    value={value} 
                    title={error} 
                    onChange={this.handleChange}
                    data-hasErrors={!!error}
                />
            </label>
        );
    }

    handleChange = (e) => {
        this.props.binder.setValue(e.target.value);
    }
}

function NumberEditor({label, binder}) {
    var stringBinder = stringBinderFromNumberBinder(binder);
    return (
        <TextEditor label={label} binder={stringBinder} />
    );
}

class PersonEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            personBinder: this.validate(createBinder(this.props.person, this.handleChange))
        };
    }

    render() {
        var personBinder = this.state.personBinder;

        return (
            <form onSubmit={this.handleSubmit}>
                <TextEditor label='First name' binder={personBinder.firstName}/>
                <TextEditor label='Last Name' binder={personBinder.lastName}/>
                <NumberEditor label='Age' binder={personBinder.age}/>
                <button>Save</button>
            </form>
        );
    }
  
    componentWillReceiveProps(nextProps) {
        if (this.props.person != nextProps.person) {
            this.setState({ 
                personBinder: this.validate(createBinder(this.props.person, this.handleChange))
            });
        }
    }

    validate(binder) {
        if (!binder.firstName.getValue()) {
            binder.firstName.updateExtrasInCurrentBinder({error: 'You must specify your first name'});
        }
        if (!binder.lastName.getValue()) {
            binder.lastName.updateExtrasInCurrentBinder({error: 'You must specify your last name'});
        }
        var age = binder.age.getValue();
        if (age <= 18 || age >= 100) {
            binder.age.updateExtrasInCurrentBinder({error: 'Your age must be a number between 18 and 99'});
        }
        return binder;
    }

    handleChange = (newRootBinder) => {
        this.setState({personBinder: this.validate(newRootBinder)});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.querySelector('[data-hasErrors=true]')) {
            alert('There are errors in the form');
            return;
        }
        var person = this.state.personBinder.getValue();
        // save the person
        console.log(person);
    }
}

var person = {
    firstName: 'John',
    lastName: 'Smith',
    age: 21
};
ReactDOM.render(<PersonEditor person={person}/>, mountNode);

```

**Improvements**

- You can use *HTML5 Form Validation API* instead of using `title` and `data-hasErrors` attributes to manage the validation status.

# Limitations

- Only simple JavaScript are supported, more complex types like `Map`are not supported.
- TypeScript bindings don't support `Number` (use `number` instead) or `String` (use `string` instead) or `Function`.
- Sometimes in TypeScript it is not possible to select the proper downcast; in consequence you can get a `Binder<T>` instead the most specific type, in that case you can use the `_()` method to cast to the proper type. E.g.: 

	```typescript
	var correctTypeBinder = wrongTypeBinder._();
	```

- In TypeScript, if you try to access to an array's element through the accessor, your will get the binder without the proper downcast, instead you can use the `get` method. E.g.:

	```typescript
	var wrongTypeBinder = arrayBinder[index];
	var correctTypeBinder = arrayBinder.get(index);
	```

- In TypeScript, when you have an object with an array as property and you access the array property, you will get a binder without the proper downcast, use the `_()` method to fix it. E.g.:

	```typescript
	var wrongTypeBinder = objectBinder.arrayPropertyBinder;
	var correctTypeBinder = objectBinder.arrayPropertyBinder._();
	```

# License

MIT

<!--
Edited with: https://stackedit.io/app
-->