var container;
var skyGeo;
var camera, scene, renderer;
var timestep = 1;
var car_cubes = [];
var road_tiles = {
    'R1': {
        'x': 1,
        'y': 1
    }
};

road_tiles.R2 = {
    x: 1,
    y: 2
};

console.log(road_tiles);

var location_mapping = {
  "O1":[23,-35],
  "O2":[73,-35],
  "O3":[123,-35],
  "O4":[173,-35],
  "R1":[23,25],
  "R2":[73,25],
  "R3":[123,25],
  "R4":[173,25],
  "R5":[223,25],
  "R6":[273,25],
  "R7":[323,25],
  "R8":[373,25],
  "R9":[423,25],
  "L1":[23,75],
  "L2":[73,75],
  "L3":[123,75],
  "L4":[173,75],
  "L5":[223,75],
  "L6":[273,75],
  "L7":[323,75],
  "L8":[373,75],
  "L9":[423,75],
  "G":[500,50]
}

function newTile(name, x, y, list) {
    list[name] = {
        'x': x,
        'y': y
    };
}

function generateRoad(names_list, tile_list) {
    for (i in names_list) {
        var name = names_list[i];
        var y;
        if (name.startsWith('R')) {
            y = 1;
        } else if (name.startsWith('L')) {
            y = 2;
        }
        newTile(name, name[1], y, tile_list);
    }

}

generateRoad(['R1', 'R2', 'R3', 'R4', 'L1', 'L2', 'L3'], road_tiles);

console.log(road_tiles);

function newVehicle() {
    var vehicle = {
        location: "R1",
        x: 1,
        y: 1
    };
}

var v = newVehicle();

function setVehiclePosition(car, x, y) {
    car.position.x = 50 * (x - 1) + 25;
    car.position.y = 50 * (y - 1) + 25;
}

var cars_list = [];

var car_plans = {
    'car1': {
        1: {
            x: 1,
            y: 1
        },
        2: {
            x: 2,
            y: 1
        },
        3: {
            x: 4,
            y: 1
        },
        4: {
            x: 6,
            y: 1
        },
        5: {
            x: 8,
            y: 1
        },
        6: {
            x: 9,
            y: 1
        }
    }
};
car_plans['car2'] = {
    1: {
        x: 1,
        y: 2
    },
    2: {
        x: 2,
        y: 2
    },
    3: {
        x: 3,
        y: 2
    },
    4: {
        x: 4,
        y: 2
    },
    5: {
        x: 5,
        y: 2
    },
    6: {
        x: 6,
        y: 2
    }
};
car_plans['car3'] = {
    1: {
        x: 2,
        y: 0
    },
    2: {
        x: 3,
        y: 0
    },
    3: {
        x: 4,
        y: 0
    },
    4: {
        x: 5,
        y: 1
    },
    5: {
        x: 6,
        y: 1
    },
    6: {
        x: 7,
        y: 1
    }
};


console.log(car_plans);
console.log(cars_list);

function updateVehiclePositions(cars_list, car_plans, time) {
    for (i in cars_list) {
        var car = cars_list[i];
        var car_name = car.name;
        // console.log('moved '+car_name);

        if (car_plans[car_name] && car_plans[car_name][time]) {
            setVehiclePosition(car, car_plans[car_name][time].x, car_plans[car_name][time].y);
        } else {
            console.log(car_name + " doesn't have a plan at time " + time.toString());
        }
    }
}

function openFile(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var obj = JSON.parse(reader.result);
        console.log(obj);
        var str = JSON.stringify(obj, undefined, '\t');
        document.getElementById('output_div').innerHTML = syntaxHighlight(str);
        initPolicy(obj);
    };

    reader.readAsText(input.files[0]);
};

function openFile2(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var obj = JSON.parse(reader.result);
        console.log(obj);
        var str = JSON.stringify(obj, undefined, '\t');
        document.getElementById('output_div').innerHTML = syntaxHighlight(str);
        initOtherVehicles(obj);
    };

    reader.readAsText(input.files[0]);
};



var nodes_from_json;
var other_vehicles_from_json;
var other_vehicle_positions = {};
var plan_positions = {};

function initPolicy(obj) {

    nodes_from_json = obj['nodes'];
    var state;
    var location;
    var state_time;
    for (i in nodes_from_json) {
        state = nodes_from_json[i]['state'];
        state_time = state.split('timestep:')[1].split(',')[0];
        location = state.split('location:')[1].split(',')[0];
        if (plan_positions[state_time]) {
            plan_positions[state_time].push(location);
        } else {
            plan_positions[state_time] = [location, ];
        }
        console.log(state_time);
    }

    // Reset clock to first timestep
    timestep = 1;
    document.getElementById('timestep_text').innerHTML = "Timestep: " + timestep.toString();
    updateMainVehicle("1");
}

function initOtherVehicles(obj) {

    other_vehicle_positions = obj;
    // Reset clock to first timestep
    timestep = 1;
    document.getElementById('timestep_text').innerHTML = "Timestep: " + timestep.toString();
    updateOtherVehicles("1");
}

var other_vehicles_list=[];

function updateOtherVehicles(time){
  for (i in other_vehicles_list){
    // console.log(cars_list[i]);
    other_vehicles_list[i].visible = false;
  }

  other_vehicles_list = [];

    console.log("updateOtherVehicles : " + time)
    // console.log(plan_positions[time]);
    var locale;

    if(other_vehicle_positions[time]){

      for(i in other_vehicle_positions[time]){
        locale = other_vehicle_positions[time][i];

        if(location_mapping[locale]){
          var red_car = red_car_collada.clone();
          red_car.visible = true;
          red_car.position.x = location_mapping[locale][0];
          red_car.position.y = location_mapping[locale][1];
          red_car.name = "car3";
          red_car.updateMatrix();
          other_vehicles_list.push(red_car);
          scene.add(red_car);
          // console.log(blue_car_2);
        }
      }

    }
}

function updateMainVehicle(time) {
  for (i in cars_list){
    // console.log(cars_list[i]);
    cars_list[i].visible = false;
  }
  cars_list = [];

    console.log("updateMainVehicle: " + time)
    // console.log(plan_positions[time]);
    var locale;

    if(plan_positions[time]){
      console.log(plan_positions[time]);

      for(i in plan_positions[time]){
        console.log(plan_positions[time][i]);
        locale = plan_positions[time][i];

        if(location_mapping[locale]){
          var blue_car_2 = blue_car_collada.clone();
          blue_car_2.visible = true;
          blue_car_2.position.x = location_mapping[locale][0];
          blue_car_2.position.y = location_mapping[locale][1];
          blue_car_2.name = "car3";
          blue_car_2.updateMatrix();
          cars_list.push(blue_car_2);
          scene.add(blue_car_2);
          // console.log(blue_car_2);
        }
      }

    }

}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function moveTime(interval) {
    if ((timestep + interval) > 0 && (timestep + interval) <= Object.keys(plan_positions).length) {
        timestep = timestep + interval;
        document.getElementById('timestep_text').innerHTML = "Timestep: " + timestep.toString();
        // moveVehicle(0,interval);
        // updateVehiclePositions(cars_list,car_plans,timestep);
        updateMainVehicle(timestep.toString());
        updateOtherVehicles(timestep.toString());
    }

};

var blue_car_collada;
var red_car_collada;

function moveVehicle(id, interval) {
    // console.log('moved '+id+' an interval of '+interval.toString());
    car_cubes[id].position.x = car_cubes[id].position.x + 50 * interval;

}

function init() {

    container = document.getElementById('threejs_container');

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.z = 200;
    camera.position.y = -200;
    camera.lookAt(new THREE.Vector3(200, 0, 0));

    controls = new THREE.TrackballControls(camera, container);

    controls.rotateSpeed = 0.01;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.01;
    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    controls.addEventListener('change', render);


    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0xcce0ff, 100, 10000 );

    // ground
    /*
    		var groundTexture = loader.load( 'textures/terrain/grasslight-big.jpg',
            function ( groundTexture ) {
              groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
              groundTexture.repeat.set( 25, 25 );
              groundTexture.anisotropy = 16;

              var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

              var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
              mesh.position.y = - 250;
              mesh.rotation.x = - Math.PI / 2;
              mesh.receiveShadow = true;
              scene.add( mesh );
          });
          */

    /*
    var material = new THREE.LineBasicMaterial({color:0x000000, opacity:1});
    var ellipse = new THREE.EllipseCurve(0, 0, 50, 20, 0, 2.0 * Math.PI, false);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);
    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    ellipseGeometry.computeTangents();
    var line = new THREE.Line(ellipseGeometry, material);
    scene.add( line );
    */

    // Simple Ocean surface

    var surface_material = new THREE.MeshBasicMaterial({
            color: '#b3b3b3',
            opacity: 1,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        })
        // var surface_geometry = new THREE.PlaneGeometry(terrainFullX*terrainCellSize , terrainFullY*terrainCellSize);
    var surface_geometry = new THREE.PlaneGeometry(1000, 1000);

    var surface_mesh = new THREE.Mesh(surface_geometry, surface_material);
    surface_mesh.position.z = -1;
    // scene.add(surface_mesh);
    //
    // FLOOR
    var floor_loader = new THREE.TextureLoader();
    floor_loader.load('textures/asphalt.jpg',
        function(floorTexture) {
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set(10, 1);
            var floorMaterial = new THREE.MeshBasicMaterial({
                map: floorTexture,
                side: THREE.DoubleSide
            });
            var floorGeometry = new THREE.PlaneGeometry(2000, 300, 100, 100);
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.z = -0.1;
            floor.position.x = 200;
            floor.position.y = 0;
            scene.add(floor);
        }
    );
    var grass_loader = new THREE.TextureLoader();
    grass_loader.load('textures/grasslight-big.jpg',
        function(groundTexture) {
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set(50,

                50);
            groundTexture.anisotropy = 16;

            var groundMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x111111,
                map: groundTexture
            });

            var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(5000, 5000), groundMaterial);
            mesh.position.z = -1;
            // mesh.rotation.x = - Math.PI / 2;
            mesh.receiveShadow = true;
            scene.add(mesh);
        }
    );






    // Grid //////////////////////////////////

    var grid_size = 50;

    var length = 10;
    var width = 3 * grid_size;

    var size = 500,
        step = 50;

    var num_lanes = 2;

    var geometry = new THREE.Geometry();

    for (var i = 0; i <= num_lanes; i += 1) {
        geometry.vertices.push(new THREE.Vector3(0, i * grid_size, 0));
        geometry.vertices.push(new THREE.Vector3(grid_size * length, i * grid_size, 0));
    }

    for (var i = 0; i < length; i += 1) {
        geometry.vertices.push(new THREE.Vector3((i + 1) * grid_size, grid_size * num_lanes, 0));
        geometry.vertices.push(new THREE.Vector3((i + 1) * grid_size, 0, 0));
        geometry.vertices.push(new THREE.Vector3(i * grid_size, 0, 0));
        geometry.vertices.push(new THREE.Vector3(i * grid_size, grid_size * num_lanes, 0));
    }
    //

    var on_ramp_length = 4;

    geometry.vertices.push(new THREE.Vector3(0, -grid_size-10, 0));
    geometry.vertices.push(new THREE.Vector3(on_ramp_length*grid_size, -grid_size-10, 0));


    for (var i = 0; i < on_ramp_length; i += 1) {
        geometry.vertices.push(new THREE.Vector3((i + 1) * grid_size, -grid_size-10, 0));
        geometry.vertices.push(new THREE.Vector3((i + 1) * grid_size, 0, 0));
        geometry.vertices.push(new THREE.Vector3(i * grid_size, 0, 0));
        geometry.vertices.push(new THREE.Vector3(i * grid_size, -grid_size-10, 0));
    }

    // var material = new THREE.LineBasicMaterial( { color: "#ffffff", opacity: 1 } );
    geometry.computeLineDistances();
    var line = new THREE.LineSegments(geometry, new THREE.LineDashedMaterial({
        color: "#ffffff",
        dashSize: 2,
        gapSize: 5
    }));

    scene.add(line);

    var geometry = new THREE.Geometry();

    //on ramp diagonal
    geometry.vertices.push(new THREE.Vector3(grid_size * on_ramp_length, -grid_size-10, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * (on_ramp_length + 1), 0, 0));

    //outline the on ramp segment
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * on_ramp_length, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, -10, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * on_ramp_length-10, -10, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * on_ramp_length-10, -10, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * on_ramp_length, 0, 0));

    geometry.vertices.push(new THREE.Vector3(0, -grid_size-10, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * on_ramp_length, -grid_size-10, 0));

    //outline the higway median
    geometry.vertices.push(new THREE.Vector3(0, num_lanes * grid_size, 0));
    geometry.vertices.push(new THREE.Vector3(length * grid_size, num_lanes * grid_size, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * (on_ramp_length + 1), 0, 0));
    geometry.vertices.push(new THREE.Vector3(grid_size * length, 0, 0));


    var material = new THREE.LineBasicMaterial({
        color: "#ffffff",
        opacity: 1,
        linewidth: 6
    });
    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    /*
    // RED LINE x-axis
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 400, 0, 0) );
    var material = new THREE.LineBasicMaterial( { color: "#ff0066", opacity: 1 } );
    var line = new THREE.LineSegments( geometry, material );
    // scene.add( line );
    // PURPLE LINE y-axis
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 200, 0) );
    var material = new THREE.LineBasicMaterial( { color: "#6600cc", opacity: 1 } );
    var line = new THREE.LineSegments( geometry, material );
    // scene.add( line );
    // GREEN LINE z-axis
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 200) );
    var material = new THREE.LineBasicMaterial( { color: "#003300", opacity: 1 } );
    var line = new THREE.LineSegments( geometry, material );
    // scene.add( line );
    */


    // Cubes

    //blue cube
    /*
    var geometry = new THREE.BoxGeometry( 40, 40, 50 );
    var material = new THREE.MeshLambertMaterial( { color: "#3366ff", overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.scale.x = 1.5;
    cube.position.x = 25;
    cube.position.y = 25;
    cube.position.z = 25;
    cube.name = "car1";
    scene.add( cube );
    scene.scale.x =1.3;
    // cars_list.push(cube);
    */

        //blue car
        var dae;
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load( './models/avalon_2014_blue.dae', function ( collada ) {
          blue_car_collada = collada.scene;
        	dae = collada.scene;
        	dae.scale.x = dae.scale.y = dae.scale.z = 0.09;
          dae.rotation.x = Math.PI/2.0;
          dae.rotation.y = Math.PI/2.0;
          dae.position.y = 25;
          dae.position.x = 23;
          dae.name = "car1";
        	dae.updateMatrix();
          cars_list.push(dae);
          scene.add( dae );
        });


    skyGeo = new THREE.SphereGeometry(10000, 25, 25);
    skyGeo.rotateX(Math.PI / 2)

    // instantiate a loader
    var loader = new THREE.TextureLoader();
    // load a resource
    loader.load(
        // resource URL
        "textures/sky3.jpg",
        // Function when resource is loaded
        function(texture) {
            // do something with the texture
            var material = new THREE.MeshPhongMaterial({
                map: texture,
            });
            var sky = new THREE.Mesh(skyGeo, material);
            sky.material.side = THREE.BackSide;
            scene.add(sky);
            console.log('added sky');
        });




    // particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    // scene.add( particleLight );
    /*

        var loader = new THREE.ColladaLoader();
    						// loader.options.convertUpAxis = true;
    						loader.load('model.dae', //'./models/collada/monster/monster.dae', //
                // loader.load('C:/Users/MDEYO/Documents/three.js-master/three.js-master/examples/avalon_2014_blue_gutted.dae', //'./models/collada/monster/monster.dae', //

    						function ( collada ) {
    							var dae = collada.scene;
                  dae.traverse( function ( child ) {
                    if ( child instanceof THREE.SkinnedMesh ) {
                      var animation = new THREE.Animation( child, child.geometry.animation );
                      animation.play();
                    }
                  } );
    							dae.scale.x = dae.scale.y = dae.scale.z = 0.20; //2.0;//
    							dae.updateMatrix();
    							scene.add( dae );
                  console.log(dae);
    							// box = dae;
    						} );
    */

    //red cubes
    /*
    var geometry = new THREE.BoxGeometry( 40, 40, 50 );
    var material = new THREE.MeshLambertMaterial( { color: "#ff0000", overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.scale.y = 1;
    cube.name = "car2";
    cube.position.x = 125;
    cube.position.y = 75;
    cube.position.z = 25;
    scene.add( cube );
    cars_list.push(cube);

    var geometry = new THREE.BoxGeometry( 40, 40, 50 );
    var material = new THREE.MeshLambertMaterial( { color: "#ff0000", overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.scale.y = 1;
    cube.name = "car3";
    cube.position.x = 125;
    cube.position.y = 75;
    cube.position.z = 25;
    scene.add( cube );
    cars_list.push(cube);
    */


        //red cars
        var dae;
        var red_car_2;
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load( './models/avalon_2014_red.dae', function ( collada ) {
          dae = collada.scene;
          red_car_collada = dae;
          dae.scale.x = dae.scale.y = dae.scale.z = 0.09;
          dae.rotation.x = Math.PI/2.0;
          dae.rotation.y = Math.PI/2.0;
          dae.position.y = 75;
          dae.position.x = 23;
          dae.name = "car2";
          dae.updateMatrix();
          cars_list.push(dae);
          scene.add( dae );
          console.log(dae);

        });



    // var dae;
    // var loader = new THREE.ColladaLoader();
    // loader.options.convertUpAxis = true;
    // loader.load( './models/avalon_2014_red.dae', function ( collada ) {
    //   dae = collada.scene;
    //   dae.scale.x = dae.scale.y = dae.scale.z = 0.09;
    //   dae.rotation.x = Math.PI/2.0;
    //   dae.rotation.y = Math.PI/2.0;
    //   dae.position.x = 23;
    //   dae.position.y = -25;
    //   dae.name = "car3";
    //   dae.updateMatrix();
    //   cars_list.push(dae);
    //   scene.add( dae );
    // });


    // Lights
    /*
        var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
        // var ambientLight = new THREE.AmbientLight( 0x10 );
        scene.add( ambientLight );

        // var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 1, 1 );
        scene.add( directionalLight );

        // var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set(-0.35, -0.82, 0.43);

        // directionalLight.position.normalize();
        scene.add( directionalLight );
        // console.log(directionalLight);
    */
    // renderer = new THREE.CanvasRenderer();
    // renderer.setClearColor( 0xf0f0f0 );
    // renderer.setPixelRatio( window.devicePixelRatio*2);
    // renderer.setSize( 1000, 500);
    // // renderer.setSize( 400, 150 );
    // container.appendChild( renderer.domElement );


    // Lights

    scene.add(new THREE.AmbientLight(0xcccccc));

    var directionalLight = new THREE.DirectionalLight( /*Math.random() * 0xffffff*/ 0xeeeeee, 0.5);
    directionalLight.position.x = 0;
    directionalLight.position.y = 0;
    directionalLight.position.z = 10000;
    directionalLight.position.normalize();
    scene.add(directionalLight);

    // var pointLight = new THREE.PointLight( 0xffffff, 4 );
    // particleLight.add( pointLight );

    // renderer = new THREE.CanvasRenderer();
    // renderer.setClearColor( 0xf0f0f0 );
    // renderer.setPixelRatio( window.devicePixelRatio*2);
    // renderer.setSize( 1000, 500);
    // container.appendChild( renderer.domElement );

    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    // renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(1000, 700);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    camera.lookAt(new THREE.Vector3(200, 0, 0));

}

function onWindowResize() {
    // camera.left = window.innerWidth / - 2;
    // camera.right = window.innerWidth / 2;
    // camera.top = window.innerHeight / 2;
    // camera.bottom = window.innerHeight / - 2;
    //
    // camera.updateProjectionMatrix();
    // controls.handleResize();
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    render();
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
    // console.log(car_cubes[0]);
    // car_cubes[0].position.x = car_cubes[0].position.x+1;
}

function render() {

    // var timer = Date.now() * 0.0001;
    // camera.position.x = Math.cos( timer ) * 200;
    // camera.position.y = Math.sin( timer ) * 200;
    // camera.lookAt( scene.position );
    renderer.render(scene, camera);
    // console.log(camera);
}
