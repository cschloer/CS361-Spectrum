public class LobbyManager extends GameManager {


function levelInit(){
  roomCreate(-3,-3,3,"portalRoom.txt");
  
 // addDevice(-4,40,"mSpawn", 3, 8);
  //addDevice( 4,40,"mSpawn", 3, 1);
  //addDevice(-14,38,"mSpawn", 4, 7);
  //addDevice(20,5,"mSpawn", 4, 3);
  //addDevice(-25,41,"mSpawn", 4, 9);
  charSpawner = addDevice(-0.5,-5,"aSpawn",0,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  
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