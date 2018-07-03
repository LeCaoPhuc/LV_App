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

export class WishListProductModel extends Observable {
    private actionBarTitle;
    private page: any;
    list = [];
    private pagination;
    private managementProduct;
    private lastPage = false;
    private isGestureProduct: boolean;
    private isEmptyProductList: boolean = false;
    private cacheOtherDepartmentData;
    private isFirst ;
    constructor(page,isFirst) {
        super();
        var self = this;
        this.page = page;
        this.isFirst = isFirst;
        this.initActionBar();
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.perPage = 9;
        this.pagination.getData = function () {
            var url = "scanngo_v1/wishlist?page=" + self.pagination.page + "&per_page=" + self.pagination.perPage;
            return httpRequest.get(url, localStorage.getItem("accessToken"));
        }
        this.managementProduct = new ManagementProduct(this.page, typeOfListProduct.WISH_LIST, this.pagination);
        ShareDataService.setData(typeOfListProduct.WISH_LIST, this.managementProduct);
        ShareDataService.setData("cacheOtherDepartmentData", {});
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        Utils.showLoadingIndicator();
        this.initProductList();
    }
    initActionBar(){
        this.page.getViewById("actionBar").notify({
            eventName: "actionBarTitleNotify",
            object: this,
            eventData: Config.TITLE.WISH_LIST
        });
    }
    initProductList(){
        var self = this;
        this.managementProduct.resetSliderControlForPage();
        this.managementProduct.initSliderControlForPage();
        var currentProductList = this.managementProduct.getProductListOfCurrentSlide();
        this.page.getViewById("departmentSlider").notify({
            eventName: "managementProductIsCreate",
            object: self,
            eventData: typeOfListProduct.WISH_LIST
        })
        this.page.on("notifyDeleteProductWishList", function () {
            self.cacheOtherDepartmentData = ShareDataService.getData("cacheOtherDepartmentData");
            var length =  Object.keys(self.cacheOtherDepartmentData).length;
            // rmove all page from position deleted wist list product
            for (var i = self.managementProduct.pagination.page; i <= length; i++) {
                delete self.cacheOtherDepartmentData[i];
            }
            ShareDataService.setData("cacheOtherDepartmentData",self.cacheOtherDepartmentData);
            self.managementProduct.initProductList()
            .then((response) => {
                 if (response.productArr.length == 0) {
                    self.isEmptyProductList = true;
                    self.page.getViewById("cart").visibility = 'collapsed';
                    self.notifyPropertyChange("isEmptyProductList", self.isEmptyProductList);
                }
                ShareDataService.setData("lastPage", response.last);
                self.lastPage = ShareDataService.getData("lastPage");
                var currentProductList = self.managementProduct.getProductListOfCurrentSlide();
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
                console.log("Error initProductList -notifyDeleteProductWishList - other-product-list.ts ", err);
            })
        });
        this.managementProduct.initProductList()
            .then((response) => {
                if (response.productArr.length == 0) {
                    self.isEmptyProductList = true;
                    self.page.getViewById("cart").visibility = 'collapsed';
                    self.notifyPropertyChange("isEmptyProductList", self.isEmptyProductList);
                }
                else {
                    self.page.getViewById("cart").visibility = 'visible';
                }
                ShareDataService.setData("lastPage", response.last);
                self.lastPage = ShareDataService.getData("lastPage");
                setTimeout(function () {
                    self.page.getViewById("departmentSlider").notify({
                        eventName: currentProductList,
                        object: self,
                        eventData: response
                    })
                    Utils.hideLoadingIndicator();
                }, 200)
            })
            .catch((err) => {
                Utils.hideLoadingIndicator();
                Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
                console.log("Error initProductList - other-product-list.ts ", err);
            })
    }
    onPanSliderView(args) {
        var self = this;
        if (self.isEmptyProductList) {
            return;
        }
        // Utils.showLoadingIndicator();
         self.lastPage = ShareDataService.getData("lastPage");
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
                console.log("Error onPanSliderView - other-product-list.model ",err);
            })
    }

    onTapProductItem(args) {
        console.log("onTapProductItem");
    }

    goBack() {
        this.isFirst.value = true;
        Utils.goBack();
    }

}