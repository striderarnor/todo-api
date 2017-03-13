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
	res.json(todos);
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
		return res.status(404).send();
	}

	body.description = body.description.trim();

	body.id = todoNextId++;		
	todos.push(body);
	res.json(body);	
});


app.listen(PORT, function(){
	console.log('server started on port: '+PORT);
});