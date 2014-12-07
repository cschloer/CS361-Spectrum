﻿#pragma strict

var startButton : Texture2D;
var exitButton : Texture2D;
var levelButton : Texture2D;
var clearButton : Texture2D;
var levelName : String;
var levelNum : int;

function Start () {
	startButton = Resources.Load("Textures/StartButton", Texture2D);
	exitButton = Resources.Load("Textures/ExitButton", Texture2D);
	levelButton = Resources.Load("Textures/levelEditor_Start", Texture2D);
	clearButton = Resources.Load("Textures/ResetButton", Texture2D);
	var stream = new StreamReader(Application.dataPath +"/Configuration/data.conf");
	var lev = stream.ReadLine();
	levelNum = parseInt(lev.Split(":"[0])[1]);
	if(levelNum < 3){
		levelName = "LevelTutorial"+(levelNum);
	}else{
		levelName = "Level"+(levelNum-3);
	}
}

function Update () {

}

function OnGUI() {
	GUI.depth = 3;
	if (GUI.Button (Rect((Screen.width/10)*1, (Screen.height/7)*5, Screen.width/2.5, Screen.height/6), startButton)) {
        Application.LoadLevel(levelName);
    }
    
    if (GUI.Button (Rect((Screen.width/9)*5, (Screen.height/7)*5, Screen.width/3, Screen.height/6), exitButton)) {
        Application.Quit();
    }
    
    if (GUI.Button (Rect((Screen.width/10)*9, (Screen.height/10)*9, Screen.width/10, Screen.height/8), levelButton)) {
        Application.LoadLevel("LevelEditor");
    }
    if (GUI.Button (Rect((Screen.width/10)*9, (Screen.height/30), Screen.width/10, Screen.height/8), clearButton)) {
        var overwrite = new StreamWriter(Application.dataPath +"/Configuration/data.conf");
		overwrite.Write("currentLevel:-1");
		overwrite.Close();
    }
}