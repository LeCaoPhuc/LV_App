import { SplashScreenModel } from "./splash-screen.model";
import { Utils } from "../../shared/tools";
import { isEnabled, enableLocationRequest } from "nativescript-geolocation";
import * as colorModule from "tns-core-modules/color";
var Color = colorModule.Color;
var app = require("application");
import { Config } from '../../shared/env-config';
import * as Connectivity from "connectivity";
var localStorage = require("nativescript-localstorage");
var dialogs = require("ui/dialogs");
declare var UIApplication;
var firstLoading = true;
var firstDisplayDialog = true;
var isConfirmSetting = false;
export function onNavigatedTo(args) {
    var page = args.object;
    page.bindingContext = new SplashScreenModel();
    page.actionBarHidden = true;
    // if (!isEnabled()) {
    //     enableLocationRequest()
    //     .then(()=>{
    //         console.log("Allow lcoation");
    //     })
    //     .catch(()=>{
    //         console.log("Not Allow lcoation");
    //     })
    // }
    var processBar = args.object.getViewById("processBar");
    console.log("onNavigatedTo");
    console.log(processBar.id);
    if(!checkInternet()){
       showDialogNoInternet(processBar);
    }
    else{
        setUpResumeEvent(processBar);
        showDialogSetting(processBar);
    }
}
export function onLoaded(args) {
    console.log("onLoaded");
    // setUpResumeEvent(processBar);
    
}
function setUpResumeEvent(processBar){
    if(app.ios){
        app.on(app.resumeEvent, function () {
            if (isConfirmSetting && firstLoading) {
                firstLoading = false;
                if (!CLLocationManager.locationServicesEnabled()) {
                    runProcessBar(processBar);
                }
                else {
                    enableLocationRequest()
                    .then(() => {
                        runProcessBar(processBar);
                    })
                    .catch((err) => {
                        runProcessBar(processBar);
                    })
                }
            }
        })
    }
    else{
        app.on(app.resumeEvent, function () {
            if (isConfirmSetting && firstLoading) {
                var isEnabledGPS = app.android.context.getSystemService(android.content.Context.LOCATION_SERVICE).isProviderEnabled(android.location.LocationManager.GPS_PROVIDER);
                firstLoading = false;
                if (!isEnabledGPS) {
                    runProcessBar(processBar);
                }
                else {
                    console.log("else resume Event");
                    enableLocationRequest()
                        .then(() => {
                            runProcessBar(processBar);
                        })
                        .catch((err) => {
                            runProcessBar(processBar);
                        })
                }
            }
        })
    }
}
function checkInternet(){
    if (Connectivity.getConnectionType() == Connectivity.connectionType.none) {
        return false;
    }
    return true;
}
function showDialogNoInternet(processBar){
    dialogs.alert({
        title: "Không thể kết nối",
        message: Config.ERROR_MESSAGE.NO_INTERNET_CONNECTION,
        okButtonText: "OK"
    }).then(function() {
        if(!checkInternet()){
            showDialogNoInternet(processBar);
        }
        else{
            setUpResumeEvent(processBar);
            showDialogSetting(processBar);
        }   
    });
}

function showDialogSetting(processBar){
    if (app.ios) {
        if (!CLLocationManager.locationServicesEnabled()) {
            if (firstDisplayDialog) {
                firstDisplayDialog = false;
                dialogs.confirm({
                    message: "Turn On Location Services to \n Allow 'Scan And Go' to \n Determine Your Location ",
                    okButtonText: "Cancel",
                    cancelButtonText: "Settings",
                }).then(function (result) {
                    if (!result) {
                        isConfirmSetting = true;
                        var url = "App-Prefs:root=Privacy&path=LOCATION"
                        UIApplication.sharedApplication.openURL(NSURL.URLWithString(url));
                    }
                    else {
                        runProcessBar(processBar);
                    }
                });
            }
        }
        else {
            console.log("else showDialog setting");
            enableLocationRequest()
            .then(() => {
                runProcessBar(processBar);
            })
            .catch((err) => {
                runProcessBar(processBar);
            })
        }
    }
    else {
        var isEnabledGPS = app.android.context.getSystemService(android.content.Context.LOCATION_SERVICE).isProviderEnabled(android.location.LocationManager.GPS_PROVIDER);
        if (!isEnabledGPS) {
            if (firstDisplayDialog) {
                firstDisplayDialog = false;
                dialogs.confirm({
                    message: "\t\t\t\t\tTurn On Location Services to \n \t\t\t\t\t\t\t\t\tAllow Scan And Go to \n \t\t\t\t\t\t\tDetermine Your Location",
                    okButtonText: "Cancel",
                    cancelButtonText: "Settings",
                }).then(function (result) {
                    if (!result) {
                        setTimeout(function () {
                            var intent = new android.content.Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                            app.android.context.startActivity(intent);
                            isConfirmSetting = true;
                        }, 500)
                    }
                    else {
                        runProcessBar(processBar);
                    }
                });
            }
        }
        else {
            enableLocationRequest()
                .then(() => {
                    runProcessBar(processBar);
                })
                .catch((err) => {
                    runProcessBar(processBar);
                })
        }
        console.log("android");
    }
}

export function test(args) {
}
function runProcessBar(processBar) {
    var timer = setInterval(() => {
        processBar.value += 10;
        if (processBar.value >= processBar.maxValue) {
            clearInterval(timer);
            Utils.navigate('pages/user/user', true);
        }
    }, 10);
}
export function onProcessBarLoaded(args) {
    var processBar = args.object;
    if (app.android) {
        processBar.android.setScaleY(1);
    }
    // var timer = setInterval(() => {
    //     processBar.value += 10;
    //     if(processBar.value >= processBar.maxValue){
    //         if(localStorage.getItem('isLogged')){
    //               Utils.navigate('pages/user/user', true);
    //               clearInterval(timer);
    //         }else{
    //              Utils.navigate("pages/on-board/on-board");
    //              clearInterval(timer);
    //         }
    //         console.log("Complete");
    //     }
    // }, 10);
}
