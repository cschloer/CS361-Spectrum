

// Imports:
import System.IO;

var startButton : Texture2D;
var exitButton : Texture2D;
var levelNum : int;
var levelName: String;

function Start () {
	startButton = Resources.Load("Textures/NextLevelButton", Texture2D);
	exitButton = Resources.Load("Textures/ExitButton", Texture2D);
	var stream = new StreamReader(Application.dataPath +"/Configuration/data.conf");
	var lev = stream.ReadLine();
	levelNum = parseInt(lev.Split(":"[0])[1]);
	if(levelNum < 3){
		levelName = "LevelTutorial"+(levelNum+1);
	}else{
		levelName = "Level"+(levelNum-2);
	}
	lev = "currentLevel:"+(levelNum+1);
	lev = String.Concat(lev,stream.ReadToEnd());
	stream.Close();
	var overwrite = new StreamWriter(Application.dataPath +"/Configuration/data.conf");
	overwrite.Write(lev);
	overwrite.Close();
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
}