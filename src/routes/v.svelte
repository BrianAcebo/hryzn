<script>
  import * as THREE from "three";
  import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
  import { PerspectiveCamera } from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { DragControls } from 'three/examples/jsm/controls/DragControls';
  import { onMount } from 'svelte';
  import keyInput from "$lib/utils/three/keyInput";
  import { CloudyIcon, DeleteIcon, SunIcon, MoonIcon, DragIcon, VolumeUpIcon } from 'svelte-mono-icons';
  import { browser } from '$app/env';
  import AssetMenu from "$lib/components/AssetMenu.svelte";
  import { ChevronLeftIcon } from 'svelte-mono-icons';
  import { addToast } from "$lib/stores/toastMsg";


  // Three js canvas and it's container
  let theCanvas;
  let theContainer;
  let world; // world group for objects
  let ground;


  // Asset slider menu
  let assetSelected;


  // Object and controls
  let objects = [];
  let dragControls;
  let orbitControls;


  // Editor
  let editorAction = 'DRAG';
  let addAsset;
  let removeAsset;
  let onRemove;
  let isNightTime = false;
  let nightTimeBtn;
  let bgTexture;
  let rotateRightBtn;
  let rotateLeftBtn;
  let music = 'Music';
  let mouseClick;
  let currentCategory = '';
  let currentCatTab = 'trees';
  let addGroundTexture = false;
  let groundTexture;


  // Check night or day
  const checkNightTime = (event) => {
    isNightTime = event.currentTarget.checked;
  }


  // On editor action change
  const changeEditorAction = (event) => {
    editorAction = event.currentTarget.value;

    if (editorAction === 'DRAG') {
      dragControls.activate();
      orbitControls.enabled = false;

      const t_msg = 'Unselect drag to use orbit controls. (Zoom, rotate, pan, etc.)';
      const t_type = 'info';
      addToastMsg(t_msg, t_type);

      if (theContainer.getAttribute('mouseClick') == 'true') {
        theContainer.removeEventListener("click", mouseClick);
        theContainer.setAttribute('mouseClick', 'false');
      }
    } else {
      dragControls.deactivate();
      orbitControls.enabled = true;
    }
  }


  // Add asset from slider menu
  const checkAssetClicked = (event) => {
    assetSelected = event.currentTarget.id;
    editorAction = 'ADD';
    addGroundTexture = false;

    const t_msg = 'Object selected. Click the 3D world to add.';
    const t_type = 'success';
    addToastMsg(t_msg, t_type);
  }


  // Add ground texture
  const addGround = (event) => {
    groundTexture = event.currentTarget.id;
    editorAction = 'ADD';
    addGroundTexture = true;

    const t_msg = 'Ground texture selected. Click the 3D world to add.';
    const t_type = 'success';
    addToastMsg(t_msg, t_type);
  }


  // Toast notifications
  const addToastMsg = (msg, type) => {
    addToast({
      message: msg,
      type: type,
      dismissible: false,
      timeout: 3000,
    });
  }


  onMount(() => {


    let sceneWidth = theContainer.offsetWidth;
    let sceneHeight = theContainer.offsetHeight;

    // Scene
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    if (isNightTime) {
      bgTexture = loader.load('/img/site/threeJSBG/night.jpg');
    } else {
      bgTexture = loader.load('/img/site/threeJSBG/sunny.jpg');
    }
    scene.background = bgTexture;
    scene.fog = new THREE.Fog( scene.background, 1, 5000 );


    // Camera
  	// const camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 0.1, 1000 );
    // camera.position.set(0, 35, 35);
    // scene.add(camera);

    const camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 1, 10000);
    camera.position.set(0, 30, 60);
		camera.lookAt(new THREE.Vector3(0,0,0));
		camera.add(new THREE.PointLight(0xffffff,0.7)); // point light at camera position
		scene.add(camera);


    // Renderer
  	const renderer = new THREE.WebGLRenderer({alpha: true});
  	renderer.setSize(sceneWidth, sceneHeight);
  	theCanvas.appendChild(renderer.domElement);


    // Raycaster
    const raycaster = new THREE.Raycaster();


    // // Asset Texture
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load('/3D/site/avatar/character11_mat_roughness.png');
    // const material = new THREE.MeshStandardMaterial( { map: texture } );
    // texture.flipY = false;
    //
    //
    // // Asset Model Loader
    // const loader = new GLTFLoader();
    // loader.load('/3D/site/avatar/avatar.gltf', function (object) {
    //
    //   object.scene.traverse(function (child) {
    //     if (child.isMesh) {
    //       child.geometry.center()
    //       child.material = material;
    //       child.material.metalness = 0;
    //     } else {
    //       console.log(object.scene)
    //     }
    //   });
    //
    // 	scene.add(object.scene);
    //
    // }, function (xhr) {
    //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    // }, function (error) {
    //   console.error(error);
    // });


    // Lighting
    const light = new THREE.AmbientLight( 0xffffff, 1 );
    //const light = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(500, 500, 500);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);


    // Resize window
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
      camera.aspect = sceneWidth / sceneHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(sceneWidth, sceneHeight);
      render();
    }


    // Group all objects into world
    world = new THREE.Group();


    // Ground
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load('/3D/verse/environment/ground-texture/meadow.png');
    const texture = '';
    //texture.flipY = false;
		ground = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 50), new THREE.MeshPhongMaterial({ color: 'grey', map: texture}));
		ground.position.y = -1;  // top of base lies in the plane y = -5;
    ground.userData.name = 'Ground';
		world.add(ground);


    // Avatar Model Loader
    const avatarLoader = new FBXLoader();
    avatarLoader.load('/3D/verse/avatars/man-astronaut.fbx', function (object) {

      object.scale.set( .01, .01, .01 );
      object.name = 'Avatar';
      object.position.set(0, -0.5, 0);

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });

      // // Asset Texture
      // const textureLoader = new THREE.TextureLoader();
      // textureLoader.load('/3D/verse/avatars/man-astronaut.fbx', function(texture) {
      //   object.traverse(function (child) {
      //     if (child.isMesh) {
      //       child.material.map = texture;
      //     }
      //   });
      // });

      objects.push(object);
    	scene.add(object);
      world.add(object);

    }, function (xhr) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, function (error) {
      console.error(error);
    });


    // Objects
    function addObject(x, z, type) {
      const loader = new FBXLoader();
      loader.load('/3D/verse/' + assetSelected + '.fbx', function (object) {

        // Size helper
        // let bbox = new THREE.Box3().setFromObject(object);
        // let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
        // let size = bbox.getSize(new THREE.Vector3()); // HEREyou get the size
        // console.log(size)

        object.scale.set( .01, .01, .01 );
        object.name = 'Asset';

        if (assetSelected != 'environment/clouds/big' && assetSelected != 'environment/clouds/long' && assetSelected != 'environment/clouds/triangle') {
          object.position.set(0, -0.5, 0);
        } else {
          object.userData = { cloud: true };
          object.position.set(0, 20, 0);
        }

        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });

        console.log(object)

        objects.push(object);
        scene.add(object);
        world.add(object);

      }, function (xhr) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, function (error) {
        console.error(error);
      });
    }


    // Orbit Controls
    orbitControls = new OrbitControls(camera, renderer.domElement);


    // Object Drag Controls
    dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener('drag', function (event) {

      let x_z_max;

      if (!event.object.userData.cloud) {
        if (event.object.position.y != 0) {
          event.object.position.y = 0;
        };
      } else {
        if (event.object.position.y != 20) {
          event.object.position.y = 20;
        };
      }

      if (event.object.parent.name === 'Asset') {
        x_z_max = 2500;
      } else {
        x_z_max = 24;
      }

      if (event.object.position.x < -x_z_max) {
        event.object.position.x = -x_z_max;
      };

      if (event.object.position.x > x_z_max) {
        event.object.position.x = x_z_max;
      };

      if (event.object.position.z < -x_z_max) {
        event.object.position.z = -x_z_max;
      };

      if (event.object.position.z > x_z_max) {
        event.object.position.z = x_z_max;
      };
    });


    // Add the group to the scene
    scene.add(world);


    // Run Animation
    function animate() {
      requestAnimationFrame(animate);

      // Rotate world group with arrow keys
      // if (keyInput.isPressed(38)) {
      //   world.rotateX(0.08); // up
      // }
      //
      // if (keyInput.isPressed(40)) {
      //   world.rotateX(-0.08); // down
      // }

      if (keyInput.isPressed(37)) {
        world.rotateY(0.08); // right
      }

      if (keyInput.isPressed(39)) {
        world.rotateY(-0.08); // left
      }

      render()
    }


    // On mouse click for editor
    if (browser) {

      // Perform editor action on click
      theContainer.addEventListener("click", mouseClick);

      // Change day and night on toggle
      nightTimeBtn.addEventListener("change", function() {
        if (isNightTime) {
          bgTexture = loader.load('/img/site/threeJSBG/night.jpg');
        } else {
          bgTexture = loader.load('/img/site/threeJSBG/sunny.jpg');
        }
        scene.background = bgTexture;
        render()
      });


      // Rotate world group while holding mouse down
      let timer;
      rotateRightBtn.addEventListener("mousedown", function() {
        timer = setInterval(function(){
          world.rotateY(0.08);
        }, 50);
      });
      rotateRightBtn.addEventListener("mouseup", function(){
        if (timer) clearInterval(timer)
      });

      rotateLeftBtn.addEventListener("mousedown", function() {
        timer = setInterval(function(){
          world.rotateY(-0.08);
        }, 50);
      });
      rotateLeftBtn.addEventListener("mouseup", function(){
        if (timer) clearInterval(timer)
      });
    }

    function mouseClick(event) {

      theContainer.setAttribute('mouseClick', 'true');

      const rect = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2();

      pointer.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
      pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

      // pointer.x = (event.offsetX / window.innerWidth) * 2 - 1;
    	// pointer.y = - (event.offsetY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
  		const intersects = raycaster.intersectObjects(world.children, true);  // no need for recusion since all objects are top-level
  		if (intersects.length == 0) {
  			return false;
  		}
  		let item = intersects[0];
  		let object = item.object;

      switch (editorAction) {
        case 'ADD':
          if (object == ground) {

            if (!addGroundTexture) {

              let locationX = item.point.x;  // Gives the point of intersection in world coords
              let locationZ = item.point.z;
              let coords = new THREE.Vector3(locationX, 0, locationZ);
              world.worldToLocal(coords);  // to add cylider in correct position, neew local coords for the world object
              addObject(coords.x, coords.z);

              const t_msg = 'Object placed in center.';
              const t_type = 'success';
              addToastMsg(t_msg, t_type);

            } else {

              const textureLoader = new THREE.TextureLoader();
              const texture = textureLoader.load('/3D/verse/environment/ground-texture/' + groundTexture);
              ground.material.map = texture;
              ground.material.needsUpdate = true;

            }

            render();
          }
          return false;
        case 'REMOVE':
          // REMOVE
          if (object != ground) {

            if (object.parent.name === "Asset" && object.parent.name != "Avatar") {
              object = object.parent;

              objects = objects.filter(function (value, index, arr) {
                return value != object;
              });
              world.remove(object);
              scene.remove(object);

              const t_msg = 'Object removed.';
              const t_type = 'success';
              addToastMsg(t_msg, t_type);

              render();
            }

          }
          return false;
        default:
          // DRAG
          return false;
      }
    }


    // Run Render
    function render() {
      requestAnimationFrame(render);
      //camera.lookAt(ground.position);
      renderer.render(scene, camera);
    }


    // Run it all
    animate()

  });


</script>


<svelte:head>
  <title>Verse</title>
</svelte:head>

<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle">
  <div class="drawer-content">

    <div class="hero w-full p-0 max-w-5xl m-auto hero_container">
      <div class="hero-content flex-col lg:flex-row w-full justify-between items-center p-0">
        <div class="w-3/12 editor_btns_container">

          <!-- <div class="form-control w-full">
            <div class="dropdown dropdown-right w-full">
              <label for="v-dropdown" tabindex="0" class="btn bg-base-100 w-full justify-between items-center capitalize flex">
                {music}
                <VolumeUpIcon size="1.5x" class="icon_color" focusable="false" />
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li on:click={() => {music = 'Pop'}}><a>Pop</a></li>
                <li on:click={() => {music = 'Rock'}}><a>Rock</a></li>
                <li on:click={() => {music = 'Lofi'}}><a>Lofi</a></li>
                <li on:click={() => {music = 'Hip Hop'}}><a>Hip Hop</a></li>
                <li on:click={() => {music = 'Serene'}}><a>Serene</a></li>
                <li on:click={() => {music = 'No Music'}}><a>No Music</a></li>
              </ul>
            </div>
          </div> -->

          <div class="form-control btn bg-base-100 flex justify-center items-center mt-5">
            <label for="v-time" class="label cursor-pointer w-full">
              <input bind:this={nightTimeBtn} type="checkbox" class="toggle" checked={isNightTime} on:change={checkNightTime}>
              {#if isNightTime}
              <span class="label-text capitalize">Night</span>
              <MoonIcon size="1.5x" class="icon_color" focusable="false" />
              {:else}
              <span class="label-text capitalize">Day</span>
              <SunIcon size="1.5x" class="icon_color" focusable="false" />
              {/if}
            </label>
          </div>

          <div class="form-control btn bg-base-100 flex justify-center items-center mt-5">
            <label for="my-drawer" class="label cursor-pointer w-full drawer-button">
              <input type="radio" name="radio-6" class="radio checked:bg-base-400" value="ADD" checked={editorAction==="ADD"} on:change={changeEditorAction}>
              <span class="label-text capitalize">Add</span>
              <CloudyIcon size="1.5x" class="icon_color" focusable="false" />
            </label>
          </div>

          <div class="form-control btn bg-base-100 flex justify-center items-center mt-5">
            <label for="v-delete" class="label cursor-pointer w-full">
              <input type="radio" name="radio-6" class="radio checked:bg-base-400" value="REMOVE" checked={editorAction==="REMOVE"} on:change={changeEditorAction}>
              <span class="label-text capitalize">Remove</span>
              <DeleteIcon size="1.5x" class="icon_color" focusable="false" />
            </label>
          </div>

          <div class="form-control btn bg-base-100 flex justify-center items-center mt-5">
            <label for="v-drag" class="label cursor-pointer w-full">
              <input type="radio" name="radio-6" class="radio checked:bg-base-400" value="DRAG" checked={editorAction==="DRAG"} on:change={changeEditorAction}>
              <span class="label-text capitalize">Drag</span>
              <DragIcon size="1.5x" class="icon_color" focusable="false" />
            </label>
          </div>


          <div class="form-control flex justify-between items-center mt-5">
            <label for="v-rotate" class="label w-full">
              <span bind:this={rotateRightBtn} class="btn flex cursor-pointer">◀︎</span>
              <span class="label-text inline">Rotate</span>
              <span bind:this={rotateLeftBtn} class="btn flex cursor-pointer">▶︎</span>
            </label>
          </div>

          <button class="btn btn-primary mt-5 w-full">Save</button>
        </div>

        <div class="p-5 bg-base-300 w-9/12 scene_container rounded-xl">
          <div bind:this={theContainer} class="flex justify-center w-full h-full rounded-xl">
            <div id="canvas" bind:this={theCanvas}/>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="drawer-side">
    <label for="my-drawer" class="drawer-overlay"></label>

    <!-- Asset Menu -->
    <!-- <AssetMenu on:click={checkAssetClicked}/> -->
    <ul class="menu p-4 overflow-y-auto w-60 md:w-80 bg-base-100 text-base-content">

      {#if currentCategory === ''}
      <li on:click={() => { currentCategory = 'environment' }}>Environment</li>
      {/if}

      {#if currentCategory === 'environment'}
      <button class="btn btn-outline mb-10 relative" on:click={() => { currentCategory = ''}}>
        <ChevronLeftIcon size="1.5x" class="icon_color cursor-pointer absolute left-5 capitalize" focusable="false" />
        Categories
      </button>

      <div class="tabs mb-10 mr-auto ml-auto justify-center items-center flex">
        <h3 class="tab tab-bordered mb-5 {currentCatTab === "trees" ? 'tab-active' : ''}" on:click={() => { currentCatTab = 'trees' }}>Trees</h3>
        <h3 class="tab tab-bordered mb-5 {currentCatTab === "plants" ? 'tab-active' : ''}" on:click={() => { currentCatTab = 'plants' }}>Plants</h3>
        <h3 class="tab tab-bordered mb-5 {currentCatTab === "rocks" ? 'tab-active' : ''}" on:click={() => { currentCatTab = 'rocks' }}>Rocks</h3>
        <h3 class="tab tab-bordered mb-5 {currentCatTab === "clouds" ? 'tab-active' : ''}" on:click={() => { currentCatTab = 'clouds' }}>Clouds</h3>
        <h3 class="tab tab-bordered mb-5 {currentCatTab === "ground" ? 'tab-active' : ''}" on:click={() => { currentCatTab = 'ground' }}>Ground</h3>
      </div>


      <!-- Trees -->
      {#if currentCatTab === 'trees'}
      <div class="carousel w-full">
        <div id="slide1" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/trees/palm-preview.png" id="environment/trees/palm" class="w-full" on:click={checkAssetClicked} alt="trees">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide2" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/trees/spruce-preview.png" id="environment/trees/spruce" class="w-full" on:click={checkAssetClicked} alt="trees">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide3" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/trees/baobab-preview.png" id="environment/trees/baobab" class="w-full" on:click={checkAssetClicked} alt="trees">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" class="btn btn-circle">❮</a>
            <a href="#slide4" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide4" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/trees/birch-preview.png" id="environment/trees/birch" class="w-full" on:click={checkAssetClicked} alt="trees">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" class="btn btn-circle">❮</a>
            <a href="#slide5" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide5" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/trees/dead-preview.png" id="environment/trees/dead" class="w-full" on:click={checkAssetClicked} alt="trees">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide1" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
      {/if}
      <!-- /Trees -->


      <!-- Rocks -->
      {#if currentCatTab === 'rocks'}
      <div class="carousel w-full">
        <div id="slide1" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/rocks/sharp-preview.png" id="environment/rocks/sharp" class="w-full" on:click={checkAssetClicked} alt="rocks">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide2" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/rocks/small-preview.png" id="environment/rocks/small" class="w-full" on:click={checkAssetClicked} alt="rocks">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide3" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/rocks/flat-preview.png" id="environment/rocks/flat" class="w-full" on:click={checkAssetClicked} alt="rocks">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" class="btn btn-circle">❮</a>
            <a href="#slide4" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
      {/if}
      <!-- /Rocks -->


      <!-- Plants -->
      {#if currentCatTab === 'plants'}
      <div class="carousel w-full">
        <div id="slide1" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/plants/carnations-preview.png" id="environment/plants/carnations" class="w-full" on:click={checkAssetClicked} alt="plants">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide2" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/plants/shrub-flowers-preview.png" id="environment/plants/shrub-flowers" class="w-full" on:click={checkAssetClicked} alt="plants">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide3" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/plants/shrub-preview.png" id="environment/plants/shrub" class="w-full" on:click={checkAssetClicked} alt="plants">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" class="btn btn-circle">❮</a>
            <a href="#slide4" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide4" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/plants/grass-preview.png" id="environment/plants/grass" class="w-full" on:click={checkAssetClicked} alt="plants">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" class="btn btn-circle">❮</a>
            <a href="#slide5" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide5" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/plants/mushrooms-preview.png" id="environment/plants/mushrooms" class="w-full" on:click={checkAssetClicked} alt="plants">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide1" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
      {/if}
      <!-- /Plants -->


        <!-- Clouds -->
      {#if currentCatTab === 'clouds'}
      <div class="carousel w-full">
        <div id="slide1" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/clouds/big-preview.png" id="environment/clouds/big" class="w-full" on:click={checkAssetClicked} alt="clouds">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide2" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/clouds/long-preview.png" id="environment/clouds/long" class="w-full" on:click={checkAssetClicked} alt="clouds">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide3" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/clouds/triangle-preview.png" id="environment/clouds/triangle" class="w-full" on:click={checkAssetClicked} alt="clouds">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" class="btn btn-circle">❮</a>
            <a href="#slide4" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
      {/if}
      <!-- /Clouds -->


      <!-- Ground -->
      {#if currentCatTab === 'ground'}
      <div class="carousel w-full">
        <div id="slide1" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/ground-texture/sand.jpg" id="sand.jpg" class="w-full" on:click={addGround} alt="ground">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide2" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/ground-texture/concrete.jpg" id="concrete.jpg" class="w-full" on:click={addGround} alt="ground">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide3" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/ground-texture/rocks.jpg" id="rocks.jpg" class="w-full" on:click={addGround} alt="ground">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" class="btn btn-circle">❮</a>
            <a href="#slide4" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide4" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/ground-texture/forest.jpg" id="forest.jpg" class="w-full" on:click={addGround} alt="ground">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" class="btn btn-circle">❮</a>
            <a href="#slide5" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide5" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/ground-texture/meadow.png" id="meadow.png" class="w-full" on:click={addGround} alt="ground">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide6" class="btn btn-circle">❯</a>
          </div>
        </div>

        <div id="slide6" class="carousel-item relative w-full cursor-pointer asset_slide">
          <img src="/3D/verse/environment/ground-texture/grass.png" id="grass.png" class="w-full" on:click={addGround} alt="ground">
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide5" class="btn btn-circle">❮</a>
            <a href="#slide1" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
      {/if}
      <!-- /Ground -->


      {/if}
    </ul>
  </div>
</div>


<style>
  .editor_btns_container {
    max-width: 200px;
  }

  .scene_container {
    height: 600px;
  }

  .hero_container {
    min-height: 80vh;
    padding: 50px 0;
  }

  .asset_slide img {
    max-height: 350px;
  }
</style>
