
// Inplace. Changes the index of the item at oldIndex to newIndex
// If newIndex is negative, counts from end of array
// ex. var a = [1, 2, 3, 4]; a.shiftElement(0, 1); // a => [2, 1, 3, 4]
// ex. var a = [1, 2, 3, 4]; a.shiftElement(0, -1); // a => [2, 3, 1, 4]
Object.defineProperty(Array.prototype, 'shiftElement', {
  value: function(oldIndex, newIndex) {
    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
  }
});

String.prototype.betterTrim = function(spacer) {
  spacer = spacer || ' ';
  var str = this.trim();
  return str.replace(/\s+/g, spacer);
};

// Given `char`, returns a function which takes a string and returns whether
// the first character of that string is `char`.
isFirstChar = function(c) {
  return function(str) {
    return str.charAt(0) === c;
  };
};

// input is either a single object or id or an array of objects or ids
// output is an array of objects from the given collection
toArray = function(collection, _input) {
  var toCol = function(input) {
    var output;
    if(typeof input === 'string' || typeof input === 'object') output = [input];
    if(typeof output[0] === 'string') {
      output = _.map(output, function(id) {
        return collection.findOne(id);
      });
    }
    return output;
  };

  if(_input) return toCol(_input);
  else       return toCol;
};

