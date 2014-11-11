#pragma strict

var startButton : Texture2D;
var exitButton : Texture2D;
var levelButton : Texture2D;

function Start () {
	startButton = Resources.Load("Textures/StartButton", Texture2D);
	exitButton = Resources.Load("Textures/ExitButton", Texture2D);
	levelButton = Resources.Load("Textures/levelEditor_Start", Texture2D);
}

function Update () {

}

function OnGUI() {
	GUI.depth = 3;
	if (GUI.Button (Rect(Screen.width*.5, (Screen.height*.4), Screen.width/10, Screen.height/8), "GO!")) {
        Application.LoadLevel("Spectrum");
    }
    
    
}