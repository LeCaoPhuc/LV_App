import "./bundle-config";
import * as app from 'application';
import * as platform from "platform";
import * as utils from "utils/utils";
import { Config, } from './shared/env-config';
import { Utils } from './shared/tools';
import statusBar = require("nativescript-status-bar");
let localStorage = require("nativescript-localstorage");
import { ShareDataService, ParseService } from "./shared/tools";
import { EventData, Observable } from "data/observable";


if(app.android) {
}
else {
	var iqKeyboard: IQKeyboardManager;
	iqKeyboard = IQKeyboardManager.sharedManager();
	iqKeyboard.enable = true;
	iqKeyboard.enableAutoToolbar = true;
	iqKeyboard.toolbarDoneBarButtonItemText = 'Done';
	iqKeyboard.keyboardDistanceFromTextField = 30;
	iqKeyboard.shouldShowTextFieldPlaceholder = false;
	iqKeyboard.shouldResignOnTouchOutside = true;
}

Utils.fixCrashModalAndroid();
ParseService.init(); //setup Parse service
var _moduleName;
if (localStorage.getItem('isLogged')) {
	_moduleName = 'pages/home-page/home-page';
}
else {
	_moduleName = 'pages/user/user';
}
app.start({ moduleName: _moduleName});


