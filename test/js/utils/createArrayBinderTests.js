/*global expect*/
var binder = require('../../../src/binder');
var createAbstractBinderTests = require('./createAbstractBinderTests');
var testUpdateBinder = require('./testUpdateBinder');

function testChild(b, key, value) {
        expect(b.getValue()[key]).toBe(value);
        expect(b.get(key)).toBeInstanceOf(binder);
        expect(b[key]).toBeInstanceOf(binder);
        expect(b.get(key)).toBe(b[key]);
        expect(b.get(key).getValue()).toBe(value);
        expect(b.includes(value)).toBe(true);
}

function testNoChild(b, key) {
        expect(b.getValue()[key]).toBe(undefined);
        expect(b.get(key)).toBe(undefined);
        expect(b[key]).toBe(undefined);
        expect(b.get(key)).toBe(b[key]);
}

function testChangeArray(updater, initial, final, update, getFinalBinders) {
        updater.updated = false;
        var b = updater.getBinder().setValue(initial);
        
        expect(b.length).toBe(initial.length);
        expect(b.getValue().length).toBe(initial.length);
        
        for (var i = 0; i < initial.length; i++) {
            testChild(b, i, initial[i]);
        }

        var oldBinder = b;
        b = update(b);
        
        expect(b.length).toBe(final.length);
        expect(b.getValue().length).toBe(final.length);
        
        for (var i = 0; i < final.length; i++) {
            testChild(b, i, final[i]);
        }
        
        var finalBinders = getFinalBinders(oldBinder.slice());
        
        for (var i = 0; i < finalBinders.length; i++) {
            var fb = finalBinders[i];
            if (fb) {
                expect(b.get(i)).toBe(fb);
            }
        }
}

function createArrayBinderTests(updater) {
    createAbstractBinderTests(updater);
    
    test('has same properties', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue);
        
        var b = updater.getBinder();
        var value = b.getValue();
        
        for (var key in value) {
            expect(b[key]).toBeInstanceOf(binder);
            expect(b[key].getValue()).toBe(value[key]);
        }
        
        for (var key in b) {
            expect(b[key]).toBeInstanceOf(binder);
            expect(b[key].getValue()).toBe(value[key]);
            expect(value).toHaveProperty(key);
        }
    });
    
    test('get, set & includes methods', function() {
        var b = updater.getBinder();
        
        testNoChild(b, 10);

        b = testUpdateBinder(updater, function() {
            return updater.getBinder().set(10, 'a1v');
        });
        
        testChild(b, 10, 'a1v');
    });
    
    test('set method of a child', function() {
        var a24 = ['a24v'];
        updater.updated = false;
        updater.getBinder().setValue(a24);
        
        var b = testUpdateBinder(updater, function() {
            return updater.getBinder().set(0, 'a24_2v')[0];
        }, function() {
            return updater.getBinder()[0];
        }).getParent();
        
        testChild(b, 0, 'a24_2v');
    });
    
    test('set empty array', function() {
        var a2 = ['a2v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a2);
        
        expect(b.length).toBe(1);
        expect(b.getValue().length).toBe(1);
        
        b = testUpdateBinder(updater, function() {
            return updater.getBinder().setValue([]);
        });
        
        expect(b.length).toBe(0);
        expect(b.getValue().length).toBe(0);
        
        for (var key in b) {
            throw new Error('Unknown key ' + key);
        }

        for (var key in b.getValue()) {
            throw new Error('Unknown key ' + key);
        }
    });
    
    test('set inner value', function() {
        testChangeArray(updater,
            ['a3_1v', 'a3_2v', 'a3_3v'],
            ['a3_1v', 'a3_2_1v', 'a3_3v'],
            function(oldBinder) {
                var b = testUpdateBinder(updater, function() {
                    return oldBinder[1].setValue('a3_2_1v');
                }, function() {
                    return updater.getBinder()[1];
                }).getParent(); 
                
                expect(b.get(1)).not.toBe(oldBinder.get(1));
                return b;
            },
            function(binders) {
                binders[1] = null;
                return binders;
            }
        );
    });
    
    test('removeAt method', function() {
        testChangeArray(updater,
            ['a4_1v', 'a4_2v', 'a4_3v'],
            ['a4_1v', 'a4_3v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.removeAt(1);
                });
            },
            function(binders) {
                binders.splice(1,1); // At 1 remove one
                return binders;
            }
        );
        

        testChangeArray(updater,
            ['a4_1vv', 'a4_2vv', 'a4_3vv', 'a4_4vv'],
            ['a4_1vv', 'a4_4vv'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.removeAt(1, 2);
                });
            },
            function(binders) {
                binders.splice(1,2); // At 1 remove two
                return binders;
            }
        );
    });
    
    test('forEach method', function() {
        var a5 = ['a5_1v', 'a5_2v', 'a5_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a5);
        
        var i = 0;
        b.forEach(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a5).toBe(true);
            testChild(container, key, a5[key]);
            i++;
        });
        
        expect(i).toBe(3);
    });
    
    test('indexOf method', function() {
        var oldBinder = updater.getBinder();
        var a6 = ['a6_1v', 'a6_2v', 'a6_2v', 'a6_3v', 'a6_4v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a6);
        
        expect(b.indexOf('a6_2v')).toBe(1);
        expect(b.indexOf('a6_2v', 1)).toBe(1);
        expect(b.indexOf('a6_2v', 2)).toBe(2);
        expect(b.indexOf('a6_2v', 3)).toBe(-1);
        expect(b.indexOf('a6_2v_')).toBe(-1);
        expect(b.indexOf(b[3])).toBe(3);
        expect(b.indexOf(b[3], 1)).toBe(3);
        expect(b.indexOf(b[3], 3)).toBe(3);
        expect(b.indexOf(b[3], 4)).toBe(-1);
        expect(b.indexOf(oldBinder)).toBe(-1);
    });
    
    test('lastIndexOf method', function() {
        var oldBinder = updater.getBinder();
        var a7 = ['a7_1v', 'a7_2v', 'a7_2v', 'a7_3v', 'a7_4v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a7);
        
        expect(b.lastIndexOf('a7_2v')).toBe(2);
        expect(b.lastIndexOf('a7_2v', b.length - 2)).toBe(2);
        expect(b.lastIndexOf('a7_2v', 1)).toBe(1);
        expect(b.lastIndexOf('a7_2v', 0)).toBe(-1);
        expect(b.lastIndexOf('a7_2v_')).toBe(-1);
        expect(b.lastIndexOf(b[3])).toBe(3);
        expect(b.lastIndexOf(b[3], b.length - 2)).toBe(3);
        expect(b.lastIndexOf(b[3], 3)).toBe(3);
        expect(b.lastIndexOf(b[3], 2)).toBe(-1);
        expect(b.lastIndexOf(oldBinder)).toBe(-1);
    });
    
    test('includes method', function() {
        var oldBinder = updater.getBinder();
        var a8 = ['a8_1v', 'a8_2v', 'a8_2v', 'a8_3v', 'a8_4v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a8);
        
        expect(b.includes('a8_2v')).toBe(true);
        expect(b.includes('a8_2v', 1)).toBe(true);
        expect(b.includes('a8_2v', 2)).toBe(true);
        expect(b.includes('a8_2v', 3)).toBe(false);
        expect(b.includes('a8_2v_')).toBe(false);
        expect(b.includes(b[3])).toBe(true);
        expect(b.includes(b[3], 1)).toBe(true);
        expect(b.includes(b[3], 3)).toBe(true);
        expect(b.includes(b[3], 4)).toBe(false);
        expect(b.includes(oldBinder)).toBe(false);
    });
    
    test('join method', function() {
        var a9 = ['a9_1v', 'a9_2v', 'a9_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a9);
        
        expect(b.join()).toBe('a9_1v,a9_2v,a9_3v');
        expect(b.join('|')).toBe('a9_1v|a9_2v|a9_3v');
    });
    
    test('slice method', function() {
        var a10 = ['a10_1v', 'a10_2v', 'a10_3v', 'a10_4v', 'a10_5v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a10);
        
        var s = b.slice(3);
        expect(s.length).toBe(2);
        expect(s[0]).toBe(b[3]);
        expect(s[1]).toBe(b[4]);
        
        s = b.slice(2, 4);
        expect(s.length).toBe(2);
        expect(s[0]).toBe(b[2]);
        expect(s[1]).toBe(b[3]);
        
        s = b.slice();
        expect(s.length).toBe(5);
        expect(s[0]).toBe(b[0]);
        expect(s[1]).toBe(b[1]);
        expect(s[2]).toBe(b[2]);
        expect(s[3]).toBe(b[3]);
        expect(s[4]).toBe(b[4]);
    });
    
    test('pop method', function() {
        testChangeArray(updater,
            ['a11_1v', 'a11_2v', 'a11_3v'],
            ['a11_1v', 'a11_2v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.pop();
                });
            },
            function(binders) {
                binders.pop();
                return binders;
            }
        );
    });
    
    test('push method', function() {
        testChangeArray(updater,
            ['a12_1v', 'a12_2v', 'a12_3v'],
            ['a12_1v', 'a12_2v', 'a12_3v', 'a12_4v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.push('a12_4v');
                });
            },
            function(binders) {
                binders.push(null);
                return binders;
            }
        );
    });

    test('shift method', function() {
        testChangeArray(updater,
            ['a11_1v', 'a11_2v', 'a11_3v'],
            ['a11_2v', 'a11_3v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.shift();
                });
            },
            function(binders) {
                binders.shift();
                return binders;
            }
        );
    });
    
    test('unshift method', function() {
        testChangeArray(updater,
            ['a12_1v', 'a12_2v', 'a12_3v'],
            ['a12_4v', 'a12_1v', 'a12_2v', 'a12_3v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.unshift('a12_4v');
                });
            },
            function(binders) {
                binders.unshift(null);
                return binders;
            }
        );
    });
    
    test('splice method', function() {
        testChangeArray(updater,
            ['a13_1v', 'a13_2v', 'a13_3v', 'a13_4v'],
            ['a13_1v', 'a13_4v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.splice(1, 2);
                });
            },
            function(binders) {
                binders.splice(1,2); // At 1 remove two
                return binders;
            }
        );
        
        testChangeArray(updater,
            ['a13_1v1', 'a13_2v1', 'a13_3v1', 'a13_4v1'],
            ['a13_1v1', 'a13_5v1', 'a13_6v1', 'a13_4v1'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.splice(1, 2, 'a13_5v1', 'a13_6v1');
                });
            },
            function(binders) {
                binders.splice(1,2, null, null); // At 1 remove two
                return binders;
            }
        );
        
        testChangeArray(updater,
            ['a13_1v2', 'a13_2v2', 'a13_3v2', 'a13_4v2'],
            ['a13_1v2', 'a13_5v2', 'a13_6v2', 'a13_2v2', 'a13_3v2', 'a13_4v2'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.splice(1, 0, 'a13_5v2', 'a13_6v2');
                });
            },
            function(binders) {
                binders.splice(1,0, null, null); // At 1 remove zero
                return binders;
            }
        );
    });
    
    test('splice method no changes', function() {
        var a25 = ['a25_1v', 'a25_2v', 'a25_3v'];
        updater.updated = false;
        var oldBinder = updater.getBinder().setValue(a25);
        updater.updated = false;
        var b = oldBinder.splice();
        
        expect(b).toBe(oldBinder);
        expect(updater.updated).toBe(false);
        
        b = oldBinder.splice(1);
        
        expect(b).toBe(oldBinder);
        expect(updater.updated).toBe(false);
        
        b = oldBinder.splice(1, 0);
        
        expect(b).toBe(oldBinder);
        expect(updater.updated).toBe(false);
    });
    
    test('insertAt method', function() {
        testChangeArray(updater,
            ['a14_1v', 'a14_2v', 'a14_3v'],
            ['a14_1v', 'a14_2v', 'a14_4v', 'a14_3v'],
            function(oldBinder) {
                return testUpdateBinder(updater, function() {
                    return oldBinder.insertAt(2, 'a14_4v');
                });
            },
            function(binders) {
                binders.splice(2,0, null); // At 2 remove zero
                return binders;
            }
        );
    });
    
    test('every method', function() {
        var a15 = ['a15_1v', 'a15_2v', 'a15_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a15);
        
        var i = 0;
        var result = b.every(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a15).toBe(true);
            testChild(container, key, a15[key]);
            i++;
            return true;
        });
        
        expect(i).toBe(3);
        expect(result).toBe(true);
        
        i = 0;
        result = b.every(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a15).toBe(true);
            testChild(container, key, a15[key]);
            i++;
            return false;
        });
        
        expect(i).toBe(1);
        expect(result).toBe(false);
        
        i = 0;
        result = b.every(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a15).toBe(true);
            testChild(container, key, a15[key]);
            i++;
            return i !== 2;
        });
        
        expect(i).toBe(2);
        expect(result).toBe(false);
    });
    
    test('some method', function() {
        var a16 = ['a16_1v', 'a16_2v', 'a16_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a16);
        
        var i = 0;
        var result = b.some(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a16).toBe(true);
            testChild(container, key, a16[key]);
            i++;
            return true;
        });
        
        expect(i).toBe(1);
        expect(result).toBe(true);
        
        i = 0;
        result = b.some(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a16).toBe(true);
            testChild(container, key, a16[key]);
            i++;
            return false;
        });
        
        expect(i).toBe(3);
        expect(result).toBe(false);
        
        i = 0;
        result = b.some(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a16).toBe(true);
            testChild(container, key, a16[key]);
            i++;
            return i === 2;
        });
        
        expect(i).toBe(2);
        expect(result).toBe(true);
    });
    
    test('reduce method', function() {
        var a17 = ['a17_1v', 'a17_2v', 'a17_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a17);
        
        var i = 0;
        var result = b.reduce(function(accumulator, value, key, container) {
            expect(container).toBe(b);
            if (i === 0) {
                expect(accumulator).toBeInstanceOf(binder);
                testChild(container, 0, a17[0]);
            }
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i + 1);
            expect(key in a17).toBe(true);
            testChild(container, key, a17[key]);
            i++;
            return '' + accumulator + ' ' + value;
        });
        
        expect(i).toBe(2);
        expect(result).toBe('a17_1v a17_2v a17_3v');
        
        i = 0;
        result = b.reduce(function(accumulator, value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            i++;
            expect(key in a17).toBe(true);
            testChild(container, key, a17[key]);
            return '' + accumulator + ' ' + value;
        }, '>');
        
        expect(i).toBe(3);
        expect(result).toBe('> a17_1v a17_2v a17_3v');
    });
    
    test('reduceRight method', function() {
        var a18 = ['a18_1v', 'a18_2v', 'a18_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a18);
        
        var i = 2;
        var result = b.reduceRight(function(accumulator, value, key, container) {
            expect(container).toBe(b);
            if (i === 2) {
                expect(accumulator).toBeInstanceOf(binder);
                testChild(container, 0, a18[0]);
            }
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i - 1);
            expect(key in a18).toBe(true);
            testChild(container, key, a18[key]);
            i--;
            return '' + accumulator + ' ' + value;
        });
        
        expect(i).toBe(0);
        expect(result).toBe('a18_3v a18_2v a18_1v');
        
        i = 3;
        result = b.reduceRight(function(accumulator, value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i - 1);
            expect(key in a18).toBe(true);
            testChild(container, key, a18[key]);
            i--;
            return '' + accumulator + ' ' + value;
        }, '>');
        
        expect(i).toBe(0);
        expect(result).toBe('> a18_3v a18_2v a18_1v');
    });

    test('filter method', function() {
        var a19 = ['a19_1v', 'a19_2v', 'a19_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a19);
        
        var i = 0;
        var result = b.filter(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a19).toBe(true);
            testChild(container, key, a19[key]);
            i++;
            return true;
        });
        
        expect(i).toBe(3);
        expect(result.length).toBe(3);
        expect(result).toEqual([b[0], b[1], b[2]]);
        
        i = 0;
        result = b.filter(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a19).toBe(true);
            testChild(container, key, a19[key]);
            i++;
            return false;
        });
        
        expect(i).toBe(3);
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
        
        i = 0;
        result = b.filter(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a19).toBe(true);
            testChild(container, key, a19[key]);
            i++;
            return i !== 2;
        });
        
        expect(i).toBe(3);
        expect(result.length).toBe(2);
        expect(result).toEqual([b[0], b[2]]);
    });
    
    test('find method', function() {
        var a20 = ['a20_1v', 'a20_2v', 'a20_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a20);
        
        var i = 0;
        var result = b.find(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a20).toBe(true);
            testChild(container, key, a20[key]);
            i++;
            return true;
        });
        
        expect(i).toBe(1);
        expect(result).toBe(b[0]);
        
        i = 0;
        result = b.find(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a20).toBe(true);
            testChild(container, key, a20[key]);
            i++;
            return false;
        });
        
        expect(i).toBe(3);
        expect(result).toBe(undefined);
        
        i = 0;
        result = b.find(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a20).toBe(true);
            testChild(container, key, a20[key]);
            i++;
            return i === 2;
        });
        
        expect(i).toBe(2);
        expect(result).toBe(b[1]);
    });
 
    test('findIndex method', function() {
        var a21 = ['a21_1v', 'a21_2v', 'a21_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a21);
        
        var i = 0;
        var result = b.findIndex(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a21).toBe(true);
            testChild(container, key, a21[key]);
            i++;
            return true;
        });
        
        expect(i).toBe(1);
        expect(result).toBe(0);
        
        i = 0;
        result = b.findIndex(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a21).toBe(true);
            testChild(container, key, a21[key]);
            i++;
            return false;
        });
        
        expect(i).toBe(3);
        expect(result).toBe(-1);
        
        i = 0;
        result = b.findIndex(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a21).toBe(true);
            testChild(container, key, a21[key]);
            i++;
            return i === 2;
        });
        
        expect(i).toBe(2);
        expect(result).toBe(1);
    });
    
    test('map method', function() {
        var a22 = ['a22_1v', 'a22_2v', 'a22_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a22);
        
        var i = 0;
        var result = b.map(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);
            expect(key).toBe(i);
            expect(key in a22).toBe(true);
            testChild(container, key, a22[key]);
            i++;
            return value.getValue() + '!';
        });
        
        expect(i).toBe(3);
        expect(result.length).toBe(3);
        expect(result).toEqual(['a22_1v!', 'a22_2v!', 'a22_3v!']);
    });
    
    test('concat method', function() {
        var a23 = ['a23_1v', 'a23_2v', 'a23_3v'];
        updater.updated = false;
        var b = updater.getBinder().setValue(a23);
        
        var result = b.concat();
        expect(result.length).toBe(3);
        expect(result).toEqual([b[0], b[1], b[2]]);
        
        result = b.concat(['a23_4v', 'a23_5v', 'a23_6v']);
        expect(result.length).toBe(6);
        expect(result).toEqual([b[0], b[1], b[2], 'a23_4v', 'a23_5v', 'a23_6v']);
        
        result = b.concat('a23_7v', 'a23_8v', 'a23_9v');
        expect(result.length).toBe(6);
        expect(result).toEqual([b[0], b[1], b[2], 'a23_7v', 'a23_8v', 'a23_9v']);
        
        result = b.concat(['a23_10v', 'a23_11v'], ['a23_12v', 'a23_13v']);
        expect(result.length).toBe(7);
        expect(result).toEqual([b[0], b[1], b[2], 'a23_10v', 'a23_11v', 'a23_12v', 'a23_13v']);
        
        result = b.concat('a23_14v', ['a23_15v', 'a23_16v']);
        expect(result.length).toBe(6);
        expect(result).toEqual([b[0], b[1], b[2], 'a23_14v', 'a23_15v', 'a23_16v']);
        
        result = b.concat([['a23_17v', 'a23_18v'], 'a23_19v', ['a23_20v', 'a23_21v']]);
        expect(result.length).toBe(6);
        expect(result).toEqual([b[0], b[1], b[2], ['a23_17v', 'a23_18v'], 'a23_19v', ['a23_20v', 'a23_21v']]);

        result = b.concat('a23_22v', b, 'a23_23v');
        expect(result.length).toBe(8);
        expect(result).toEqual([b[0], b[1], b[2], 'a23_22v', b[0], b[1], b[2], 'a23_23v']);
        
        result = b.concat(b);
        expect(result.length).toBe(6);
        expect(result).toEqual([b[0], b[1], b[2], b[0], b[1], b[2]]);
    });
}
module.exports = createArrayBinderTests;