var app = require("application");
import { SearchRelatedProductListModel } from "./related-product-list-search-result.model";
import * as platformModule from "platform";
import { httpRequest} from "../../../shared/tools";
var productListModel: any;
import { Utils} from "../../../shared/tools";
import { SliderControl } from "../../../shared/tools";
import * as utils from "utils/utils";
import { Color } from "color";
var searchRelatedProductListModel : any;
var data ;
var isFirst = {
    value : true
}
Utils.turnOffAnimateParentModalIOS();
export function onNavigatingTo(args){
    var page = args.object;
    data = args.context
    page.getViewById("actionBar").visibility = "visible";
    // page.getViewById("isSubCategory").visibility = "visible";
    var cartView = page.getViewById('cart');
    var cartIcon = page.getViewById('cart-icon');
    cartView.translateY = platformModule.screen.mainScreen.heightDIPs - 95 - Utils.getSoftButtonHeight();
    cartView.visibility = 'visible';
    cartIcon.visibility = 'hidden';
    // productListModel = new ProductListModel(args.object, categoryInfo, Utils.getSoftButtonHeight());
    // args.object.bindingContext = productListModel;
    if(isFirst.value){
        isFirst.value = false;
        console.log("First");
        searchRelatedProductListModel = new SearchRelatedProductListModel(args.object, data, Utils.getSoftButtonHeight(),isFirst);
        args.object.bindingContext = searchRelatedProductListModel;
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = searchRelatedProductListModel;
        searchRelatedProductListModel.initActionBar();
        searchRelatedProductListModel.initProductList();
    }
}

export function onLoaded(args){  
    if(isFirst.value){
        isFirst.value = false;
        console.log("First");
        searchRelatedProductListModel = new SearchRelatedProductListModel(args.object, data, Utils.getSoftButtonHeight(),isFirst);
        args.object.bindingContext = searchRelatedProductListModel;
    }
    else{
        Utils.hideLoadingIndicator();
        console.log("Second");
        args.object.bindingContext = searchRelatedProductListModel;
        searchRelatedProductListModel.initActionBar();
        if(data.mode == 'one') {
            searchRelatedProductListModel.initProductListOneMode()
        }
        else {
            searchRelatedProductListModel.initProductList();
        }
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

