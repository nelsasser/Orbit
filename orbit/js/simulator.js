/**
*	Creates a 3D Vector 
*	If any component is undefined, defaults to 0
* 	@param x - x component of vector
*	@param y - y component of vector
* 	@param z - z component of vector
*/
function Vector(x, y, z) {
	this.x;
	this.y;
	this.z;

	if(x == undefined) {
		this.x = 0;
	} else {
		this.x = x;
	}

	if(y == undefined) {
		this.y = 0;
	} else {
		this.y = y;
	}

	if(z == undefined) {
		this.z = 0;
	} else {
		this.z = z;
	}
}

/**
*	@return magnitude of vector
*/
Vector.prototype.magnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

/**
*	Creates unit vector from a passed in vector
*
*	@param v - vector to get unit vector of
*	@return new vector that is unit vector of passed in vector
*/
Vector.unit = function(v) {
	var m = v.magnitude();
	var nx = v.x / m;
	var ny = v.y / m;
	var nz = v.z / m;

	return new Vector(nx, ny, nz);
}

/**
*	Multiples a scalar through each component of the vector
*
*	@param s - scalar to multiply through vector
*	@param v - vector to multiple through
*	@return new vector that has scalar multiplied through
*/
Vector.multScalar = function(s, v) {
	var nx = v.x * s;
	var ny = v.y * s;
	var nz = v.z * s;

	return new Vector(nx, ny, nz);
}

/**
*	Adds components of two vectors
*	
*	@param v1 - first vector in addition
*	@param v2 - second vector in addition
*	@return new vector of added components
*/
Vector.addVec = function(v1, v2) {
	var nx = v1.x + v2.x;
	var ny = v1.y + v2.y;
	var nz = v1.z + v2.z;
	return new Vector(nx, ny, nz);
}

/**
*	Subtracts components of two vectors
*	
*	@param v1 - first vector in substraction
*	@param v2 - second vector in substraction
*	@return new vector of subtracted components
*/
Vector.subVec = function(v1, v2) {
	var nx = v1.x - v2.x;
	var ny = v1.y - v2.y;
	var nz = v1.z - v2.z;
	return new Vector(nx, ny, nz);
}

/**
*	Finds dot product between two vectors
*
*	@param v1 - first vector to find dot product of
*	@param v2 - second vector to find dot product of
*/
Vector.dot = function(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
*	Finds cross product between two vectors
*
*	@param v1 - first vector in cross product
*	@param v2 - second vector in cross product
*	@return new vector perpendicular to original two vectors
*/
Vector.cross = function(v1, v2) {
	var nx = v1.y*v2.z - v1.z*v2.y;
	var ny = v1.z*v2.x - v1.x*v2.z;
	var nz = v1.x*v2.y - v1.y*v2.x;

	return new Vector(nx, ny, nz);
}

/**
*	Creates a new Planey objects
*
*	@param pos - initial position vector of planet
*	@param vel - initial veloctiy vector of planet
*	@param acc - initial acceleration vector of planet
*	@param mass - mass of planet
*	@param rad - radius of planet
*	@param col - color of the planet (hex: 0x------)
*/
function Planet(pos, vel, acc, mass, rad, col) {
	this.position = pos;
	this.velocity = vel;
	this.acceleration = acc;
	this.mass = mass;
	this.color = col;
	this.radius = rad;
}

/**
*	Applies force to acceleration using F=ma
*
*	@param force - force vector to apply to acceleration vector
*/
Planet.prototype.updateAcceleration = function(force) {
	this.acceleration = Vector.multScalar(1/this.mass, force);
}

/**
*	Applies acceleration to velocity
*/
Planet.prototype.updateVelocity = function() {
	this.velocity = Vector.addVec(this.velocity, this.acceleration);
}

/**
*	Applies velocity to position
*/
Planet.prototype.updatePosition = function() {
	this.position = Vector.addVec(this.velocity, this.position);
}

/**
* 	Creates a new Simulation object
*
*	@param gravityModifier - constant to multiply against the Gravitational Constat (G = 6.67408e-11)
*/
function Simulation(gravityModifier) {
	this.paused = false;
	this.startData;
	this.planets = [];
	this.gravityModifier = gravityModifier;
	this.stepped = false;
}

/**
*	Initializes all of the planets in the simulation with specified data
*	
*	@param data - data of all of the planets to initialize 
*/
Simulation.prototype.init = function(data) {
	this.startData = data;
	this.planets = [];
	for(var i = 0; i < data.length; i++) {
		var d = data[i];
		var p = new Planet(new Vector(d.x, d.y), new Vector(d.vx, d.vy), new Vector(d.ax, d.ay), d.mass, d.radius, d.color);
		this.planets.push(p);
	}
}

/**
*	Steps forward in simulation, 
*	calculating all forces between planets,
*	and propagating force all the way through new position
*/
Simulation.prototype.step = function() {
	//calculate all forces between planets
	for(var i = 0; i < this.planets.length; i++) {
		var p1 = this.planets[i];
		for(var j = i+1; j < this.planets.length; j++) {
			var p2 = this.planets[j];

			var f = Simulation.forceBetweenPlanets(p1, p2, this.gravityModifier);

			//get directional vector that points between planet centers
			var v1 = new Vector(p1.position.x - p2.position.x, p1.position.y - p2.position.y, p1.position.z - p2.position.z);
			v1 = Vector.unit(v1);

			//changes direction to actual force vector between planets
			v1 = Vector.multScalar(-1*f, v1);
			var v2 = Vector.multScalar(-1, v1);

			//updates planets vectors based on force
			p1.updateAcceleration(v1);
			p2.updateAcceleration(v2);

			p1.updateVelocity();
			p2.updateVelocity();

			p1.updatePosition();
			p2.updatePosition();
		}
	}

	this.stepped = true;
}

/**
*	Calculates magnitude of force between two planets using F=(G*m1*m2)/r^2
*	@param p1 - first planet of the two to get force between
*	@param p2 - second planet of the two to get force between
*	@param gravityModifier - constant to multiply against the Gravitational Constat (G = 6.67408e-11)
*	@return magnitude of force between to planets centers
*/
Simulation.forceBetweenPlanets = function(p1, p2, gravityModifier) {
	//gravitational constant
	//1000000
	var G = 6.67408e-11 * gravityModifier;
	//squared distance between center of two planets
	var r2 = (p1.position.x - p2.position.x) * (p1.position.x - p2.position.x) + (p1.position.y - p2.position.y) * (p1.position.y - p2.position.y);

	var F = (G * p1.mass * p2.mass) / r2;

	return F;
}

/**
* 	Loads simulation starting values from saved file
*	@param JSONString starting planet data saved as JSON string to import
*	@return array of starting planet data values
*/
Simulation.importScene = function(file) {
	var JSONString;
	
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                JSONString = allText;
            }
        }
    }
    rawFile.send(null);

	return JSON.parse(JSONString);
}

/**
*	Exports current simulations starting data to be loaded for later simulation
*	@return JSON string of starting planet data
*/
Simulation.prototype.exportScene = function() {
	return JSON.stringify(this.startData);
}

/**
*	Pauses the simulation
*/
Simulation.prototype.pause = function() {
	this.paused = true;
}

/**
*	Unpauses the simulation
*/
Simulation.prototype.play = function() {
	this.paused = false;
}

/**
*	@return if the simulation is currently paused
*/
Simulation.prototype.isPaused = function() {
	return this.paused;
}

/**
*	Resets the simulation to the initial planet data
*/
Simulation.prototype.reset = function() {
	this.planets = [];
	for(var i = 0; i < this.startData.length; i++) {
		var d = this.startData[i];
		var p = new Planet(new Vector(d.x, d.y), new Vector(d.vx, d.vy), new Vector(d.ax, d.ay), d.mass, d.radius, d.color);
		this.planets.push(p);
	}
}