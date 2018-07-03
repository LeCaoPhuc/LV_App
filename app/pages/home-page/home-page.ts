import * as colorModule from "tns-core-modules/color";
import { Observable, EventData } from 'data/observable';
import * as ImageModule from "tns-core-modules/ui/image";
import { Utils, DisplayActionBar, ParseService } from "../../shared/tools";
import { HomePageViewModel } from "./home-page.model";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import listViewModule = require("nativescript-telerik-ui/listview");
import localStorage = require("nativescript-localstorage");
var searchBarModule = require('ui/search-bar');
var frame = require('ui/frame');
var app = require("application");
var searchBar = new searchBarModule.SearchBar();
var frames = require("ui/frame");
declare var androidApp;
declare var android;
var widthFrame;
var homepageViewModel : any ;
export function onNavigatingTo(args) {
    var page = args.object;
    if (!ParseService.currentUser()) {
        localStorage.setItem('isLogged', false);
        Utils.toastAlert('Đăng nhập hết hạn');
        setTimeout(function () {
            Utils.navigate('pages/user/user', true);
        }, 1);
    }
    Utils.hideLoadingIndicator();
    page.getViewById("isHome").visibility = "visible";
    page.getViewById("listView").visibility = "visible";
    if (app.ios) {
        page.getViewById("listView").ios.separatorStyle = UITableViewCellSeparatorStyle.UITableViewCellSeparatorStyleNone;
    }
    else {
        //Code load for android here
    }
    if (ParseService.currentUser()) {
        console.log("onLoaded");
        homepageViewModel = new HomePageViewModel(args.object);
        args.object.bindingContext = homepageViewModel;
    }
}

export function onLoadedListView(args) {
    args.object.ios.separatorStyle = UITableViewCellSeparatorStyle.UITableViewCellSeparatorStyleNone;
}

export function onLoaded(args) {
     if(app.android && args.object.getViewById("searchBar")) {
        console.log("android");
        args.object.getViewById("searchBar").android.clearFocus();
    }
    args.object.bindingContext = homepageViewModel;
    // if (ParseService.currentUser()) {
    //     console.log("onLoaded");
    //     args.object.bindingContext = new HomePageViewModel(args.object);
    // }
}


