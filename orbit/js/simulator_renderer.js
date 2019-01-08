/**
*	Creates a simulation renderer object
*	@param simulution - pre-initializes simulation to be rendered
*	@param camera - user specified camera to visualize the scene
*	@param windowDiv - div to attatch render to
*/
function SimulationRenderer(simulation, camera, windowDiv) {
	this.simulation = simulation;
	this.camera = camera;
	this.scene;
	this.windowDiv = windowDiv;
	this.renderer;
	this.planetMeshes = [];
	this.trailHeadGeometries = [];
}

/**
*	Initializes the scene, all of the planet meshes, and the light for the sun
*/
SimulationRenderer.prototype.init = function() {
	this.scene = new THREE.Scene();
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setSize(this.windowDiv.clientWidth, this.windowDiv.clientHeight);
	this.windowDiv.appendChild(this.renderer.domElement);

	//create all the planet meshes
	var simPlanets = this.simulation.planets;
	for(var i = 0; i < simPlanets.length; i++) {
		var p = simPlanets[i];
		var geo = new THREE.SphereGeometry(p.radius, 32, 32);
		var mat;

		if(i == 0) {
			mat= new THREE.MeshLambertMaterial({color: p.color, emissive: 0xd2c836});
		} else {
			trialHeadGeom = [];
			trialHeadGeom.push(
				new THREE.Vector3(p.position.x - p.radius, p.position.y, 0),
				new THREE.Vector3(p.position.x + p.radius, p.position.y, 0),
				new THREE.Vector3(p.position.x - p.radius, p.position.y - p.radius, 0)

			);
			//console.log(p.color);
			mat = new THREE.MeshLambertMaterial({color: p.color});
		}

		var mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(p.position.x, p.position.y, 0);
		this.scene.add(mesh);
		this.planetMeshes.push(mesh);
	}

	//create light for sun
	var sunLight = new THREE.PointLight(0xffffff, 2, 0);
	sunLight.name = "sunlight";
	sunLight.position.set(0, 0, 0);
	this.scene.add(sunLight);
};

/**
*	Renders scene for the simulation after doing a step through the simulation
*/
SimulationRenderer.prototype.render = function() {
	if(!this.simulation.isPaused()) {
		this.simulation.step();
	}

	for(var i = 0; i < this.planetMeshes.length; i++) {
		this.planetMeshes[i].position.set(this.simulation.planets[i].position.x, this.simulation.planets[i].position.y, 0);

		if(i == 0) {
			this.scene.getObjectByName('sunlight').position.set(this.simulation.planets[i].position.x, this.simulation.planets[i].position.y, 0);
		}
	}

	this.renderer.render(this.scene, this.camera);
}

/**
*	Renders scene for the simulation steps forward a single frame in the simulation
*/
SimulationRenderer.prototype.stepFrame = function() {
	if(simulation.isPaused()) {
		this.simulation.step();
	}

	for(var i = 0; i < this.planetMeshes.length; i++) {
		this.planetMeshes[i].position.set(this.simulation.planets[i].position.x, this.simulation.planets[i].position.y, 0);

		if(i == 0) {
			this.scene.getObjectByName('sunlight').position.set(this.simulation.planets[i].position.x, this.simulation.planets[i].position.y, 0);
		}
	}

	this.renderer.render(this.scene, this.camera);
}

/*TODO: 
	add way to pause scene; 
	tool bar to: create custom scene, create, modify, remove planet; 
	create different stock scenes to show off capabilities / features
	--not necessary but would be nice--: resize render window on browser resize
*/