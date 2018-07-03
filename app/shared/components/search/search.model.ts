import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";
import { DisplayActionBar, httpRequest, Utils, Product, ShareDataService,ParseService } from "../../tools";
import platformModule = require("platform");
import * as colorModule from "color";
var localStorage = require("nativescript-localstorage");
var Color = colorModule.Color;
import app = require("application");
import * as utils from "utils/utils";

export class SearchViewModel extends Observable {
    private textSearch: string;
    private closeCallback: Function;
    private displayActionBar = new DisplayActionBar(4);
    private _dataItems: ObservableArray<any>;
    private page : any;
    private screenWidth: any;
    private screenHeight: any;
    private relatedProductId ;
    private typeOfPageSearch ;
    private warehouseId;
    constructor(page,closeCallback,context) {
        super();
        this.closeCallback = closeCallback;
        this.relatedProductId = context.data;
        this.typeOfPageSearch = context.type;
        this.page = page;
        this.warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.screenHeight = platformModule.screen.mainScreen.heightDIPs- Utils.getSoftButtonHeight();
        this._dataItems = new ObservableArray<any>([]);
        var searchBar = this.page.getViewById("searchBar");
        searchBar.focus();
        if(app.android) {
            // utils.ad.getInputMethodManager().toggleSoftInput(searchBar.android, android.view.inputmethod.InputMethodManager.SHOW_FORCED);
        }
        if(app.ios) {
            this.page.getViewById("searchBar").ios.setBackgroundImageForBarPositionBarMetrics(new UIImage(),2,0);
            page.getViewById("searchBar").ios.backgroundColor = (new Color("#3F4050")).ios;
        }
        var self = this;
        page.getViewById("searchBar").on("textChange", function(args) {
            var keyword = args.object.text.trim();
            setTimeout(function() {
                if(args.object.text.trim() == keyword) {
                    if(keyword == "") {
                        self._dataItems = new ObservableArray<any>([]);
                        self.notifyPropertyChange("dataItems", self._dataItems);
                        return;
                    }
                    ParseService.cloud('searchSuggestion', {
                        keyword : keyword
                    })
                    .then((res : any)=>{
                        self._dataItems = new ObservableArray<any>([])
                        if(res && res.success && res.data && res.data.length > 0) {
                            for(var i =0 ; i < res.data.length; i++) {
                                self._dataItems.push({product : res.data[i]});
                            }
                        }
                        self.notifyPropertyChange("dataItems", self._dataItems);
                        Utils.hideLoadingIndicator();
                    })
                    .catch((err)=>{
                        Utils.hideLoadingIndicator();
                        console.log("Error - search.model.ts - constructor: ", err);
                    })
                }
            },500)
           
        });
        
    }

    onSubmit(args) {
        args.object.page.getViewById("searchBar").dismissSoftInput();
        var keyword = args.object.page.getViewById("searchBar").text.trim();
        var self =this;
        Utils.showLoadingIndicator();
        ParseService.cloud('searchSuggestion', {
            keyword : keyword
        })
        .then((res : any)=>{
            self._dataItems = new ObservableArray<any>([])
            if(res && res.success && res.data && res.data.length > 0) {
                self.closeCallback("submit",args.object.page.getViewById("searchBar").text);
                args.object.page.getViewById("searchBar").dismissSoftInput();
            }
            else {
                self._dataItems = new ObservableArray<any>([]);
                self.notifyPropertyChange("dataItems", self._dataItems);
                args.object.page.getViewById("searchBar").dismissSoftInput();
                self.notifyPropertyChange("dataItems", self._dataItems);
                Utils.hideLoadingIndicator();
            }
        })
        .catch(function (err) {
            Utils.hideLoadingIndicator();
            args.object.page.getViewById("searchBar").dismissSoftInput();
            Utils.toastAlert("Có lỗi khi tải dữ liệu");
            console.log("Error - search.model.ts - constructor: ", err);
        })   
    }

    onProductItemTap(args) {
        Utils.showLoadingIndicator();
        args.object.page.getViewById("searchBar").dismissSoftInput();
        ShareDataService.setData("currentItem", args.object.getSelectedItems()[0].product);
        this.closeCallback("itemProductTap", null,  args.object.getSelectedItems()[0].product.id);
    }
    onTapOutListSearch(args){
        console.log("onTapOutListSearch");
        args.object.page.getViewById("searchBar").dismissSoftInput();
        this.closeCallback("");
    }
    onItemLoading(args) {
        if(app.ios) {
            args.ios.backgroundView.backgroundColor = (new Color(0.1,0,0,0)).ios;
        }
    }

    get dataItems() {
        return this._dataItems;
    }
}
