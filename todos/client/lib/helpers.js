
updateIndexOfTodos = function(e) {

  var todos = $('.todos').children().toArray();

  todos.sort(function(first, second) {
    // console.log('first: ', first);
    // console.log('data-index: ', $(first).attr('data-index'));
    return $(first).data('index') - $(second).data('index');
  });

  todos.shiftElement(e.oldIndex, e.newIndex);

  var ids = todos.map(function(todo, index, ary) {
    var ind = $(todo).data('index');
    console.log('old index: ', ind, ', index: ', index);
    var id = $(todo).attr('id');
    return id;
  });

  console.log(ids)

  ids.forEach(function(id, index, ary) {
    console.log('id: ', id, ', index: ', index);

    // if(index === ary.length - 1) {
    //   Session.set('noRender', true);
    //   updateTodo(id, { index: index }, function() {
    //     Session.set('noRender', false);
    //   });
    // } else {
      updateTodo(id, { index: index });
    // }
  });

};
