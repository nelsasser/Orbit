function Visualizer(simulation, planet, type, element) {
	this.simulation = simulation;
	this.planet = planet;
	this.vector = type;
	this.element = element

	this.arrow;
}

Visualizer.prototype.build = function() {
	var container = document.createElement('div');

	var draw = document.createElement("svg");
	draw.className = 'vec_vis';
	draw.setAttribute('viewbox', '0 0 100 100');

	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttributeNS(null, 'cx', '50');
	circle.setAttributeNS(null, 'cy', '50');
	circle.setAttributeNS(null, 'r', '3');
	draw.appendChild(circle);

	var arrow = document.createElementNS("http://www.w3.org/2000/svg", "g");
	arrow.className = "vis_arrow";
	arrow.style.stroke = 'white';
	arrow.style.float = 'right';
	arrow.style.fill = 'red';

	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttributeNS(null, 'x1', '60');
	line.setAttributeNS(null, 'y1', '50');
	line.setAttributeNS(null, 'x2', '90');
	line.setAttributeNS(null, 'y2', '50');

	arrow.appendChild(line);

	var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	poly.setAttributeNS(null, 'points', '90 50, 85 45, 85 55');
	arrow.appendChild(poly);

	draw.appendChild(arrow);
	this.arrow = arrow;

	container.appendChild(draw);
	container.className = "visualizer";
	this.element.appendChild(container);
}

/*Visualizer.pototype.reset = function() {

}*/

Visualizer.prototype.update = function() {
	var tV;
	var d;

	if(this.vector == 'position') {
		tV = this.planet.position;

		d = ((this.planet.position.x - this.simulation.planets[0].position.x)*(this.planet.position.x - this.simulation.planets[0].position.x) + 
			(this.planet.position.y - this.planets[0].position.y)*(this.planet.position.y - this.simulation.planets[0].position.y)) / 1000000;
	} else if(this.vector == 'velocity') {
		tV = this.planet.velocity;

		d = tV.magnitude() / 100;
	} else if(this.vector == 'acceleration') {
		tV = this.planet.acceleration;

		d = tV.magnitude() / 10;
	}


	this.arrow.setAttribute("transform", "rotate", Math.atan2(tV.y, tV.x) * -180 / Math.PI + ", 50, 50)");
	
	

	if (d < 0.5) {
	    red = 255; 
	    green = (d * 2) * 255;
	    blue = 0;
	} else {
	    red = 255*(1-((d- 0.5)*2));
	    green = 255;
	    blue = 0;
	}

	var r = "rgb(" + red + ", " + green + ", " + blue + ")";
	//console.log(red, green, blue);
	this.arrow.style.fill = r;
	this.arrow.style.stroke = r;
};












