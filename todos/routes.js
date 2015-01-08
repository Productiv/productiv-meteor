
Router.route('/todos', function () {
  var hash = this.params.hash;
  console.log('hash: ', hash)
  this.render('todosPage');
}, {
  layout: 'todosLayout'
});
