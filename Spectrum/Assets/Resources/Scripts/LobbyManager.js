public class LobbyManager extends GameManager {

function Start(){
	super.Start();
	musicSound.clip = Resources.Load("Sounds/musicPortal");
	musicSound.Play();
}



function levelInit(){

	var stream = new StreamReader(Application.dataPath +"/Configuration/data.conf");
	var lev = stream.ReadLine();
	currentLevel = parseInt(lev.Split(":"[0])[1]);
  	roomCreate(-6,-6,3,"portalRoom.txt");
  	stream.Close();
 // addDevice(-4,40,"mSpawn", 3, 8);
  //addDevice( 4,40,"mSpawn", 3, 1);
  //addDevice(-14,38,"mSpawn", 4, 7);
  //addDevice(20,5,"mSpawn", 4, 3);
  //addDevice(-25,41,"mSpawn", 4, 9);
  charSpawner = addDevice(-0.5,-5,"aSpawn",0,0);
  charSpawner.modelObject.GetComponent("SpawnPointModel").spawn();
  if (currentLevel < 1) addDevice(-3.5,-3,"barrier", 3, 10);
  if (currentLevel < 2) addDevice(1.5,-3,"barrier", 3, 10);
  if (currentLevel < 3) addDevice(6.5,-3,"barrier", 3, 10);
  if (currentLevel < 4) addDevice(11.5,5,"barrier", 3, 10);
  addDevice (-4, 7, "portal", 1, 0);
  addDevice (-1, 7, "portal", 2, 0);
  addDevice (4, 7, "portal", 3, 0);
  addDevice (-4, 11, "portal", 4, 0);


  //addMonster(character.model.transform.position.x + 2 ,character.model.transform.position.y+2,character,9);

  
}



function OnGUI(){
	super.OnGUI();
	GUI.Label(Rect(270, 60, 200, 30), "Level " + currentLevel);

}

function Update(){
	//super.Update();
	var cams : Array = Camera.allCameras;
	//print(cams.length);
	for(var cam : Camera in cams){
		cam.transform.position.x = character.model.transform.position.x;
		cam.transform.position.y = character.model.transform.position.y;
		if (cam != Camera.main) cam.transform.position.z = -20;
		}
		
	if (Input.GetKeyUp(KeyCode.Escape)){
		if(!paused){
			Time.timeScale = 0;
			paused = !paused;
		}
		else{
			Time.timeScale = 1;
			paused = !paused;
		}
	}
}

}