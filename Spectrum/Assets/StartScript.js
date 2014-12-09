#pragma strict

var startButton : Texture2D;
var exitButton : Texture2D;
var levelButton : Texture2D;
var clearButton : Texture2D;
var levelName : String;
var levelNum : int;

var guif : Font;
var SpectrumSkin : GUISkin;


var displayErase : boolean;

function Start () {
	startButton = Resources.Load("Textures/StartButton", Texture2D);
	exitButton = Resources.Load("Textures/ExitButton", Texture2D);
	levelButton = Resources.Load("Textures/levelEditor_Start", Texture2D);
	clearButton = Resources.Load("Textures/ResetButton", Texture2D);
	var stream = new StreamReader(Application.dataPath +"/Configuration/data.conf");
	var lev = stream.ReadLine();
	levelNum = parseInt(lev.Split(":"[0])[1]);
	if(levelNum < 1){
		levelName = "LevelTutorial1";
	}else{
		levelName = "Level" + levelNum;
	}
		guif = Resources.Load("GUI_Components/Arabolic", Font) as Font;
	SpectrumSkin = Resources.Load("GUI_Components/SpectrumSkin", GUISkin) as GUISkin;

}

function Update () {

}

function OnGUI() {

	GUI.backgroundColor = Color.white;
	GUI.skin.label.fontSize = 30;
	GUI.skin = SpectrumSkin;
	GUI.skin.font = guif;
	GUI.skin.box.fontSize = 30;


	
	GUI.depth = 3;
	if (GUI.Button (Rect((Screen.width/10)*1, (Screen.height/7)*5, Screen.width/2.5, Screen.height/6), startButton)) {
        Application.LoadLevel(levelName);
    }
    	GUI.Box (Rect((Screen.width/10)*1, (Screen.height/7)*5, Screen.width/2.5, Screen.height/6), "Start"); 

    if (GUI.Button (Rect((Screen.width/9)*5, (Screen.height/7)*5, Screen.width/3, Screen.height/6), exitButton)) {
        Application.Quit();
    }
    
     GUI.Box (Rect((Screen.width/9)*5, (Screen.height/7)*5, Screen.width/3, Screen.height/6), "Quit"); 

    if (GUI.Button (Rect((Screen.width/10)*9, (Screen.height/10)*9, Screen.width/10, Screen.height/8), levelButton)) {
        Application.LoadLevel("LevelEditor");
    }
    if (GUI.Button (Rect((Screen.width/10)*9, (Screen.height/30), Screen.width/10, Screen.height/8), clearButton)) {
        displayErase = true;
    }
    if(displayErase){
    	if(GUI.Button (Rect((Screen.width/10)*3, (Screen.height*.55), Screen.width/5, Screen.height/8), "Erase Data")){
    		var overwrite = new StreamWriter(Application.dataPath +"/Configuration/data.conf");
			overwrite.Write("currentLevel:-1");
			overwrite.Close();
			displayErase = false;
			levelNum = -1;
			levelName = "LevelTutorial1";

		}
		if(GUI.Button (Rect((Screen.width/10)*5.57, (Screen.height*.55), Screen.width/5, Screen.height/8), "Nevermind!")){
			displayErase = false;
		}
	}
}