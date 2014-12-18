
// Imports:
import System.IO;

var startButton : Texture2D;
var exitButton : Texture2D;
var levelNum : int;
var levelName: String;
var guif : Font;
var SpectrumSkin : GUISkin;


function Start () {
	startButton = Resources.Load("Textures/NextLevelButton", Texture2D);
	exitButton = Resources.Load("Textures/ExitButton", Texture2D);
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
	GUI.depth = 3;
	
    
    if (GUI.Button (Rect((Screen.width/9)*5, (Screen.height/7)*5, Screen.width/3, Screen.height/6), exitButton)) {
        Application.LoadLevel("Start");
    }
    
    GUI.Box (Rect((Screen.width/9)*5, (Screen.height/7)*5, Screen.width/3, Screen.height/6), "Main Menu"); 

}