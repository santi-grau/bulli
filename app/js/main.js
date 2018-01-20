window.THREE = require('three');

var letters = JSON.parse(require('./letters.json'));

var Main = function( options ) {
	this.element = document.getElementById('main');
	var labels = document.getElementsByClassName('count');
	this.labels = {};
	for( var i = 0 ; i < labels.length ; i++ ) this.labels[ labels[i].classList[1] ] = labels[i];

	this.switch = false;
	options = options || {};

	// Three scene
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.element.appendChild( this.renderer.domElement );

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	this.linegroup = new THREE.Object3D();
	this.scene.add(this.linegroup)
	this.currentGroup = 0;

	for( var i = 0 ; i < letters.length ; i ++ ){
		var vertices = [];
		for( var j = 0 ; j < letters[i].length ; j ++ ) vertices.push( letters[i][j][0], -letters[i][j][1], 0 );

		var geometry = new THREE.BufferGeometry();
		geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) );
		geometry.center();
		geometry.setDrawRange(0,0);
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		var line = new THREE.Line( geometry, material );
		line.scale.set(1.1,1.1,1.1)
		this.linegroup.add( line );
	}

	this.resize();
	this.step();
}

Main.prototype.drawPoint = function(){
	var geometry = this.linegroup.children[this.currentGroup].geometry;
	var range = geometry.drawRange.count;
	var total = geometry.attributes.position.count;
	if( range < total ) geometry.setDrawRange( 0, range + 5 );
	else if( this.currentGroup < this.linegroup.children.length - 1 ) this.currentGroup++;
	else return this.done = true;
}


Main.prototype.resize = function( e ) {
	var width = this.element.offsetWidth, height = this.element.offsetHeight;
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	if( !this.done ) this.drawPoint();
	this.renderer.render( this.scene, this.camera );
};

var root = new Main();