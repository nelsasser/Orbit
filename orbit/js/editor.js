var visable = [];
var subedits = [];
var planetHash = {};

function Editor(simulation, container) {
	this.simulation = simulation;
	this.container = container;
	this.can_edit = false;
}

Editor.prototype.init = function() {
	var list = document.createElement("ul");
	list.id = "planet_manager";
	var a = document.createElement('li');
	list.appendChild(a);

	for(var i = 0; i < this.simulation.planets.length; i++) {
		var li = document.createElement('li');

		var sub_editor = document.createElement('div');
		sub_editor.className = 'sub_editor';

		var header = document.createElement('div');
		header.className = 'planet_header';
		header.addEventListener('click', function(event) {
			toggleVisable(visable, subedits, event.target.innerHTML);
		});

		if(i == 0) {
			header.innerHTML = 'Sun';
		} else {
			header.innerHTML = 'Planet ' + i;
		}

		planetHash[header.innerHTML] = i;

		sub_editor.appendChild(header);

		for(var type = 0; type < 3; type++) {
			var planet_data = document.createElement('div');
			planet_data.className = 'planet_data';

			var xstr = "x: ";
			var ystr = "y: ";
			var zstr = "z: ";

			var xstr2 = "x_";
			var ystr2 = "y_";
			var zstr2 = "z_";

			var visualizer;

			if(type == 0) {
				planet_data.id = 'position';

				xstr = "P" + xstr;
				ystr = "P" + ystr;
				zstr = "P" + zstr;

				xstr2 = xstr2 + "pos";
				ystr2 = ystr2 + "pos";
				zstr2 = zstr2 + "pos";
				
			} else if (type == 1) {
				planet_data.id = 'velocity';

				xstr = "V" + xstr;
				ystr = "V" + ystr;
				zstr = "V" + zstr;

				xstr2 = xstr2 + "vel";
				ystr2 = ystr2 + "vel";
				zstr2 = zstr2 + "vel";
			} else if (type == 2) {
				planet_data.id = 'acceleration';

				xstr = "A" + xstr;
				ystr = "A" + ystr;
				zstr = "A" + zstr;

				xstr2 = xstr2 + "acc";
				ystr2 = ystr2 + "acc";
				zstr2 = zstr2 + "acc";
			}

			var str1s = [xstr, ystr, zstr];
			var strs2 = [xstr2, ystr2, zstr2];

			for(var j = 0; j < 3; j++) {
				var p = document.createElement('p');
				p.innerHTML = str1s[j];
				var r = document.createElement('input');
				r.setAttribute('type', 'number');
				r.setAttribute('name', strs2[j]);
				r.className = 'sub_editor_input';
				r.disabled = !this.simulation.isPaused();
				planet_data.appendChild(p);
				planet_data.appendChild(r);
			}

			//visualizer = new Visualizer(this.simulation, this.simulation.planets[i], planet_data.id, planet_data);
			//visualizer.build();

			sub_editor.appendChild(planet_data);
		}
		li.appendChild(sub_editor);
		list.appendChild(li);

		visable.push(0);
		subedits.push(sub_editor);
	}

	this.container.appendChild(list);

	!subedits[0].getElementsByClassName('planet_data')[0].getElementsByClassName('sub_editor_input')[0].disabled;
};

Editor.prototype.toggleInput = function() {
	for(var i = 0; i < subedits.length; i++) {
		var data = subedits[i].getElementsByClassName('planet_data');
		for(var j = 0; j < data.length; j++) {
			var inputs = data[j].getElementsByClassName('sub_editor_input');
			for(var k = 0; k < inputs.length; k++) {
				inputs[k].disabled = !inputs[k].disabled;
			}
		}
	}

	this.can_edit = !this.can_edit;
}

function toggleVisable(v, s, index) {
	if(v[planetHash[index]] == 0) {
		var data = s[planetHash[index]].getElementsByClassName('planet_data');
		for(var i = 0; i < data.length; i++) {
			data[i].style.display = 'inline-flex';
		}
		v[planetHash[index]] = 1;
	} else {
		var data = s[planetHash[index]].getElementsByClassName('planet_data');
		for(var i = 0; i < data.length; i++) {
			data[i].style.display = 'none';
		}
		v[planetHash[index]] = 0;
	}
};

Editor.prototype.update = function() {
	if(!this.can_edit || this.simulation.stepped) {
		for(var i = 0; i < subedits.length; i++) {
		var data = subedits[i].getElementsByClassName('planet_data');
		for(var j = 0; j < data.length; j++) {
			var inputs = data[j].getElementsByClassName('sub_editor_input');
			for(var k = 0; k < inputs.length; k++) {
				if(j == 0) {
					if(k == 0) {
						inputs[k].value = this.simulation.planets[i].position.x;
					} else if(k == 1) {
						inputs[k].value = this.simulation.planets[i].position.y;
					} else if (k == 2) {
						inputs[k].value = this.simulation.planets[i].position.z;
					}
				} else if (j == 1) {
					if(k == 0) {
						inputs[k].value = this.simulation.planets[i].velocity.x;
					} else if(k == 1) {
						inputs[k].value = this.simulation.planets[i].velocity.y;
					} else if (k == 2) {
						inputs[k].value = this.simulation.planets[i].velocity.z;
					}
				} else if (j == 2) {
					if(k == 0) {
						inputs[k].value = this.simulation.planets[i].acceleration.x;
					} else if(k == 1) {
						inputs[k].value = this.simulation.planets[i].acceleration.y;
					} else if (k == 2) {
						inputs[k].value = this.simulation.planets[i].acceleration.z;
					}
				}
			}
		}
	}
	}
}

Editor.prototype.delete = function() {
	var r = document.getElementById("planet_manager");
	while (r.firstChild) {
    	r.removeChild(r.firstChild);
	}

	r.parentNode.removeChild(r);
	visable = [];
	subedits = [];
}
