/*
{
	height: 100,
	width: 100,

	parts: [
		{
			type: "line",
			x1: 0,
			y1: 10,
			x2: 0,
			y2: 20,
			color: #000000,
			thickness: 5
		}
	]
}


file = {
	"height": 300,
	"width": 500,

	"parts": [
		{
			"type": "line",
			"x1": 50,
			"y1": 150,
			"x2": 20,
			"y2": 200,
			"color": "green",
			"thickness": 5
		}
	]
}
*/

let file = {
	width: 100,
	height: 100,
	parts:[]
};

let history = [];
let pointer_history = -1;

function save_history()
{
	if(pointer_history > -1) history.splice(pointer_history); pointer_history = -1;
	history.push(JSON.parse(JSON.stringify(file)));
}

function undo()
{
	if(pointer_history === -1)
	{
		save_history()
		if(history.length <= 1) return;
		pointer_history = history.length - 2;
	}
	else
	{
		if(pointer_history === 0) return;
		pointer_history--;
	}

	file = history[pointer_history];
	render_file();
}

function redo()
{
	if(pointer_history === history.length - 1 || pointer_history === -1) return;

	pointer_history++;

	file = history[pointer_history];
	render_file();
}