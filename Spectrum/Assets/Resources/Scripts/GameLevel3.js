

public class GameLevel3 extends GameManager {


function Start(){
	super.Start();
	musicSound.clip = Resources.Load("Sounds/rhysGameMusic");
	musicSound.Play();
}

function levelInit(){
  roomCreate(-10,-10,0,"Plain5Tri.txt");
  roomCreate(-30, -10,0,"Plain2Adj.txt"); // Monster Left
  roomCreate(-30, 10,0,"Plain2Opp.txt");  // Monster Left
  roomCreate(-30, 30,0,"Plain4Opp.txt");  // Monter Left
  roomCreate( 10,-10,3,"Hole2Adj.txt");   // Hole Right
  roomCreate( 10, 10,0,"Hole5Tri.txt");   // Hole Right
  roomCreate( 30, 10,3,"Plain2End.txt");   // Hole Right
  addCake(-0.5,15);
  addCake(-0.5,0);
  addCake(-1.5,40);
  addCake(-22,16);
  addCake(4.5,7.5);
  addCake(13,12);
  addCake(-17,28);
  addCake(8,48);
  charSpawner = addDevice(-0.5,-5,"aSpawn",0,0);
  bossSpawner = addDevice(-21, 40,"aSpawn",1,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  bossSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  currentLevel=6;
  levelNumber = 3;
}


function addBoss(x : float, y :float, c : Character){
	//todo: Rewire for new boss.
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