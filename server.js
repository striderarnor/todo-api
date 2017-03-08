var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id:1,
	description: 'Meet myself for lunch',
	completed: false
},{
	id: 2,
	description: 'goto nee bonda',
	completed: false
},{
	id: 3,
	description: 'Finish lecture 53',
	completed: true
}];

app.get('/',function(req,res){
	res.send('Todo API Root');
});

app.get('/todos', function(req,res){
	res.json(todos);
});

app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matched;	
	todos.forEach(function(todo){
		if(todo.id === todoId){
			matched=todo;
		}		
	});

	if(matched){
		res.json(matched);
	}else{
		res.status(404).send();
	}	
});

app.listen(PORT, function(){
	console.log('server started on port: '+PORT);
});