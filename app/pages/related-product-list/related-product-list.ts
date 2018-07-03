import { RelatedListProductModel } from "./related-product-list.model";
import { Observable, fromObject } from "data/observable";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList } from "../../shared/tools"
import { Utils,SliderControl } from "../../shared/tools";
import * as utils from "utils/utils";
import * as platformModule from "platform";
import { Color } from "color";
var app = require("application");
var localStorage = require("nativescript-localstorage");
var relatedProducListModel;
var frame = require('ui/frame');
var currentRelatedId ;
var isFirst = {
    value : true
}
export function onNavigatingTo(args){
    var page = args.object;
    var cartView = page.getViewById('cart');
    // var cartIcon = page.getViewById('cart-icon');
    var btnGroup = cartView.getChildById('btnGroup');
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    cartView.visibility = 'visible';
    // cartIcon.visibility = 'hidden';
    btnGroup.visibility = 'hidden';
    if(isFirst.value || args.object._navigationContext != currentRelatedId){
        isFirst.value = false;
        console.log("First");
        currentRelatedId = args.object._navigationContext;
        relatedProducListModel =  new RelatedListProductModel(args.object,args.object._navigationContext,isFirst);
        args.object.bindingContext = relatedProducListModel; 
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = relatedProducListModel;
        relatedProducListModel.initActionBar();
        relatedProducListModel.initProductList();
    }
}

export function onLoaded(args){
     if(isFirst.value || args.object._navigationContext != currentRelatedId){
        isFirst.value = false;
        console.log("First");
        currentRelatedId = args.object._navigationContext;
        relatedProducListModel =  new RelatedListProductModel(args.object,args.object._navigationContext,isFirst);
        args.object.bindingContext = relatedProducListModel; 
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = relatedProducListModel;
        relatedProducListModel.initActionBar();
        relatedProducListModel.initProductList();
    }

}
export function onTitleCreatingView(args) {
    if(app.ios) {
        var nativeView = (new MarqueeLabel()).initWithFrameDurationAndFadeLength(new CGRect(100, 0, 100, 50), 8.0, 10.0);
        args.object.page.getViewById("actionBar").on("actionBarTitleNotify", function(args) {
            nativeView.text = args.eventData + '        ';
        });
        nativeView.textColor = (new Color("white")).ios;
        nativeView.textAlignment = NSTextAlignment.Center;
        args.view = nativeView;
    }
    else {
        var nativeView = args.object;
        args.object.page.getViewById("actionBar").on("actionBarTitleNotify", function(data) {
            if(nativeView.android) {
                nativeView.android.setText(data.eventData);
                nativeView.android.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
                nativeView.android.setMarqueeRepeatLimit("marquee_forever");
                nativeView.android.setSingleLine(true);
                nativeView.android.setSelected(true);
            }
        });
    }
}
