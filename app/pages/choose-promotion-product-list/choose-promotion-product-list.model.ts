import { Observable, fromObject } from "data/observable";
import { httpRequest, Utils, DisplayActionBar, Pagination, ManagementProduct, ShareDataService } from "../../shared/tools";
import { Product, Shelf, DepartmentStore, Mode, ManageDepartmentList, typeOfListProduct } from "../../shared/tools"
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import { SliderControl, sliderOfView } from "../../shared/tools";
import { MockDataProduct } from "../product-list/mock-data-product";
import { Config } from '../../shared/env-config';
import * as platformModule from "tns-core-modules/platform";
import dialogs = require("ui/dialogs");
import localStorage = require("nativescript-localstorage");
import app = require('application');
import * as utils from "utils/utils";
var cache = require("nativescript-cache");
var enums = require("ui/enums");
var frames = require("ui/frame");
var gestures = require("ui/gestures");

export class ChoosePromotionProductModel extends Observable {
    private actionBarTitle;
    private page: any;
    list = [];
    private pagination;
    private managementProduct;
    private lastPage = false;
    private isGestureProduct: boolean;
    private isEmptyProductList : boolean = false;
    private cacheOtherDepartmentData ;
    private relatedProductId ;
    private warehouseId;
    private isFirst;
    constructor(page,productId,isFirst) {
        super();
        var self = this;
        this.page = page;
        this.isFirst= isFirst;
        this.warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
        this.relatedProductId = productId;
        this.initActionBar();
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.perPage = 9;
        this.pagination.getData = function(){
            var url  = `scanngo_v1/warehouse/${ self.warehouseId }/product/${ self.relatedProductId }/related?page=${ self.pagination.page }&per_page=${ self.pagination.perPage }`;
            console.log(url);
            return httpRequest.get(url,localStorage.getItem("accessToken"));
        }
        this.managementProduct = new ManagementProduct(this.page,typeOfListProduct.CHOOSE_PROMOTION_LIST, this.pagination);
        ShareDataService.setData(typeOfListProduct.CHOOSE_PROMOTION_LIST, this.managementProduct);
        ShareDataService.setData("cacheOtherDepartmentData",{});
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        Utils.showLoadingIndicator();
        this.initProductList();
    }
    initActionBar(){
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.CHOOSE_PROMOTION_PRODUCT_LIST
        });
    }
    initProductList(){
        var self =this;
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        ShareDataService.setData("cacheOtherDepartmentData",{});
        this.page.getViewById("departmentSlider").notify({
            eventName: "managementProductIsCreate",
            object: self,
            eventData: typeOfListProduct.CHOOSE_PROMOTION_LIST
        })
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        this.managementProduct.initProductList()
        .then((response)=>{
            if(response.productArr.length==0){
                self.isEmptyProductList = true;
                self.page.getViewById("cart").visibility = 'collapse';
                self.notifyPropertyChange("isEmptyProductList",self.isEmptyProductList);
            }
            ShareDataService.setData("lastPage", response.last );
            self.lastPage = ShareDataService.getData("lastPage");
            setTimeout(function(){
                self.page.getViewById("departmentSlider").notify({
                    eventName: currentProductList,
                    object: self,
                    eventData: response
                })
                Utils.hideLoadingIndicator();
            },200)
        })
        .catch((err)=>{
            Utils.hideLoadingIndicator(); 
            Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
            console.log("Error -initProductList- choose-promotion-product-list.model.ts - constructor: ", err);
        })
    }
    onPanSliderView(args) {
        var self = this;
        if(self.isEmptyProductList){
            return;
        }
        this.managementProduct.onPanSlider(args, self.lastPage)
            .then((response) => {
                ShareDataService.setData("lastPage", response.last);
                self.lastPage = ShareDataService.getData("lastPage");
                var currentProductList = self.managementProduct.getProductListOfCurrentSlide();
                // Utils.showLoadingIndicator();
                // setTimeout(function(){
                self.page.getViewById("departmentSlider").notify({
                    eventName: currentProductList,
                    object: self,
                    eventData: response
                })
                Utils.hideLoadingIndicator();
                // },200)
            })
            .catch((err) => {
                Utils.hideLoadingIndicator(); 
                Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
                console.log("Error -onPanSlider - choose-promotion-product-list.model.ts - constructor: ", err);
            })
    }

    onTapProductItem(args) {
        console.log("onTapProductItem");
    }

    goBack(args) {
         this.isFirst.value = true;
        // Utils.navigate("pages/product-list/product-list",false);
        Utils.goBack();
    }

}