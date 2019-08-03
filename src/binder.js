'use strict';

/*
 * Internal structure of the objects
 *
 * --------------------------------------------------------------------------------------------------------------------
 * Binder
 * -
 *
 * Each binder object contains the following properties (marked as no enumerables):
 * - _$value: the value contained by the binder
 * - _$update(newBinder): function that must be called in order to update the value in the parent binder, receive by
 *                        argument the new binder to be used instead the current one. This function is used as the
 *                        extras object.
 * - _$oldChildrenHaveErrors: optional boolean. If it is set to true is beacuse during the initialization of the binder
 *                        at least one child binder contains an error setted (using setError), be careful, if the child
 *                        is new it is not going to take in consideration.
 *
 * --------------------------------------------------------------------------------------------------------------------
 * Extras
 * -
 *
 * The updater function is used to contains the extras properties, this function changes each time the value of the
 * binder changes, or if the parent binder changes (maybe because another property changes its value). Every time that
 * this object changes the contained properties (marked as enumerable) are copied.
 *
 * By default, the extras object contains the following properties (marked as no enumerables):
 * - _$validBinder: boolean, indicate if the binder is valid (true), or if it is an obsolete binder (false).
 * - _$parent: binder, parent binder that contains this binder. Null in case of be the root binder.
 * - _$key: string or number, name of the property or key in an array in the parent binder that contains this binder.
 * - _$contentUpdater(key, newBinder): optional. Usually, during the update process (when the _$update function is
 *                                     called), the function _$setChildBinder(key, newBinder) is called in the parent
 *                                     object. This function allow to override this behaviour, if this function is
 *                                     provided, this function will be called instead of _$parent._$setChildBinder.
 *                                     This function receives as first argument the key of the binder (see _$key),
 *                                     as second argument receives the new binder. This property is used to handle the
 *                                     update action required by the root binder.
 *
 * By default, the extras object contains the following properties (marked as enumerables):
 * - _$initValue(newValue, oldBinder): optional, this function is called before a binder is updated, receives as first
 *                                     argument the value that will be contained by the resultant binder, and as second
 *                                     argument the current binder. This property is used to store in the root binder
 *                                     the initialize function passed by argument in the createBinder function. This
 *                                     function is called in the binder that changes values and then in the parents
 *                                     but passing as arguments the new value and the old binder which started the
 *                                     changes, so, in the parent this function receives the source of changes, not the
 *                                     modified version of the parent.
 * - _$postInit(newBinder, newInternalBinder, oldInternalBinder):
 *                                     optional, this function is called after a binder is updated, receives as first
 *                                     argument the updated (new) binder (in the root binder this value is the root
 *                                     binder), and as second argument the new binder that originate the change, as
 *                                     third argument the old binder that originate the change. This function is called
 *                                     called in each updated binder (including the parents), first in the inner binder
 *                                     and then in the outer binder.
 *                                     This  property is used to store in the root binder the update function passed by
 *                                     argument in the createBinder function. This property is used to store the update
 *                                     action required by a derived binder (chained with the update function passed to
 *                                     createBinder if it is present).
 * 
 * To support validations, the extras object contains the following properties (marked as no enumerables):
 * - _$error: optinoal string with the error message.
 * - _$touchedByTheUser: optional boolean that indicate if the event onBlur happens in the editior of this binder.
 * - _$editedByTheUser:  optional boolean that idicates if the value was edited by the user.
 * - _$updatedChildContainsErrors: optional boolean that indicates if last updated child binder has errors.
 */

var inheritedExtras = ['error', '_$error', '_$touchedByTheUser', '_$editedByTheUser'];

/*
 * Utils
 */
function createBinder(value, update, initialize) {
    var result = buildBinder(value);

    function rootUpdater(key, newBinder) {
        setUpdater(null, newBinder, null, rootUpdater);
    }
    setUpdater(null, result, null, rootUpdater);
    var extras = result.getExtras();
    extras._$postInit = update;
    extras._$initValue = initialize;

    if (process.env.NODE_ENV !== "production") {
        Object.freeze(result);
    }

    return result;
}

function buildBinder(value, reuseBinders) {
    ensureNoBinder(value);
    if (value === null || value === undefined) {
        return new ValueBinder(value);
    } else if (Array.isArray(value)) {
        return new ArrayBinder(value, reuseBinders);
    } else if (Object.getPrototypeOf(value) !== Object.prototype) {
        /*
         * This includes values where:
         * value instanceof Date
         *   || value instanceof Number
         *   || value instanceof Boolean
         *   || value instanceof Function
         *   || value instanceof String
         *   || !(value instanceof Object)
         * 
         * null and undefined are handled previously
         */
        return new ValueBinder(value);
    } else {
        return new MapBinder(value, reuseBinders);
    }
}

function isBinder(value) {
    return value instanceof AbstractBinder;
}

function ensureNoBinder(value) {
    if (process.env.NODE_ENV !== "production") {
        if (value instanceof AbstractBinder) {
            throw new TypeError('You cannot use a binder as value in an another binder');
        }
    }
}

function endClass(prototype) {
    for (var key in prototype) {
        Object.defineProperty(prototype, key, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: prototype[key]
        });
    }
}

function isEqual(a, b) {
    // Avoid false positives due to (NaN !== NaN) evaluating to true
    return (a === b || (a !== a && b !== b));
}

/*
 * Updater
 */

function setUpdater(parent, binder, key, contentUpdater) {
    var binderUpdater = binder._$update;
    if (binderUpdater) {
        binderUpdater._$parent = parent;
        binderUpdater._$key = key;
        binderUpdater._$contentUpdater = contentUpdater
        return;
    }

    function updater(newBinder) {
        if (!updater._$validBinder) {
            var error = new Error('You are trying to update an old binder');
            Object.defineProperty(error, '_$isInvalidBinder', {value: true});
            throw error;
        }
        if (updater._$contentUpdater)  {
            return updater._$contentUpdater(updater._$key, newBinder);
        } else {
            return updater._$parent._$setChildBinder(updater._$key, newBinder);
        }
    }
    Object.defineProperty(updater, '_$parent', {value: parent, writable: true});
    Object.defineProperty(updater, '_$key', {value: key, writable: true});
    Object.defineProperty(updater, '_$validBinder', {value: true, writable: true});
    Object.defineProperty(updater, '_$contentUpdater', {value: contentUpdater, writable: true});

    binder._$update = updater;
}

function invalidateBinder(binder) {
    if (!binder) {
        return;
    }

    var extras = binder.getExtras();
    extras._$parent = null;
    extras._$key = null;
    extras._$validBinder = false;
    extras._$contentUpdater = undefined;
    extras._$initValue = undefined;
    extras._$postInit = undefined;
}

function copyExtras(newBinder, oldBinder, newTemporalExtras, newPermanentExtras) {
    var oldExtras = oldBinder.getExtras();
    var newExtras = newBinder.getExtras();

    for (var key in oldExtras) {
        newExtras[key] = oldExtras[key];
    }

    if (oldExtras._$editedByTheUser) {
        Object.defineProperty(newExtras, '_$editedByTheUser', {value: true, writable: true});
    }
    if (oldExtras._$touchedByTheUser) {
        Object.defineProperty(newExtras, '_$touchedByTheUser', {value: true, writable: true});
    }
    if (isEqual(newBinder._$value, oldBinder._$value)) {
        if (oldExtras._$error) {
            Object.defineProperty(newExtras, '_$error', {value: oldExtras._$error, writable: true});
        }
    }

    if (newTemporalExtras) {
        for (var key in newTemporalExtras) {
            Object.defineProperty(newExtras, key, {value: newTemporalExtras[key], writable: true});
        }
    }

    if (newPermanentExtras) {
        for (var key in newPermanentExtras) {
            newExtras[key] = newPermanentExtras[key];
        }
    }
}

/*
 * AbstractBinder
 */

function AbstractBinder(value) {
    ensureNoBinder(value);
    Object.defineProperty(this, '_$value', {value: value});
    Object.defineProperty(this, '_$update', {writable: true});
}
AbstractBinder.prototype = Object.create(createBinder.prototype);

// Mutator methods
AbstractBinder.prototype.setValue = function (value, force) {
    ensureNoBinder(value);
    if (isEqual(this._$value, value)) {
        if (force) {
            return this._$setBinderValue(value, this);
        } else {
            return this;
        }
    }
    return this._$setBinderValue(value);
};

AbstractBinder.prototype.setEditedValueByTheUser = function (value, force) {
    ensureNoBinder(value);
    var extras = this.getExtras();
    if (isEqual(this._$value, value)) {
        if (force) {
            return this._$setBinderValue(value, this, {_$editedByTheUser: true});
        } else {
            return this;
        }
    }
    return this._$setBinderValue(value, undefined, {_$editedByTheUser: true});
};

AbstractBinder.prototype._$setBinderValue = function (value, reuseBinders, newTemporalExtras, newPermanentExtras, ignoreInit) {
    if (!ignoreInit) {
        value = this._$startInit(value, this);
    }

    var newBinder = buildBinder(value, reuseBinders);
    this._$update(newBinder);

    copyExtras(newBinder, this, newTemporalExtras, newPermanentExtras);

    if (process.env.NODE_ENV !== "production") {
        Object.freeze(newBinder);
    }

    invalidateBinder(this);

    if (!ignoreInit) {
        newBinder._$finishInit(newBinder, this, newBinder.containsErrors(), true);
    }

    return newBinder;
};

AbstractBinder.prototype._$startInit = function (newValue, oldBinder) {
    var initValue = this.getExtras()._$initValue;
    if (initValue) {
        newValue = initValue(newValue, oldBinder);
    }

    var parent = this.getParent();
    if (parent) {
        newValue = parent._$startInit(newValue, oldBinder);
    }
    return newValue;
};

AbstractBinder.prototype._$finishInit = function (newBinder, oldBinder, containsErrors, skipError) {
    var extras = this.getExtras();
    if (containsErrors && !skipError) {
        Object.defineProperty(extras, '_$updatedChildContainsErrors', {value: true});
    }

    var postInit = extras._$postInit;
    if (postInit) {
        postInit(this, newBinder, oldBinder);
    }

    var parent = this.getParent();
    if (parent) {
        parent._$finishInit(newBinder, oldBinder, containsErrors);
    }
};

// Accessor methods

AbstractBinder.prototype.getValue = function () {
    return this._$value;
};

AbstractBinder.prototype.toString = function () {
    var value = this._$value;
    if (value === null || value === undefined) {
        return value + '';
    }
    return value.toString();
};

AbstractBinder.prototype.toLocaleString = function (/* ... */) {
    var value = this._$value;
    if (value === null || value === undefined) {
        return value + '';
    }
    return value.toLocaleString.apply(value, arguments);
};

// Useful methods

AbstractBinder.prototype.hasValue = function() {
    var value = this._$value;
    return value !== null && value !== undefined;
};

AbstractBinder.prototype.sameValue = function(value) {
    if (value instanceof AbstractBinder) {
        return isEqual(this._$value, value._$value)
    }
    return isEqual(this._$value, value)
}

AbstractBinder.prototype._ = function() {
    // Useful function to allow in typescript cast to the proper type
    return this;
};

// Additional information

AbstractBinder.prototype.getExtras = function () {
    return this._$update;
};

AbstractBinder.prototype.getParent = function () {
    return this.getExtras()._$parent;
};

AbstractBinder.prototype.getKey = function () {
    return this.getExtras()._$key;
};

AbstractBinder.prototype.isValidBinder = function (key) {
    var extras = this.getExtras();
    if (!extras._$validBinder) {
        return false;
    }
    if (extras._$parent) {
        extras._$parent.isValidBinder();
    }
    return true;
};

AbstractBinder.prototype.getDerivedFrom = function () {
    var derivedUpdater = this.getExtras()._$postInit;
    if (!derivedUpdater) {
        return null;
    }
    if (!derivedUpdater.sourceBinder) {
        // this is the case of a _$postInit function that is not a derivedUpdater
        return null;
    }
    return derivedUpdater;
};

// Advanced updates

AbstractBinder.prototype.updateExtras = function (newTemporalExtras, newPermanentExtras, force) {
    return this._$setValueAndUpdateExtras(this._$value, newTemporalExtras, newTemporalExtras, newPermanentExtras, force);
};

AbstractBinder.prototype._$setValueAndUpdateExtras = function (value, newTemporalExtras, temporalExtrasToSet, newPermanentExtras, force) {
    var hasChanges = force;
    var reuseBinders = this;
    if (!hasChanges) {
        if (!isEqual(this._$value, value)) {
            hasChanges = true;
            reuseBinders = undefined;
        } else {
            var extras = this.getExtras();
            for (var key in newTemporalExtras) {
                if (!isEqual(extras[key], newTemporalExtras[key])) {
                    hasChanges = true;
                    break;
                }
            }
            if (!hasChanges) {
                for (var key in newPermanentExtras) {
                    if (!isEqual(extras[key], newPermanentExtras[key])) {
                        hasChanges = true;
                        break;
                    }
                }
            }
        }
    }
    if (hasChanges) {
        return this._$setBinderValue(value, reuseBinders, temporalExtrasToSet, newPermanentExtras);
    } else {
        return this;
    }
};

AbstractBinder.prototype.setValueAndUpdateExtras = function (value, newTemporalExtras, newPermanentExtras, force) {
    return this._$setValueAndUpdateExtras(value, newTemporalExtras, newTemporalExtras, newPermanentExtras, force);
}

AbstractBinder.prototype.setEditedValueByTheUserAndUpdateExtras = function (value, newTemporalExtras, newPermanentExtras, force) {
    var newTemporalExtrasToSet = Object.assign({}, newTemporalExtras);
    newTemporalExtrasToSet._$editedByTheUser = true;
    return this._$setValueAndUpdateExtras(value, newTemporalExtras, newTemporalExtrasToSet, newPermanentExtras, force);
};


AbstractBinder.prototype.setValueFromDeribedBinder = function (value, deribedBinder, newTemporalExtras, newPermanentExtras) {
    var deribedExtras = deribedBinder.getExtras();
    var error = null;
    if (isEqual(this._$value, value)) {
        error = this.getError();
    }
    if (!error) {
        error = deribedExtras._$error;
    }
    var newTemporalExtrasToSet = Object.assign({}, newTemporalExtras);
    newTemporalExtrasToSet._$touchedByTheUser = deribedExtras._$touchedByTheUser;
    newTemporalExtrasToSet._$editedByTheUser = deribedExtras._$editedByTheUser;
    newTemporalExtrasToSet._$error = error;
    return this._$setValueAndUpdateExtras(value, newTemporalExtras, newTemporalExtrasToSet, newPermanentExtras, true);
};

AbstractBinder.prototype.updateExtrasInCurrentBinder = function (newTemporalExtras, newPermanentExtras) {
    var extras = this.getExtras();
    if (newTemporalExtras) {
        for (var key in newTemporalExtras) {
            Object.defineProperty(extras, key, {value: newTemporalExtras[key], writable: true});
        }
    }

    if (newPermanentExtras) {
        for (var key in newPermanentExtras) {
            extras[key] = newPermanentExtras[key];
        }
    }
};

// Binder type information

AbstractBinder.prototype.isValueBinder = function() {
    return false;
};

AbstractBinder.prototype.isMapBinder = function() {
    return false;
};

AbstractBinder.prototype.isObjectBinder = function() {
    // Same that isMapBinder, useful in typescript
    return false;
};

AbstractBinder.prototype.isArrayBinder = function() {
    return false;
};

// Validation utils methods

AbstractBinder.prototype.getError = function() {
    return this.getExtras()._$error || null;
}

AbstractBinder.prototype._$setError = function(errorMessage, createNewBinder) {
    if (!errorMessage) {
        return this;
    }
    if (this.getError()) {
        return this;
    }

   
    if (createNewBinder) {
        try {
            return this._$setBinderValue(this._$value, this, {_$error: errorMessage});    
        } catch (error) {
            if (error && error._$isInvalidBinder) {
                Object.defineProperty(this.getExtras(), '_$error', {value: errorMessage, writable: true});
            } else {
                throw error;
            }
        }
    } else {
        Object.defineProperty(this.getExtras(), '_$error', {value: errorMessage, writable: true});
    }
    var parent = this.getParent();
    while (parent) {
        // This is only needed when no new binder is created
        Object.defineProperty(parent.getExtras(), '_$updatedChildContainsErrors', {value: true});
        parent = parent.getParent();
    }
    return this;
}

AbstractBinder.prototype.setError = function(error) {
    if (error instanceof Promise) {
        var that = this;
        return error.then(function (errorMessage) {
            return that._$setError(errorMessage, true);
        }, function (caught) {
            if (!caught) {
                return that._$setError(caught, true);
            } else {
                return that._$setError('' + caught, true);
            }
        });
    }

    return this._$setError(error, false);
}

AbstractBinder.prototype.wasTouchedByTheUser = function() {
    return !!this.getExtras()._$touchedByTheUser;
}

AbstractBinder.prototype.setTouchedByTheUser = function(touchedByTheUser) {
    if (this.wasTouchedByTheUser() === touchedByTheUser) {
        return this;
    }
    var extras = this.getExtras();
    return this._$setBinderValue(this._$value, this, {_$touchedByTheUser: touchedByTheUser});
}

AbstractBinder.prototype.wasEditedByTheUser = function() {
    return !!this.getExtras()._$editedByTheUser;
}

AbstractBinder.prototype.setEditedByTheUser = function(editedByTheUser) {
    if (this.wasEditedByTheUser() === editedByTheUser) {
        return this;
    }
    var extras = this.getExtras();
    return this._$setBinderValue(this._$value, this, {_$editedByTheUser: editedByTheUser});
}

AbstractBinder.prototype.setTouchedAndEditedByTheUser = function(touchedByTheUser, editedByTheUser) {
    if (this.wasTouchedByTheUser() === touchedByTheUser && this.wasEditedByTheUser() === editedByTheUser) {
        return this;
    }
    var extras = this.getExtras();
    return this._$setBinderValue(this._$value, this, {_$touchedByTheUser: touchedByTheUser,_$editedByTheUser: editedByTheUser});
}

AbstractBinder.prototype.containsErrors = function() {
    var extras = this.getExtras();
    return !!extras._$updatedChildContainsErrors || !!this._$oldChildrenHaveErrors || !!extras._$error;
}

AbstractBinder.prototype.childrenContainErrors = function() {
    return !!this.getExtras()._$updatedChildContainsErrors || !!this._$oldChildrenHaveErrors;
}


endClass(AbstractBinder.prototype);

/*
 * ValueBinder
 */

function ValueBinder(value) {
    AbstractBinder.call(this, value);
}
ValueBinder.prototype = Object.create(AbstractBinder.prototype);
ValueBinder.prototype.constructor;

// Binder type information

ValueBinder.prototype.isValueBinder = function() {
    return true;
};

endClass(ValueBinder.prototype);

/*
 * MapBinder: Like Map
 *
 * Not supported:
 * [Symbol.iterator]()
 * entries()
 * keys()
 *
 * The mutators functions returns the modified binder instead of
 * the value indicated in the Map documentation:
 * clear()
 * delete()
 * set()
 */

function MapBinder(value, reuseBinders) {
    AbstractBinder.call(this, value);

    var childrenHaveErrors = false
    var size = 0;
    if (reuseBinders) {
        for (var key in value) {
            var reuse = reuseBinders[key];
            if (reuse) {
                this[key] = reuse;
            } else {
                this[key] = buildBinder(value[key]);
            }
            setUpdater(this, this[key], key);
            childrenHaveErrors = childrenHaveErrors || this[key].containsErrors();
            size += 1;
        }
    } else {
        for (var key in value) {
            this[key] = buildBinder(value[key]);
            setUpdater(this, this[key], key);
            size += 1;
        }
    }
    if (!('size' in this)) {
        Object.defineProperty(this, 'size', {value: size});
    }
    if (childrenHaveErrors) {
        Object.defineProperty(this, '_$oldChildrenHaveErrors', {value: true});
    }
}
MapBinder.prototype = Object.create(AbstractBinder.prototype);
MapBinder.prototype.constructor = MapBinder;

// Mutator methods

MapBinder.prototype.clear = function () {
    for (var key in this._$value) {
        invalidateBinder(this[key]);
    }
    return this._$setBinderValue({});
};

MapBinder.prototype.delete = function (key) {
    var newValue = Object.assign({}, this._$value);
    delete newValue[key];

    var reuseBinders = Object.assign({}, this);
    invalidateBinder(reuseBinders[key]);
    delete reuseBinders[key];

    return this._$setBinderValue(newValue, reuseBinders);
};

MapBinder.prototype.set = function (key, value) {
    var oldChildBinder = this[key];
    if (oldChildBinder) {
        var newChildBinder = oldChildBinder.setValue(value);
        return newChildBinder.getParent();
    }

    ensureNoBinder(value);

    var newValue = Object.assign({}, this._$value);
    newValue[key] = value;

    var reuseBinders = Object.assign({}, this);
    invalidateBinder(reuseBinders[key]);
    delete reuseBinders[key];

    return this._$setBinderValue(newValue, reuseBinders);
};

MapBinder.prototype._$setChildBinder = function (key, binder) {
    var newValue = Object.assign({}, this._$value);
    newValue[key] = binder._$value;

    var reuseBinders = Object.assign({}, this);
    invalidateBinder(reuseBinders[key]);
    reuseBinders[key] = binder;

    return this._$setBinderValue(newValue, reuseBinders, null, null, true);
};

// Accessor methods

MapBinder.prototype.get = function (key) {
    return this[key];
};

MapBinder.prototype.has = function (key) {
    return key in this._$value;
};

// Iteration methods

MapBinder.prototype.forEach = function (callback) {
    for (var key in this) {
        callback(this[key], key, this);
    }
};

// Binder type information

MapBinder.prototype.isMapBinder = function() {
    return true;
};

MapBinder.prototype.isObjectBinder = function() {
    return true;
};

endClass(MapBinder.prototype);

/*
 * ArrayBinder: Like Array
 *
 * Not supported:
 * [Symbol.iterator]()
 * entries()
 * keys()
 * values()
 * copyWithin()
 * fill()
 * reverse()
 * sort()
 *
 * The mutators functions returns the modified binder instead of
 * the value indicated in the Map documentation:
 * pop
 * push
 * shift
 * splice
 * unshift
 */

function ArrayBinder(value, reuseBinders) {
    AbstractBinder.call(this, value);

    var childrenHaveErrors = false
    var length = value.length;
    if (reuseBinders) {
        for (var i = 0; i < length; i++) {
            var reuse = reuseBinders[i];
            if (reuse) {
                this[i] = reuse;
            } else {
                this[i] = buildBinder(value[i]);
            }
            setUpdater(this, this[i], i);
            childrenHaveErrors = childrenHaveErrors || this[i].containsErrors();
        }
    } else {
        for (var i = 0; i < length; i++) {
            this[i] = buildBinder(value[i]);
            setUpdater(this, this[i], i);
        }
    }
    Object.defineProperty(this, 'length', {value: length});
    if (childrenHaveErrors) {
        Object.defineProperty(this, '_$oldChildrenHaveErrors', {value: true});
    }
}
ArrayBinder.prototype = Object.create(AbstractBinder.prototype);
ArrayBinder.prototype.constructor = ArrayBinder;

// Mutator methods

ArrayBinder.prototype.set = function (index, value) {
    var oldChildBinder = this[index];
    if (oldChildBinder) {
        var newChildBinder = oldChildBinder.setValue(value);
        return newChildBinder.getParent();
    }

    ensureNoBinder(value);

    var newValue = this._$value.slice();
    newValue[index] = value;

    var reuseBinders = this.slice();
    invalidateBinder(reuseBinders[index]);
    reuseBinders[index] = undefined;

    return this._$setBinderValue(newValue, reuseBinders);
};

ArrayBinder.prototype._$setChildBinder = function (index, binder) {
    var newValue = this._$value.slice();
    newValue[index] = binder._$value;

    var reuseBinders = this.slice();
    invalidateBinder(reuseBinders[index]);
    reuseBinders[index] = binder;

    return this._$setBinderValue(newValue, reuseBinders, null, null, true);
};

ArrayBinder.prototype.splice = function (/*start, deleteCount , ... */) {
    if (arguments.length <= 2 && !arguments[1]) {
        return this;
    }
    var reuseBinders = this.slice();
    var args = new Array(arguments.length);
    args[0] = arguments[0];
    args[1] = arguments[1];

    for (var i = 2; i < arguments.length; i++) {
        ensureNoBinder(arguments[i]);
        args[i] = null;
    }

    var newValue = this._$value.slice();
    newValue.splice.apply(newValue, arguments);

    var droppedBinders = reuseBinders.splice.apply(reuseBinders, args);
    for (var j = 0; j < droppedBinders.length; j++) {
        invalidateBinder(droppedBinders[j]);
    }

    return this._$setBinderValue(newValue, reuseBinders);
};

// Mutator methods implemented using splice

ArrayBinder.prototype.pop = function () {
    return this.splice(-1, 1);
};

ArrayBinder.prototype.push = function (/* ... */) {
    var params = [this._$value.length, 0];
    Array.prototype.push.apply(params, arguments);
    return this.splice.apply(this, params);
};

ArrayBinder.prototype.shift = function () {
    return this.splice(0, 1);
};

ArrayBinder.prototype.unshift = function (/* ... */) {
    var params = [0, 0];
    Array.prototype.push.apply(params, arguments);
    return this.splice.apply(this, params);
};

ArrayBinder.prototype.insertAt = function (index, value) { // extra
    return this.splice(index, 0, value);
};

ArrayBinder.prototype.removeAt = function (index, deleteCount) { // extra
    if (isNaN(deleteCount) || deleteCount <= 0) {
        deleteCount = 1;
    }
    return this.splice(index, deleteCount);
};

// Accessor methods

ArrayBinder.prototype.get = function (index) { // extra
    return this[index];
};

ArrayBinder.prototype.concat = function (/* ... */) {
    var result = [];
    Array.prototype.push.apply(result, this);

    for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        if (Array.isArray(a) || a instanceof ArrayBinder) {
            Array.prototype.push.apply(result, a);
        } else {
            result.push(a);
        }
    }
    return result;
};

ArrayBinder.prototype.includes = function (searchElement, fromIndex) {
    return this.indexOf(searchElement, fromIndex) >= 0;
};

ArrayBinder.prototype.indexOf = function (searchElement, fromIndex) {
    if (searchElement instanceof AbstractBinder) {
        return Array.prototype.indexOf.call(this, searchElement, fromIndex);
    } else {
        return this._$value.indexOf(searchElement, fromIndex);
    }
};

ArrayBinder.prototype.join = function (separator) {
    return this._$value.join(separator);
};

ArrayBinder.prototype.lastIndexOf = function (searchElement, fromIndex) {
    if (searchElement instanceof AbstractBinder) {
        if (fromIndex === undefined) {
           fromIndex = this.length - 1;
        }
        return Array.prototype.lastIndexOf.call(this, searchElement, fromIndex);
    } else {
        if (fromIndex === undefined) {
           fromIndex = this._$value.length - 1;
        }
        return this._$value.lastIndexOf(searchElement, fromIndex);
    }
};
ArrayBinder.prototype.slice = Array.prototype.slice;

// Iteration methods

ArrayBinder.prototype.every = Array.prototype.every;
ArrayBinder.prototype.filter = Array.prototype.filter;
ArrayBinder.prototype.find = Array.prototype.find;
ArrayBinder.prototype.findIndex = Array.prototype.findIndex;
ArrayBinder.prototype.forEach = Array.prototype.forEach;
ArrayBinder.prototype.map = Array.prototype.map;
ArrayBinder.prototype.reduce = Array.prototype.reduce;
ArrayBinder.prototype.reduceRight = Array.prototype.reduceRight;
ArrayBinder.prototype.some = Array.prototype.some;

// Binder type information

ArrayBinder.prototype.isArrayBinder = function() {
    return true;
};

endClass(ArrayBinder.prototype);

function copyInheritedExtras(sourceExtras, targetExtras) {
    for (var i = 0; i < inheritedExtras.length; i++) {
        var key = inheritedExtras[i];
        if (targetExtras[key] === undefined && sourceExtras[key] !== undefined) {
            Object.defineProperty(targetExtras, key, {value: sourceExtras[key], writable: true});
        }
    }
}

function createDerivedUpdater(sourceBinder, createDerivedBinder, setSourceValue, derivationName) {
    function derivedUpdater(newDerivedBinder, newBinder, oldBinder) {
        var postInit = derivedUpdater._$postInit;
        if (postInit) {
            postInit(newDerivedBinder, newBinder, oldBinder);
        }

        var newSourceBinder = derivedUpdater.setSourceValue(derivedUpdater.sourceBinder, newDerivedBinder);
        if (newSourceBinder && newSourceBinder != derivedUpdater.sourceBinder) {
            var newDerivedUpdater = createDerivedUpdater(newSourceBinder, derivedUpdater.createDerivedBinder, derivedUpdater.setSourceValue, derivedUpdater.derivationName);

            var newDerivedExtras = newDerivedBinder.getExtras();
            newDerivedUpdater._$postInit = derivedUpdater._$postInit;
            newDerivedExtras._$postInit = newDerivedUpdater;

            var newSourceExtras = newSourceBinder.getExtras();
            Object.defineProperty(newSourceExtras, derivedUpdater.derivationName, {value: newDerivedBinder, writable: true});
            copyInheritedExtras(newSourceExtras, newDerivedExtras);
        } else {
            throw new Error('Expecting the source binder updated when the derived binder changed, but the setSourceValue funtion returned nothing or the old binder');
        }
    }
    derivedUpdater.sourceBinder = sourceBinder;
    derivedUpdater.createDerivedBinder = createDerivedBinder;
    derivedUpdater.setSourceValue = setSourceValue;
    derivedUpdater.derivationName = derivationName;
    return derivedUpdater;
}

function deriveBinderFrom(sourceBinder, createDerivedBinder, setSourceValue, derivationName) {
    if (!(sourceBinder instanceof AbstractBinder)) {
        throw new TypeError('Expectig a binder');
    }

    var extras = sourceBinder.getExtras();
    var derivedBinder = extras[derivationName];
    if (derivedBinder) {
        return derivedBinder;
    }

    derivedBinder = createDerivedBinder(sourceBinder);
    var derivedUpdater = createDerivedUpdater(sourceBinder, createDerivedBinder, setSourceValue, derivationName);

    var derivedExtras = derivedBinder.getExtras();
    derivedUpdater._$postInit = derivedExtras._$postInit;
    derivedExtras._$postInit = derivedUpdater;

    Object.defineProperty(extras, derivationName, {value: derivedBinder, writable: true});
    copyInheritedExtras(extras, derivedExtras);
    return derivedBinder;
}

function createNegatedBinder(sourceBinder) {
    var negatedValue = !sourceBinder.getValue();
    return createBinder(negatedValue);
}

function setNegatedValue(sourceBinder, newDerivedBinder) {
    var newValue = !newDerivedBinder.getValue();
    return sourceBinder.setValueFromDeribedBinder(newValue, newDerivedBinder);
}

function notBinder(binderToNegate) {
    return deriveBinderFrom(binderToNegate, createNegatedBinder, setNegatedValue, '_$deriveNot');
}

function withBinderMode() {
    return createBinder;
}

module.exports = createBinder;
createBinder.binder = createBinder;
createBinder.createBinder = createBinder;
createBinder.createBinderIncludingFunctions = createBinder;
createBinder.createPreInitializedBinder = createBinder;
createBinder.createPreInitializedBinderIncludingFunctions = createBinder;
createBinder.not = notBinder;
createBinder.notBinder = notBinder;
createBinder.default = createBinder;
createBinder.deriveFrom = deriveBinderFrom;
createBinder.deriveBinderFrom = deriveBinderFrom;
createBinder.inheritedExtras = inheritedExtras;
createBinder.isBinder = isBinder;
createBinder.withBinderMode = withBinderMode;
createBinder.withSameBinderMode = withBinderMode;
Object.defineProperty(createBinder, "__esModule", { value: true });
