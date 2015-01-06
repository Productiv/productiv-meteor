
updateIndexOfTodos = function() {
  var todos = $('.todo');
  console.log(todos);
  $.each(todos, function(index, todo) {
    console.log('index: ', $(todo).data('index'));
    console.log(index);
    var id = $(todo).attr('id');
    updateTodo(id, { index: index });
  });
};
