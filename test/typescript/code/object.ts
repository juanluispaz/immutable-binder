import {createBinder, createBinderIncludingFunctions, createPreInitializedBinder, createPreInitializedBinderIncludingFunctions, Binder, PBinder, PFBinder, FBinder, ObjectBinder, MapBinder, ArrayBinder, ObjectMap, inheritedExtras, binderMode, withBinderMode, withSameBinderMode, isBinder} from '../../../src/binder'

/*
 * Test definition
 */
declare interface A {
    a: number
}

declare type Value = A
declare type DefinedValue = A
declare type BinderType<T> = ObjectBinder<T>

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

valueBinder = valueBinder.setValueFromDeribedBinder(valueVar, objectBinder)
valueBinder = valueBinder.setValueFromDeribedBinder(valueVar, objectBinder, { foo: valueVar })
valueBinder = valueBinder.setValueFromDeribedBinder(valueVar, objectBinder, { foo: valueVar }, { foo: valueVar })
valueBinder = valueBinder.setValueFromDeribedBinder(valueVar, objectBinder, undefined, { foo: valueVar })

booleanVar = valueBinder.sameValue(valueVar)
booleanVar = valueBinder.sameValue(valueBinder)

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

valueBinder = valueBinder.setEditedValueByTheUser(valueVar)
valueBinder = valueBinder.setEditedValueByTheUser(valueVar, booleanVar)
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, { foo: valueVar })
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, { foo: valueVar }, { foo: valueVar })
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, undefined, { foo: valueVar })
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, { foo: valueVar }, undefined, booleanVar)
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, { foo: valueVar }, { foo: valueVar }, booleanVar)
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, { foo: valueVar }, undefined, booleanVar)
valueBinder = valueBinder.setEditedValueByTheUserAndUpdateExtras(valueVar, undefined, undefined, booleanVar)

var error : string | null = valueBinder.getError()
valueBinder.setError(error)
declare var promiseError: Promise<string | null | undefined>
var promiseBinder: Promise<ValueBinder> = valueBinder.setError(promiseError)

booleanVar = valueBinder.wasTouchedByTheUser()
valueBinder = valueBinder.setTouchedByTheUser(booleanVar)
booleanVar = valueBinder.wasEditedByTheUser()
valueBinder = valueBinder.setEditedByTheUser(booleanVar)
valueBinder = valueBinder.setTouchedAndEditedByTheUser(booleanVar, booleanVar)

booleanVar = valueBinder.containsErrors()
booleanVar = valueBinder.childrenContainErrors()

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

/*************************************************/

declare var vb: Binder<Value>
declare var vpb: PBinder<Value>
declare var vpfb: PFBinder<Value>
declare var vfb: FBinder<Value>

declare var avb: Binder<any>
declare var avpb: PBinder<any>
declare var avpfb: PFBinder<any>
declare var avfb: FBinder<any>

vb = vfb
vpb = vpfb
vb = vpb
vb = vfb
vb = vpfb

avb = vb
avpb = vpb
avpfb = vpfb
avfb = vfb

avb = vfb
avpb = vpfb
avb = avpb
avb = vfb
avb = vpfb

vb = createBinder(valueVar)
vb = createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vb = _newRootBinder
    avb = _newBinder
    avb = _oldBinder
})
vb = createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vb = _newRootBinder
    avb = _newBinder
    avb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avb = _oldBinder
    return _newValue
})

vpb = createPreInitializedBinder(valueVar)
vpb = createPreInitializedBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpb = _newRootBinder
    avpb = _newBinder
    avpb = _oldBinder
})
vpb = createPreInitializedBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpb = _newRootBinder
    avpb = _newBinder
    avpb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avpb = _oldBinder
    return _newValue
})

vpfb = createPreInitializedBinderIncludingFunctions(valueVar)
vpfb = createPreInitializedBinderIncludingFunctions(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpfb = _newRootBinder
    avpfb = _newBinder
    avpfb = _oldBinder
})
vpfb = createPreInitializedBinderIncludingFunctions(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpfb = _newRootBinder
    avpfb = _newBinder
    avpfb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avpfb = _oldBinder
    return _newValue
})

vfb = createBinderIncludingFunctions(valueVar)
vfb = createBinderIncludingFunctions(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vfb = _newRootBinder
    avfb = _newBinder
    avfb = _oldBinder
})
vfb = createBinderIncludingFunctions(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vfb = _newRootBinder
    avfb = _newBinder
    avfb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avfb = _oldBinder
    return _newValue
})

vb = withBinderMode<binderMode.DefaultMode>().createBinder(valueVar)
vb = withBinderMode<binderMode.DefaultMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vb = _newRootBinder
    avb = _newBinder
    avb = _oldBinder
})
vb = withBinderMode<binderMode.DefaultMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vb = _newRootBinder
    avb = _newBinder
    avb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avb = _oldBinder
    return _newValue
})

vpb = withBinderMode<binderMode.PreInitializedMode>().createBinder(valueVar)
vpb = withBinderMode<binderMode.PreInitializedMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpb = _newRootBinder
    avpb = _newBinder
    avpb = _oldBinder
})
vpb = withBinderMode<binderMode.PreInitializedMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpb = _newRootBinder
    avpb = _newBinder
    avpb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avpb = _oldBinder
    return _newValue
})

vpfb = withBinderMode<binderMode.PreInitializedAndIncludeFunctionsMode>().createBinder(valueVar)
vpfb = withBinderMode<binderMode.PreInitializedAndIncludeFunctionsMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpfb = _newRootBinder
    avpfb = _newBinder
    avpfb = _oldBinder
})
vpfb = withBinderMode<binderMode.PreInitializedAndIncludeFunctionsMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpfb = _newRootBinder
    avpfb = _newBinder
    avpfb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avpfb = _oldBinder
    return _newValue
})

vfb = withBinderMode<binderMode.IncludeFunctionsMode>().createBinder(valueVar)
vfb = withBinderMode<binderMode.IncludeFunctionsMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vfb = _newRootBinder
    avfb = _newBinder
    avfb = _oldBinder
})
vfb = withBinderMode<binderMode.IncludeFunctionsMode>().createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vfb = _newRootBinder
    avfb = _newBinder
    avfb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avfb = _oldBinder
    return _newValue
})

vb = withSameBinderMode(vb).createBinder(valueVar)
vb = withSameBinderMode(vb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vb = _newRootBinder
    avb = _newBinder
    avb = _oldBinder
})
vb = withSameBinderMode(vb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vb = _newRootBinder
    avb = _newBinder
    avb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avb = _oldBinder
    return _newValue
})

vpb = withSameBinderMode(vpb).createBinder(valueVar)
vpb = withSameBinderMode(vpb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpb = _newRootBinder
    avpb = _newBinder
    avpb = _oldBinder
})
vpb = withSameBinderMode(vpb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpb = _newRootBinder
    avpb = _newBinder
    avpb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avpb = _oldBinder
    return _newValue
})

vpfb = withSameBinderMode(vpfb).createBinder(valueVar)
vpfb = withSameBinderMode(vpfb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpfb = _newRootBinder
    avpfb = _newBinder
    avpfb = _oldBinder
})
vpfb = withSameBinderMode(vpfb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vpfb = _newRootBinder
    avpfb = _newBinder
    avpfb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avpfb = _oldBinder
    return _newValue
})

vfb = withSameBinderMode(vfb).createBinder(valueVar)
vfb = withSameBinderMode(vfb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vfb = _newRootBinder
    avfb = _newBinder
    avfb = _oldBinder
})
vfb = withSameBinderMode(vfb).createBinder(valueVar, (_newRootBinder, _newBinder, _oldBinder) => {
    vfb = _newRootBinder
    avfb = _newBinder
    avfb = _oldBinder
}, (_newValue, _oldBinder) => {
    anyValue = _newValue
    avfb = _oldBinder
    return _newValue
})

declare var mvb: Value | Binder<Value>
declare var mvpb: Value | PBinder<Value>
declare var mvpfb: Value | PFBinder<Value>
declare var mvfb: Value | FBinder<Value>

if (isBinder(mvb)) {
    vb = mvb
}

if (isBinder(mvpb)) {
    vpb = mvpb
}

if (isBinder(mvpfb)) {
    vpfb = mvpfb
}

if (isBinder(mvfb)) {
    vfb = mvfb
}

interface ValueObject {
    value: Value
    valueOpt?: Value
    valueFunction(value: Value): Value
}

declare var valueOjectItemBinder : Binder<Value | undefined>
declare var valueOjectFunctionItemBinder : Binder<Value | undefined | ((value: Value) => Value)>

declare var vob: Binder<ValueObject>
declare var vopb: PBinder<ValueObject>
declare var vopfb: PFBinder<ValueObject>
declare var vofb: FBinder<ValueObject>

declare var uvb: Binder<Value|undefined>|undefined
declare var uvpb: PBinder<Value|undefined>
declare var uvpfb: PFBinder<Value|undefined>
declare var uvfb: FBinder<Value|undefined>|undefined

declare var fvpfb: PFBinder<(value: Value) => Value>
declare var fvfb: FBinder<(value: Value) => Value>

vob = vofb
vopb = vopfb
vob = vopb
vob = vofb
vob = vopfb

avb = vob
avpb = vopb
avpfb = vopfb
avfb = vofb

avb = vofb
avpb = vopfb
avb = avpb
avb = vofb
avb = vopfb

vb = vob.value
vpb = vopb.value
vpfb = vopfb.value
vfb = vofb.value

uvb = vob.valueOpt
uvpb = vopb.valueOpt
uvpfb = vopfb.valueOpt
uvfb = vofb.valueOpt

fvpfb = vopfb.valueFunction
fvfb = vofb.valueFunction

vb = vob.get('value')
vpb = vopb.get('value')
vpfb = vopfb.get('value')
vfb = vofb.get('value')

uvb = vob.get('valueOpt')
uvpb = vopb.get('valueOpt')
uvpfb = vopfb.get('valueOpt')
uvfb = vofb.get('valueOpt')

fvpfb = vopfb.get('valueFunction')
fvfb = vofb.get('valueFunction')

vob = vob.set('value', vb.getValue())
vopb = vopb.set('value', vpb.getValue())
vopfb = vopfb.set('value', vpfb.getValue())
vofb = vofb.set('value', vfb.getValue())

if (uvb != undefined) {
    vob = vob.set('valueOpt', uvb.getValue())
}
vopb = vopb.set('valueOpt', uvpb.getValue())
vopfb = vopfb.set('valueOpt', uvpfb.getValue())
if (uvfb != undefined) {
    vofb = vofb.set('valueOpt', uvfb.getValue())
}

vopfb = vopfb.set('valueFunction', fvpfb.getValue())
vofb = vofb.set('valueFunction', fvfb.getValue())

vob = vob.delete('valueOpt')
vopb = vopb.delete('valueOpt')
vopfb = vopfb.delete('valueOpt')
vofb = vofb.delete('valueOpt')

booleanVar = vob.has('value')
booleanVar = vob.has('valueOpt')
booleanVar = vopb.has('value')
booleanVar = vopb.has('valueOpt')
booleanVar = vopfb.has('value')
booleanVar = vopfb.has('valueOpt')
booleanVar = vopfb.has('valueFunction')
booleanVar = vofb.has('value')
booleanVar = vofb.has('valueOpt')
booleanVar = vofb.has('valueFunction')

type ValuesTypes<T> = ({ [K in keyof T]: T[K]})[keyof T];
declare var v_ : ValuesTypes<ValueObject>

vob.forEach((_value, _key, _objectBinder) => { 
    valueOjectItemBinder = _value
    stringVar = _key
    vob = _objectBinder
})

vopb.forEach((_value, _key, _objectBinder) => { 
    valueOjectItemBinder = _value
    stringVar = _key
    vopb = _objectBinder
})

vopfb.forEach((_value, _key, _objectBinder) => { 
    valueOjectFunctionItemBinder = _value
    stringVar = _key
    vopfb = _objectBinder
})

vofb.forEach((_value, _key, _objectBinder) => { 
    valueOjectFunctionItemBinder = _value
    stringVar = _key
    vofb = _objectBinder
})

declare var definedValueBinder : Binder<DefinedValue>

if (valueBinder.hasValue()) {
    definedValueBinder = valueBinder
}

declare var arrayavb: Binder<any[]>
declare var arrayavpb: PBinder<any[]>
declare var arrayavpfb: PFBinder<any[]>
declare var arrayavfb: FBinder<any[]>

if (avb.isArrayBinder()) {
    arrayavb = avb
}

if (avpb.isArrayBinder()) {
    arrayavpb = avpb
}

if (avpfb.isArrayBinder()) {
    arrayavpfb = avpfb
}

if (avfb.isArrayBinder()) {
    arrayavfb = avfb
}

declare var mapavb: Binder<ObjectMap<any>>
declare var mapavpb: PBinder<ObjectMap<any>>
declare var mapavpfb: PFBinder<ObjectMap<any>>
declare var mapavfb: FBinder<ObjectMap<any>>

if (avb.isMapBinder()) {
    mapavb = avb
}

if (avpb.isMapBinder()) {
    mapavpb = avpb
}

if (avpfb.isMapBinder()) {
    mapavpfb = avpfb
}

if (avfb.isMapBinder()) {
    mapavfb = avfb
}

declare var uavb: Binder<any> | undefined
declare var uavpb: PBinder<any> | undefined
declare var uavpfb: PFBinder<any> | undefined
declare var uavfb: FBinder<any> | undefined

declare var avb2: Binder<any>
declare var avpb2: PBinder<any>
declare var avpfb2: PFBinder<any>
declare var avfb2: FBinder<any>

if (avb.isObjectBinder()) {
    let anyObject = avb
    uavb = avb.get('foo')
    anyObject = avb.set('foo', anyValue)
    anyObject = avb.delete('foo')
    booleanVar = avb.has('foo')
    avb.forEach((_value, _key, _objectBinder) => { 
        avb2 = _value
        stringVar = _key
        anyObject = _objectBinder
    })
}

if (avpb.isObjectBinder()) {
    let anyObject = avpb
    uavpb = avpb.get('foo')
    anyObject = avpb.set('foo', anyValue)
    anyObject = avpb.delete('foo')
    booleanVar = avpb.has('foo')
    avpb.forEach((_value, _key, _objectBinder) => { 
        avpb2 = _value
        stringVar = _key
        anyObject = _objectBinder
    })
}

if (avpfb.isObjectBinder()) {
    let anyObject = avpfb
    uavpfb = avpfb.get('foo')
    anyObject = avpfb.set('foo', anyValue)
    anyObject = avpfb.delete('foo')
    booleanVar = avpfb.has('foo')
    avpfb.forEach((_value, _key, _objectBinder) => { 
        avpfb2 = _value
        stringVar = _key
        anyObject = _objectBinder
    })
}

if (avfb.isObjectBinder()) {
    let anyObject = avfb
    uavfb = avfb.get('foo')
    anyObject = avfb.set('foo', anyValue)
    anyObject = avfb.delete('foo')
    booleanVar = avfb.has('foo')
    avfb.forEach((_value, _key, _objectBinder) => { 
        avfb2 = _value
        stringVar = _key
        anyObject = _objectBinder
    })
}
