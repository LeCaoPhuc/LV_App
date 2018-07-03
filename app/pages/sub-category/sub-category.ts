import { SubCategoryModel } from "./sub-category.model";
import {Utils } from "../../shared/tools";
var app = require("application");
var page;
var categoryInfo;
var subCategoryModel ;
// Utils.transparentModalIOS();
export function onNavigatingTo(args){
    console.log("onShownModally");
    page = args.object;
    page.getViewById("actionBar").visibility = "visible";
    page.getViewById("listView").visibility = "visible";
    categoryInfo = args.context;
    if (app.ios) {
        console.log("aaaaaa");
        page.getViewById("listView").ios.separatorStyle = UITableViewCellSeparatorStyle.UITableViewCellSeparatorStyleNone;
    }
    else {
        //Code load for android here
    }
    subCategoryModel = new SubCategoryModel(args.object,categoryInfo);
    args.object.bindingContext = subCategoryModel;
}
export function onLoadedListView(args){
     args.object.ios.separatorStyle = UITableViewCellSeparatorStyle.UITableViewCellSeparatorStyleNone;
     args.object.ios.showsVerticalScrollIndicator = false
}
export function onLoaded(args){
    console.log("categoryInfo");
    args.object.bindingContext = subCategoryModel
    page.getViewById("actionBar").notify({
        eventName: "actionBarTitleNotify",
        object: this,
        eventData: categoryInfo.categoryName
    });
}