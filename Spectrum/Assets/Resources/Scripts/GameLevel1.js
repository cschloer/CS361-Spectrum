

public class GameLevel1 extends GameManager {


function levelInit(){
  roomCreate(-10,-10,0,"Plain1End.txt");
  roomCreate(-10, 10,0,"Plain2Cross.txt");
  roomCreate(-30, 10,0,"Hole2Tri.txt");
  roomCreate(-30,-10,0,"Hole2End.txt");
  roomCreate(-30, 30,2,"Walls1End.txt");
  roomCreate( 10, 10,1,"Hole3Tri.txt");
  roomCreate( 10,-10,0,"Plain2End.txt");
  roomCreate( 30, 10,3,"Plain1End.txt");
  roomCreate(-10, 30,2,"Plain1End.txt");
  addDevice(-4,40,"mSpawn", 3, 8);
  addDevice( 4,40,"mSpawn", 3, 1);
  addDevice(-14,38,"mSpawn", 4, 7);
  addDevice(20,5,"mSpawn", 4, 3);
  addDevice(-25,41,"mSpawn", 4, 9);
  //addDevice(1,-13,"mSpawn", 4, 5);//first one
  addDevice(-21, 25, "mSpawn", 4, 3);
  addDevice(46, 20,"mSpawn", 4, 6); //boss room
  addDevice(19, 17,"mSpawn", 4, 5);
  addDevice(30,19.5,"barrier", 0, 7);
  addDevice(-0.5,16,"barrier", 3, 1);
  addCake(-0.5,15);
  addCake(-0.5,0);
  addCake(-0.5,25);
  addCake(-22,16);
  addCake(-20.5,4.5);
  addCake(25,22);
  addCake(-16,42);
  addCake(8,48);
  charSpawner = addDevice(-0.5,-5,"aSpawn",0,0);
  bossSpawner = addDevice(40,21,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  currentLevel=4;
  
  //addMonster(character.model.transform.position.x + 2 ,character.model.transform.position.y+2,character,9);

  
}

function addBoss(x : float, y :float, c : Character){
	addBossTentacle(x,y,c);
}

function OnGUI(){
	super.OnGUI();
}
function Update(){
	super.Update();
	var cams : Array = Camera.allCameras;
	//print(cams.length);
	for(var cam : Camera in cams){
		cam.transform.position.x = character.model.transform.position.x;
		cam.transform.position.y = character.model.transform.position.y;
		if (cam != Camera.main) cam.transform.position.z = -20;
		}
}

}