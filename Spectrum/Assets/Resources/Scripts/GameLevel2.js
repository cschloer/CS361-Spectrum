﻿

public class GameLevel2 extends GameManager {


function levelInit(){
  roomCreate(-10,-10,0,"Plain4End.txt");
  roomCreate(-10, 10,0,"Plain4Cross.txt");
  roomCreate(-30, 10,2,"Hole4Tri2.txt");
  //roomCreate(-30,-10,0,"Hole2End.txt");
  roomCreate(-30, 30,2,"Walls1End.txt");
  roomCreate( 10, 10,0,"Hole4Tri.txt");
  //roomCreate( 10,-10,0,"Plain2End.txt");
  //roomCreate( 30, 10,3,"Plain1End.txt");
  roomCreate(-10, 30,2,"Plain4End.txt");
  addDevice(-4,25,"mSpawn", 3, 9); // magnet
  addDevice( 4,25,"mSpawn", 3, 8); // magnet
  addDevice(-4,30,"mSpawn", 4, 5); //ranged
  addDevice(-14,38,"mSpawn", 9, 7); // lots of buzz dudes
  addDevice(0,45,"mSpawn", 6, 0); // lots of buzz dudes
  //addDevice(20,5,"mSpawn", 4, 3);
 
  //addDevice(1,-13,"mSpawn", 4, 5);//first one
  addDevice(-21, 25, "mSpawn", 4, 3);
  addDevice(17, 24,"mSpawn", 3, 1); //shielded in hall
  addDevice(24, 11,"mSpawn", 1, 4); //single mosnter 4
  addDevice(13, 20,"mSpawn", 2, 10); // chargers near cake
  addDevice(30,19.5,"barrier", 0, 7);
  addDevice(-20.5,29.5,"barrier", 3, 7);
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
  currentLevel=5;
  changeColor();
}
/*
function addBoss(x : float, y :float, c : Character){
	addBossTentacle(x,y,c);
}
*/

function changeColor(){

	yield WaitForSeconds(.2);
	character.model.changeBlue();
}

function OnGUI(){
	super.OnGUI();
}


}