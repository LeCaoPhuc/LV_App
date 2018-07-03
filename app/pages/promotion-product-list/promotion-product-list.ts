import {PromotionListProductModel} from "./promotion-product-list.model";
import { Observable, fromObject } from "data/observable";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList } from "../../shared/tools"
import { Utils,SliderControl } from "../../shared/tools";
import * as utils from "utils/utils";
import * as platformModule from "platform";
import { Color } from "color";
var app = require("application");
var localStorage = require("nativescript-localstorage");
var promotionProducListModel;
var frame = require('ui/frame');
var isFirst = {
    value : true,
};
export function onNavigatingTo(args){
    var page = args.object;
    var cartView = page.getViewById('cart');
    // var cartIcon = page.getViewById('cart-icon');
    var btnGroup = cartView.getChildById('btnGroup');
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    cartView.visibility = 'visible';
    // cartIcon.visibility = 'hidden';
    btnGroup.visibility = 'hidden';
    // promotionProducListModel =  new PromotionListProductModel(page,args.context);
    // page.bindingContext = promotionProducListModel; 
    if(isFirst.value || args.object._navigationContext == "promotion"){
        isFirst.value = false;
        console.log("First");
        promotionProducListModel =  new PromotionListProductModel(args.object,isFirst);
        args.object.bindingContext = promotionProducListModel; 
    }
    else{
        console.log("Second");
        args.object.bindingContext = promotionProducListModel;
        promotionProducListModel.initActionBar();
        promotionProducListModel.initProductList();
    }
}

export function onLoaded(args){
    if(isFirst.value || args.object._navigationContext == "promotion"){
        isFirst.value = false;
        console.log("First");
        promotionProducListModel =  new PromotionListProductModel(args.object,isFirst);
        args.object.bindingContext = promotionProducListModel; 
    }
    else{
        console.log("Second");
        args.object.bindingContext = promotionProducListModel;
        promotionProducListModel.initActionBar();
        promotionProducListModel.initProductList();

    }
}
export function onSearchTap(args) {
    var page = args.object.page;
    console.log("onSearchTap");
    Utils.showModal(page,"shared/components/search/search", function(action,keyword){
        if(action == "itemProductTap") {
            console.log("itemProductTap");
            Utils.showModal(page,"shared/components/product-details-modal/product-details-modal", function(action){
                
            }, false);
        }
        else{
            if(action =="submit"){
                    isFirst.value = true;
                    Utils.navigate("pages/search-product-list/search-product-list",false,keyword);
                }
                else{
                    console.log("Another action");
                }
        }
    }, true)
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
