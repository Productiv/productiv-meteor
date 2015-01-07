
// Inplace. Changes the index of the item at oldIndex to newIndex
// If newIndex is negative, counts from end of array
// ex. var a = [1, 2, 3, 4]; a.shiftElement(0, 1); // a => [2, 1, 3, 4]
// ex. var a = [1, 2, 3, 4]; a.shiftElement(0, -1); // a => [2, 3, 1, 4]
Array.prototype.shiftElement = function(oldIndex, newIndex) {
  this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
};

// Given `char`, returns a function which takes a string and returns whether
// the first character of that string is `char`.
isFirstChar = function(c) {
  return function(str) {
    return str.charAt(0) === c;
  };
};
