var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('Todo API Root');
});

app.get('/todos', function(req,res){
	var queryParams = req.query;
	var filteredTodos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(todos,{completed:true})
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(todos,{completed:false})
	}else {
		filteredTodos = todos;
	}
	res.json(filteredTodos);
});

app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matched = _.findWhere(todos,{id: todoId});	

	if(matched){
		res.json(matched);
	}else{
		res.status(404).send();
	}	
});

app.post('/todos',function(req,res){
	var body = _.pick(req.body,'completed','description');
	 
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = todoNextId++;		
	todos.push(body);
	res.json(body);	
});

app.delete('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matched = _.findWhere(todos,{id: todoId});	

	if(matched){
		todos = _.without(todos,matched);		
		res.json(todos);
	}else{
		res.status(404).json({"error": "no todo item found with that id"});
	}

});

app.put('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body,'completed','description');
	var matched = _.findWhere(todos,{id: todoId});	
	var validAttributes = {};

	if(!matched){
		return res.status(404).send();
	}


	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
		res.status(400).send();
	}

	_.extend(matched, validAttributes);
	res.json(matched);

});

app.listen(PORT, function(){
	console.log('server started on port: '+PORT);
});