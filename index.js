
const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");
const port = process.env.PORT || 3000

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
	console.log("Connected to db!");
	app.listen(port, function() {
  		console.log('Server Up and running!')
	})
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	TodoTask.find({}, (err, tasks) => {
		//res.render("index.ejs");
		res.render("signin.ejs"); //{ todoTasks: tasks });
	});
});


app.get("/signup", (req, res) => {
	TodoTask.find({}, (err, tasks) => {
		res.render("signup.ejs");
	});
});


app.get("/todo", (req, res) => {
	TodoTask.find({}, (err, tasks) => {
		res.render("todo.ejs", { todoTasks: tasks });
	});
});



app.post('/',async (req, res) => {
	const todoTask = new TodoTask({
		content: req.body.content
	});
	try {
		await todoTask.save();
		res.redirect("/todo");
	} catch (err) {
		res.redirect("/todo");
	}
});

app
	.route("/edit/:id")
	.get((req, res) => {
	const id = req.params.id;
	TodoTask.find({}, (err, tasks) => {
		res.render("toDoUpdate.ejs", { todoTasks: tasks, idTask: id });
		});
	})
	.post((req, res) => {
		const id = req.params.id;
		TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
			if (err) return res.send(500, err);
			res.redirect("/todo");
		});
	});


app.route("/remove/:id").get((req, res) => {
	const id = req.params.id;
	TodoTask.findByIdAndRemove(id, err => {
		if (err) return res.send(500, err);
		res.redirect("/todo");
	});
});


app.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /signup or /signin'
  })
})



