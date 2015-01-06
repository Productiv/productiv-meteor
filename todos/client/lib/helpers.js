
updateIndexOfTodos = function() {
  setTimeout(function() {
    var todos = $('.todo').toArray().reverse();
    console.log(todos);
    var ids = todos.map(function(todo, index, ary) {
      var ind = $(todo).data('index');
      console.log('todo: ', todo, ', index: ', index, ', old index: ', ind);
      var id = $(todo).attr('id');
      return id;
    });
    console.log(ids)
    ids.forEach(function(id, index, ary) {
      console.log('id: ', id, ', index: ', index);
      updateTodo(id, { index: index });
    });
  }, 100);
};
