// CAGE
// CSCI 361 Prototype

// tileWallModel
// Wall Tile, blocks movement.

var posX : int;
var posY : int;
var rot : int;
var owner : Tile;
var tex : String;
var nW : boolean;
var eW : boolean;
var sW : boolean;
var wW : boolean;
var nwW :boolean;
var swW : boolean;
var seW : boolean;
var neW : boolean;
var tiles : Array;
var loading : boolean;
var countdown : int;

function init(own : Tile, tiles: Array) {
	owner = own;									// Set up a pointer to the marble object containing this model.
	this.tiles = tiles;
	countdown = 10;
	transform.parent = owner.transform;				// Set the model's parent to the gem (this object).
	transform.localPosition = Vector3(0,0,0);		// Center the model on the parent.
	name = "Tile Wall Model";						// Name the object.
	rot = 0;
	tileQuery(tiles);
	tex = "Textures/Wall_"+getTexture();
	renderer.material.mainTexture = Resources.Load(tex, Texture2D);						// Set the texture.  Must be in Resources folder.
	transform.localEulerAngles.z = 90*rot;
	renderer.material.color = Color(1,1,1);												// Set the color (easy way to tint things).
	renderer.material.shader = Shader.Find ("Transparent/Diffuse");						// Tell the renderer that our textures have transparency. 
	//renderer.sortingLayerID = 2;														// Set the Unit to the tile layer.
	//renderer.sortingOrder = 2;
	transform.localScale += Vector3(0.3,0.3,0);
	gameObject.layer = 1;
}

function Update(){
	loading = false;
	while(countdown > 0){
		countdown--;
		loading = true;
	}
	if(!loading){
		tileQuery(tiles);
		tex = "Textures/Wall_"+getTexture();
		renderer.material.mainTexture = Resources.Load(tex, Texture2D);						// Set the texture.  Must be in Resources folder.
		transform.localEulerAngles.z = 90*rot;
	}
}

function tileQuery(tiles: Array){
	posX = transform.position.x;
	posY = transform.position.y;
	nW = checkPos(tiles, posX, posY+1);
	eW = checkPos(tiles, posX+1, posY);
	sW = checkPos(tiles, posX, posY-1);
	wW = checkPos(tiles, posX-1, posY);
	nwW = checkPos(tiles, posX-1, posY+1);
	swW = checkPos(tiles, posX-1, posY-1);
	neW = checkPos(tiles, posX+1, posY+1);
	seW = checkPos(tiles, posX+1, posY-1);
}

function checkPos(tiles: Array, xCh : int, yCh : int){
	var x : int = arrayIndex(xCh);
	var y : int = arrayIndex(yCh);
	
	if(tiles.length <= x){
		return false;
	}
	else if(tiles[x] == null){
		return false;
	}
	else if(tiles[x].length <= y){
		return false;
	}
	else if(tiles[x][y] == null){
		return false;
	}
	else if(tiles[x][y].type == "Wall"){
		return true;
	}
	else {
		return false;
	}
}

function arrayIndex(n : int){
	if(n <= 0) return -n * 2;
	else return n*2-1;
}

function getTexture(){
	if( nW && eW && sW && wW){
		if( nwW && swW && seW && neW){
			rot = 0;
			return 4;
		} else if( nwW && swW && seW && !neW){
			rot = 1;
			return 14;
		} else if( nwW && swW && !seW && neW){
			rot = 2;
			return 14;
		} else if( nwW && swW && !seW && !neW){
			rot = 3;
			return 11;
		} else if( nwW && !swW && seW && neW){
			rot = 3;
			return 14;
		} else if( nwW && !swW && seW && !neW){
			rot = 1;
			return 13;
		} else if( nwW && !swW && !seW && neW){
			rot = 2;
			return 11;
		} else if( nwW && !swW && !seW && !neW){
			rot = 3;
			return 12;
		} else if( !nwW && swW && seW && neW){
			rot = 0;
			return 14;
		} else if( !nwW && swW && seW && !neW){
			rot = 0;
			return 11;
		} else if( !nwW && swW && !seW && neW){
			rot = 0;
			return 13;
		} else if( !nwW && swW && !seW && !neW){
			rot = 2;
			return 12;
		} else if( !nwW && !swW && seW && neW){
			rot = 1;
			return 11;
		} else if( !nwW && !swW && seW && !neW){
			rot = 1;
			return 12;
		} else if( !nwW && !swW && !seW && neW){
			rot = 0;
			return 12;
		} else{
			rot = 0;
			return 8;
		}
	} else if( nW && eW && sW && !wW){
		if(seW && neW){
			rot = 0;
			return 5;
		} else if( seW && !neW){
			rot = 3;
			return 9;
		} else if(!seW && neW){
			rot = 3;
			return 10;
		} else{
			rot = 3;
			return 3;
		}
	}else if( nW && eW && !sW && wW){
		if(nwW && neW){
			rot = 1;
			return 5;
		} else if( nwW && !neW){
			rot = 0;
			return 10;
		} else if(!nwW && neW){
			rot = 0;
			return 9;
		} else{
			rot = 0;
			return 3;
		}
	}else if( nW && eW && !sW && !wW){
		owner.box.size.x = 1;
		owner.box.size.y = 1;
		if( neW ){
			rot = 0;
			return 6;
		} else{
			rot = 0;
			return 2;
		}
	}else if( nW && !eW && sW && wW){
		if(swW && nwW){
			rot = 2;
			return 5;
		} else if( swW && !nwW){
			rot = 1;
			return 10;
		} else if(!swW && nwW){
			rot = 1;
			return 9;
		} else{
			rot = 1;
			return 3;
		}
	}else if( nW && !eW && sW && !wW){
		rot = 0;
		owner.box.size.y = 1;
		return 1;
	}else if( nW && !eW && !sW && wW){
		rot = 1;
		owner.box.size.x = 1;
		owner.box.size.y = 1;
		return 2;
	}else if( nW && !eW && !sW && !wW){
		if( nwW ){
			rot = 1;
			return 6;
		} else{
			rot = 1;
			return 7;
		}
	}else if( !nW && eW && sW && wW){
		if(swW && seW){
			rot = 3;
			return 5;
		} else if( swW && !seW){
			rot = 2;
			return 9;
		} else if(!swW && seW){
			rot = 2;
			return 10;
		} else{
			rot = 2;
			return 3;
		}
	}else if( !nW && eW && sW && !wW){
		owner.box.size.x = 1;
		owner.box.size.y = 1;
		if( seW ){
			rot = 3;
			return 6;
		} else{
			rot = 3;
			return 2;
		}
	}else if( !nW && eW && !sW && wW){
		rot = 1;
		owner.box.size.x = 1;
		return 1;
	}else if( !nW && eW && !sW && !wW){
		rot = 0;
		return 7;
	}else if( !nW && !eW && sW && wW){
		owner.box.size.x = 1;
		owner.box.size.y = 1;
		if( swW ){
			rot = 2;
			return 6;
		} else{
			rot = 2;
			return 2;
		}
	}else if( !nW && !eW && sW && !wW){
		rot = 3;
		return 7;
	}else if( !nW && !eW && !sW && wW){
		rot = 2;
		return 7;
	}else {
		rot = 0;
		return 4;
	}
}


/*function OnDrawGizmos () {
		// Draw a yellow cube at the transforms position
		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube (transform.position, owner.modelObject.GetComponent(BoxCollider).size);
}*/