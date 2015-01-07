require('../lib/helpers')

// run from local root with `node tests/ArrayPrototypeShiftElement.js`

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function test(ary, firstIndex, secondIndex, expected) {
  var i = 0;
  return (function() {
    var a = ary;
    a.shiftElement(firstIndex, secondIndex);
    if(!arraysEqual(a, expected)) console.log('fail: ', a, ' should be ', expected);
  })();
};

test([1], 0, 0, [1]);
test([1, 2], 0, 0, [1, 2]);
test([1, 2], 0, 1, [2, 1]);
test([1, 2], 1, 0, [2, 1]);
test([1, 2], 1, 1, [1, 2]);
test([1, 2, 3], 0, 0, [1, 2, 3]);
test([1, 2, 3], 0, 1, [2, 1, 3]);
test([1, 2, 3], 0, 2, [2, 3, 1]);
test([1, 2, 3], 1, 0, [2, 1, 3]);
test([1, 2, 3], 1, 1, [1, 2, 3]);
test([1, 2, 3], 1, 2, [1, 3, 2]);
test([1, 2, 3], 2, 0, [3, 1, 2]);
test([1, 2, 3], 2, 1, [1, 3, 2]);
test([1, 2, 3], 2, 2, [1, 2, 3]);
