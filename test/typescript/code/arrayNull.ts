import {createBinder, Binder, ObjectBinder, MapBinder, ArrayBinder, ObjectMap, inheritedExtras} from '../../../src/binder'

/*
 * Test definition
 */
declare type Value = number[] | null
declare type BinderType<T> = Binder<T>

declare type ValueBinder = BinderType<Value>
declare type ItemBinder = BinderType<Value>

/*
 * Other definitions
 */
declare let stringVar: string
declare let booleanVar: boolean
declare let anyVar: any
declare let numberVar: number

declare let extrasVar: any
declare let parentVar: Binder<any> | null
declare let keyVar: number | string | null

declare let valueVar: Value
declare let valueBinder: ValueBinder
declare let valueBinderOpt: ValueBinder | undefined

declare let itemBinder: ItemBinder
declare let itemBinderOpt: ItemBinder | undefined

declare let arrayBinder: ArrayBinder<Value>
declare let binderArray: Binder<Value>[] 
declare let valueArrayBinder: Binder<Value[]>
declare let arrayItemBinder: Binder<Value>

declare let mapBinder: MapBinder<Value>
declare let valueMapBinder: Binder<ObjectMap<Value>>

declare let anyValue: any
declare let anyBinder: Binder<any>

declare interface Container {
    content: Value
}

declare let objectBinder: ObjectBinder<Container>
declare let objectBaseBinder: Binder<Container>
declare let contentBinder: ObjectBinder<Value>
declare let contentBaseBinder: Binder<Value>

/*
 * Tests
 */
valueBinder = createBinder(valueVar);
valueBinder = createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    valueBinder = _newRootBinder
    anyBinder = _newBinder
    anyBinder = _oldBinder
})
valueBinder = createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    valueBinder = _newRootBinder
    anyBinder = _newBinder
    anyBinder = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    anyBinder = _oldBinder
    return _newValue
})

valueVar = valueBinder.getValue()
valueBinder = valueBinder.setValue(valueVar)
valueBinder = valueBinder.setValue(valueVar, booleanVar)
valueBinder = valueBinder.updateExtras({ foo: valueVar })
valueBinder = valueBinder.updateExtras({ foo: valueVar }, { foo: valueVar })
valueBinder = valueBinder.updateExtras(undefined, { foo: valueVar })
valueBinder = valueBinder.updateExtras({ foo: valueVar }, undefined, booleanVar)
valueBinder = valueBinder.updateExtras({ foo: valueVar }, { foo: valueVar }, booleanVar)
valueBinder = valueBinder.updateExtras({ foo: valueVar }, undefined, booleanVar)
valueBinder = valueBinder.updateExtras(undefined, undefined, booleanVar)
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, { foo: valueVar })
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, { foo: valueVar }, { foo: valueVar })
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, undefined, { foo: valueVar })
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, { foo: valueVar }, undefined, booleanVar)
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, { foo: valueVar }, { foo: valueVar }, booleanVar)
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, { foo: valueVar }, undefined, booleanVar)
valueBinder = valueBinder.setValueAndUpdateExtras(valueVar, undefined, undefined, booleanVar)
valueBinder.updateExtrasInCurrentBinder({ foo: valueVar })
valueBinder.updateExtrasInCurrentBinder({ foo: valueVar }, { foo: valueVar })
valueBinder.updateExtrasInCurrentBinder(undefined, { foo: valueVar })

stringVar = valueBinder.toString()
stringVar = valueBinder.toLocaleString()

extrasVar = valueBinder.getExtras()
parentVar = valueBinder.getParent()
keyVar = valueBinder.getKey()
booleanVar = valueBinder.isValidBinder()

if (valueBinder.hasValue()) { valueBinder = valueBinder }
if (valueBinder.isValueBinder()) { valueBinder = valueBinder }
if (valueBinder.isObjectBinder()) { valueBinder = valueBinder }
if (valueBinder.isMapBinder()) { valueBinder = valueBinder }
if (valueBinder.isArrayBinder()) { valueBinder = valueBinder }

objectBaseBinder = objectBinder
contentBaseBinder = contentBinder
contentBinder = objectBinder.content

valueArrayBinder = arrayBinder
valueMapBinder = mapBinder

valueBinder = valueBinder._()

arrayBinder = valueArrayBinder._()
mapBinder = valueMapBinder._()

numberVar = arrayBinder.length
numberVar = mapBinder.size

itemBinder = arrayBinder.get(0)
arrayItemBinder = arrayBinder[0]
itemBinderOpt = mapBinder.get('foo')

arrayBinder = arrayBinder.set(0, valueVar)
mapBinder = mapBinder.set('foo', valueVar)

mapBinder = mapBinder.clear()
mapBinder = mapBinder.delete('foo')
booleanVar = mapBinder.has('foo')
mapBinder.forEach((_value, _key, _mapBinder) => { 
    itemBinder = _value
    stringVar = _key
    mapBinder = _mapBinder
})

arrayBinder = arrayBinder.splice(0)
arrayBinder = arrayBinder.splice(0, 1)
arrayBinder = arrayBinder.splice(0, 1, valueVar)
arrayBinder = arrayBinder.splice(0, 1, valueVar, valueVar)

arrayBinder = arrayBinder.pop()
arrayBinder = arrayBinder.push()
arrayBinder = arrayBinder.push(valueVar)
arrayBinder = arrayBinder.push(valueVar, valueVar)

arrayBinder = arrayBinder.shift()
arrayBinder = arrayBinder.unshift()
arrayBinder = arrayBinder.unshift(valueVar)
arrayBinder = arrayBinder.unshift(valueVar, valueVar)

arrayBinder = arrayBinder.insertAt(0, valueVar)
arrayBinder = arrayBinder.removeAt(0)
arrayBinder = arrayBinder.removeAt(0, 1)

binderArray = arrayBinder.concat()
binderArray = arrayBinder.concat(binderArray)
binderArray = arrayBinder.concat(binderArray, [valueBinder, valueBinder])
binderArray = arrayBinder.concat(valueBinder, valueBinder)

stringVar = arrayBinder.join()
stringVar = arrayBinder.join('|')

binderArray = arrayBinder.slice()
binderArray = arrayBinder.slice(0)
binderArray = arrayBinder.slice(0, 1)

booleanVar = arrayBinder.includes(valueVar)
booleanVar = arrayBinder.includes(valueVar, 1)
booleanVar = arrayBinder.includes(valueBinder)
booleanVar = arrayBinder.includes(valueBinder, 1)

numberVar = arrayBinder.indexOf(valueVar)
numberVar = arrayBinder.indexOf(valueVar, 1)
numberVar = arrayBinder.indexOf(valueBinder)
numberVar = arrayBinder.indexOf(valueBinder, 1)

numberVar = arrayBinder.lastIndexOf(valueVar)
numberVar = arrayBinder.lastIndexOf(valueVar, 1)
numberVar = arrayBinder.lastIndexOf(valueBinder)
numberVar = arrayBinder.lastIndexOf(valueBinder, 1)

booleanVar = arrayBinder.every((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
    return true
})
booleanVar = arrayBinder.some((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
    return true
})
arrayBinder.forEach((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
 })

interface Foo {
  foo: number
}
let fooArray: Foo[] = arrayBinder.map((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
    return { foo: _index }
}) 

binderArray = arrayBinder.filter((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
    return true
})

valueBinder = arrayBinder.reduce((_previousValue, _currentValue, _currentIndex, _arrayBinder) => {
    itemBinder = _previousValue
    itemBinder = _currentValue
    numberVar = _currentIndex
    arrayBinder = _arrayBinder
    return _currentValue
})
valueBinder = arrayBinder.reduce((_previousValue, _currentValue, _currentIndex, _arrayBinder) => {
    itemBinder = _previousValue
    itemBinder = _currentValue
    numberVar = _currentIndex
    arrayBinder = _arrayBinder
    return _currentValue
}, valueBinder)

valueBinder = arrayBinder.reduceRight((_previousValue, _currentValue, _currentIndex, _arrayBinder) => {
    itemBinder = _previousValue
    itemBinder = _currentValue
    numberVar = _currentIndex
    arrayBinder = _arrayBinder
    return _currentValue
})
valueBinder = arrayBinder.reduceRight((_previousValue, _currentValue, _currentIndex, _arrayBinder) => {
    itemBinder = _previousValue
    itemBinder = _currentValue
    numberVar = _currentIndex
    arrayBinder = _arrayBinder
    return _currentValue
}, valueBinder)

declare let foo: Foo;
foo = arrayBinder.reduce((_previousValue, _currentValue, _currentIndex, _arrayBinder) => {
    foo = _previousValue
    itemBinder = _currentValue
    numberVar = _currentIndex
    arrayBinder = _arrayBinder
    return { foo: _currentIndex }
}, foo)
foo = arrayBinder.reduceRight((_previousValue, _currentValue, _currentIndex, _arrayBinder) => {
    foo = _previousValue
    itemBinder = _currentValue
    numberVar = _currentIndex
    arrayBinder = _arrayBinder
    return { foo: _currentIndex }
}, foo)

valueBinderOpt = arrayBinder.find((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
    return true
})
numberVar = arrayBinder.findIndex((_value, _index, _arrayBinder) => {
    itemBinder = _value
    numberVar = _index
    arrayBinder = _arrayBinder
    return true
})

var ie: string[] = inheritedExtras