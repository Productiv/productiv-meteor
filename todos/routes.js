
Router.route('/todos', function () {
  this.render('todosPage');
}, {
  layout: 'todosLayout'
});
