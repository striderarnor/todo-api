var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');
var db = require('./db.js');

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('description') && query.description.trim().length > 0) {
		where.description = {
			$like: '%' + query.description + '%'
		}
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		if (!!todos) {
			res.json(todos);
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'completed', 'description');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	})
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'no item found with the id'
			});
		} else {
			res.status(204).send();
		}
	}, function(e) {
		res.status(500).send();
	});

});
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'completed', 'description');
	var Attributes = {};

	if (body.hasOwnProperty('completed')) {
		Attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		Attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(Attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function() {
				res.status(400).send();
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();

	});
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('server started on port: ' + PORT);
	});
});