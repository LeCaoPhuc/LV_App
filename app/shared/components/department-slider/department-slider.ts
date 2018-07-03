import { DepartmentSliderModel } from "./department-slider.model"
import { Utils, ShareDataService, SliderControl, typeOfProduct, httpRequest, typeOfListProduct, ManagementCategoryMap } from "../../tools";
import { Config } from "../../../shared/env-config";
import * as animationModule from "tns-core-modules/ui/animation";
var app = require("application");
var gestures = require("ui/gestures");
var page;
var departmentSliderModel
var localStorage = require("nativescript-localstorage");
export function onLoaded(args) {
    console.log("onLoaded DepartmentSliderModel");
    page = args.object.page;
    args.object.off("notifyThirdProductListBindingComplete");
    args.object.off("notifySecondProductListBindingComplete");
    args.object.off("notifyFirstProductListBindingComplete");
    departmentSliderModel = new DepartmentSliderModel(args.object);
    args.object.bindingContext = departmentSliderModel;
}
var checkFirstSlide = true;
var currentPageTemp = null;
export function onFirstPanSlider(args) {
    if (app.android) {
        if (SliderControl.calculateDegree(args.deltaX, args.deltaY).degreeOfUpperAngle <= 30) {
            var managementProduct = departmentSliderModel.managementProductList;
            var lastPage = ShareDataService.getData("lastPage");
            var managementCategoryMap = ManagementCategoryMap;
            var warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
            if (departmentSliderModel.typeOfPageManagement == typeOfListProduct.CATEGORY_LIST) {
                if (lastPage && args.deltaX < 0 && checkFirstSlide) {
                    checkFirstSlide = false;
                    console.log("/n /n /nDelta X : ", args.deltaX);
                    if (managementCategoryMap.current().last) {
                        managementProduct.pagination.page = managementCategoryMap.next().totalPage;
                    }
                    else {
                        managementCategoryMap.next();
                        managementProduct.pagination.page = 1;
                    }
                    initActionBar();
                }
                if (managementProduct.pagination.page == 1 && args.deltaX > 0 && checkFirstSlide) {
                    checkFirstSlide = false;

                    var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                    currentPageTemp = managementProduct.pagination.page;
                    if (managementCategoryMap.current().first) {
                        managementProduct.pagination.page = 1;
                    }
                    else {
                        managementProduct.pagination.page = managementCategoryMap.previous().totalPage;
                    }
                    initActionBar();
                }
                managementProduct.onPanSlider(args, lastPage, currentPageTemp)
                    .then((response) => {
                        currentPageTemp = null;
                        checkFirstSlide = true;
                        ShareDataService.setData("lastPage", response.last);
                        lastPage = ShareDataService.getData("lastPage");
                        var currentProductList = managementProduct.getProductListOfCurrentSlide();
                        page.getViewById("departmentSlider").notify({
                            eventName: currentProductList,
                            object: this,
                            eventData: response
                        })
                        Utils.hideLoadingIndicator();
                    })
                    .catch((err) => {
                        checkFirstSlide = true;
                        Utils.hideLoadingIndicator();
                        Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                        console.log("Error - product-list.model.ts - onPanSlider: ", err);
                    })
            }
            else {
                if (managementProduct) {
                    console.log("managementProduct productItem");
                    managementProduct.onPanSlider(args, lastPage)
                        .then((response) => {
                            var productArr = response.productArr;
                            ShareDataService.setData("lastPage", response.last);
                            lastPage = ShareDataService.getData("lastPage");
                            var currentProductList = managementProduct.getProductListOfCurrentSlide();
                            // Utils.showLoadingIndicator();
                            setTimeout(function () {
                                page.getViewById("departmentSlider").notify({
                                    eventName: currentProductList,
                                    object: this,
                                    eventData: response
                                })
                                Utils.hideLoadingIndicator();
                            }, 100)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                else {
                    console.log("managementProduct underfine product-item.ts");
                }
            }
        }
    }
    SliderControl.onPanProductImage(args, function () {
        var cache = ShareDataService.getData("cacheDepartmentData");
        var product = args.object.product;
            page.notify({
                eventName: "notifyAddProductToCart",
                object: this,
                eventData: {
                    product: departmentSliderModel.firstProductList[args.object.index[0]].productItems[args.object.index[1]],
                    quantity: ++departmentSliderModel.firstProductList[args.object.index[0]].productItems[args.object.index[1]].quantity
                }
            });
            departmentSliderModel.notifyPropertyChange("firstProductList", departmentSliderModel.firstProductList);
    });
}

export function onSecondPanSlider(args) {
    console.log("onPanSecondSlider", args.state);
    if (app.android) {
        if (SliderControl.calculateDegree(args.deltaX, args.deltaY).degreeOfUpperAngle <= 30) {
            var managementProduct = departmentSliderModel.managementProductList;
            var lastPage = ShareDataService.getData("lastPage");
            var managementCategoryMap = ManagementCategoryMap;
            var warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
            if (departmentSliderModel.typeOfPageManagement == typeOfListProduct.CATEGORY_LIST) {
                if (lastPage && args.deltaX < 0 && checkFirstSlide) {
                    checkFirstSlide = false;
                    console.log("/n /n /nDelta X : ", args.deltaX);
                    if (managementCategoryMap.current().last) {
                        managementProduct.pagination.page = managementCategoryMap.next().totalPage;
                    }
                    else {
                        managementCategoryMap.next();
                        managementProduct.pagination.page = 1;
                    }
                    initActionBar();
                }
                if (managementProduct.pagination.page == 1 && args.deltaX > 0 && checkFirstSlide) {
                    checkFirstSlide = false;

                    var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                    currentPageTemp = managementProduct.pagination.page;
                    if (managementCategoryMap.current().first) {
                        managementProduct.pagination.page = 1;
                    }
                    else {
                        managementProduct.pagination.page = managementCategoryMap.previous().totalPage;
                    }
                    initActionBar();
                }
                managementProduct.onPanSlider(args, lastPage, currentPageTemp)
                    .then((response) => {
                        currentPageTemp = null;
                        checkFirstSlide = true;
                        ShareDataService.setData("lastPage", response.last);
                        lastPage = ShareDataService.getData("lastPage");
                        var currentProductList = managementProduct.getProductListOfCurrentSlide();
                        page.getViewById("departmentSlider").notify({
                            eventName: currentProductList,
                            object: this,
                            eventData: response
                        })
                        Utils.hideLoadingIndicator();
                    })
                    .catch((err) => {
                        checkFirstSlide = true;
                        Utils.hideLoadingIndicator();
                        Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                        console.log("Error - product-list.model.ts - onPanSlider: ", err);
                    })
            }
            else {
                if (managementProduct) {
                    console.log("managementProduct productItem");
                    managementProduct.onPanSlider(args, lastPage)
                        .then((response) => {
                            var productArr = response.productArr;
                            ShareDataService.setData("lastPage", response.last);
                            lastPage = ShareDataService.getData("lastPage");
                            var currentProductList = managementProduct.getProductListOfCurrentSlide();
                            // Utils.showLoadingIndicator();
                            setTimeout(function () {
                                page.getViewById("departmentSlider").notify({
                                    eventName: currentProductList,
                                    object: this,
                                    eventData: response
                                })
                                Utils.hideLoadingIndicator();
                            }, 100)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                else {
                    console.log("managementProduct underfine product-item.ts");
                }
            }
        }
    }
    SliderControl.onPanProductImage(args, function () {
        console.log("onPanProductImage");
        var cache = ShareDataService.getData("cacheDepartmentData");
        var product = args.object.product;
            page.notify({
                eventName: "notifyAddProductToCart",
                object: this,
                eventData: {
                    product: departmentSliderModel.secondProductList[args.object.index[0]].productItems[args.object.index[1]],
                    quantity: ++departmentSliderModel.secondProductList[args.object.index[0]].productItems[args.object.index[1]].quantity
                }
            });
            departmentSliderModel.notifyPropertyChange("secondProductList", departmentSliderModel.secondProductList);
    });
}

export function onThirdPanSlider(args) {
    if (app.android) {
        if (SliderControl.calculateDegree(args.deltaX, args.deltaY).degreeOfUpperAngle <= 30) {
            var managementProduct = departmentSliderModel.managementProductList;
            var lastPage = ShareDataService.getData("lastPage");
            var managementCategoryMap = ManagementCategoryMap;
            var warehouseId = localStorage.getItem("warehouseInfo") ? localStorage.getItem("warehouseInfo").id : 49;
            if (departmentSliderModel.typeOfPageManagement == typeOfListProduct.CATEGORY_LIST) {
                if (lastPage && args.deltaX < 0 && checkFirstSlide) {
                    checkFirstSlide = false;
                    console.log("/n /n /nDelta X : ", args.deltaX);
                    console.log("/n /n /nDelta X : ", args.deltaX);
                    if (managementCategoryMap.current().last) {
                        managementProduct.pagination.page = managementCategoryMap.next().totalPage;
                    }
                    else {
                        managementCategoryMap.next();
                        managementProduct.pagination.page = 1;
                    }
                    initActionBar();
                }
                if (managementProduct.pagination.page == 1 && args.deltaX > 0 && checkFirstSlide) {
                    checkFirstSlide = false;

                    var cacheDepartmentData = ShareDataService.getData("cacheDepartmentData");
                    currentPageTemp = managementProduct.pagination.page;
                    if (managementCategoryMap.current().first) {
                        managementProduct.pagination.page = 1;
                    }
                    else {
                        managementProduct.pagination.page = managementCategoryMap.previous().totalPage;
                    }
                    initActionBar();
                }
                managementProduct.onPanSlider(args, lastPage, currentPageTemp)
                    .then((response) => {
                        currentPageTemp = null;
                        checkFirstSlide = true;
                        ShareDataService.setData("lastPage", response.last);
                        lastPage = ShareDataService.getData("lastPage");
                        var currentProductList = managementProduct.getProductListOfCurrentSlide();
                        page.getViewById("departmentSlider").notify({
                            eventName: currentProductList,
                            object: this,
                            eventData: response
                        })
                        Utils.hideLoadingIndicator();
                    })
                    .catch((err) => {
                        checkFirstSlide = true;
                        Utils.hideLoadingIndicator();
                        Utils.toastAlert("Có lỗi xảy ra khi tải dữ liệu");
                        console.log("Error - product-list.model.ts - onPanSlider: ", err);
                    })
            }
            else {
                if (managementProduct) {
                    console.log("managementProduct productItem");
                    managementProduct.onPanSlider(args, lastPage)
                        .then((response) => {
                            var productArr = response.productArr;
                            ShareDataService.setData("lastPage", response.last);
                            lastPage = ShareDataService.getData("lastPage");
                            var currentProductList = managementProduct.getProductListOfCurrentSlide();
                            // Utils.showLoadingIndicator();
                            setTimeout(function () {
                                page.getViewById("departmentSlider").notify({
                                    eventName: currentProductList,
                                    object: this,
                                    eventData: response
                                })
                                Utils.hideLoadingIndicator();
                            }, 100)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                else {
                    console.log("managementProduct underfine product-item.ts");
                }
            }
        }
    }
    SliderControl.onPanProductImage(args, function () {
        var cache = ShareDataService.getData("cacheDepartmentData");
        var product = args.object.product;

            page.notify({
                eventName: "notifyAddProductToCart",
                object: this,
                eventData: {
                    product: departmentSliderModel.thirdProductList[args.object.index[0]].productItems[args.object.index[1]],
                    quantity: ++departmentSliderModel.thirdProductList[args.object.index[0]].productItems[args.object.index[1]].quantity
                }
            });
            departmentSliderModel.notifyPropertyChange("thirdProductList", departmentSliderModel.thirdProductList);
    });
}

export function onTapProduct(args) {
    console.log("onTapProduct");
    args.object.getViewById("image").animate({
        scale: { x: 1.2, y: 1.2 },
        duration: 300
    })
        .then(function () {
            return args.object.getViewById("image").animate({
                scale: { x: 1, y: 1 },
                duration: 300
            });
        })
        .catch(function (err) {
            console.log(err);
        });
}

var isTapProductDetails = false;
export function onTapProductDetails(args) {
    var self = this;
    console.log("/n \n LongPress sss");
    args.object.getViewById("image").animate({
        scale: { x: 1.3, y: 1.3 },
        duration: 300
    })
        .then(function () {
            return args.object.getViewById("image").animate({
                scale: { x: 1, y: 1 },
                duration: 300
            });
        })
        .then(function () {
            return args.object.getViewById("image").animate({
                scale: { x: 1.3, y: 1.3 },
                duration: 300
            });
        })
        .then(function () {
            return args.object.getViewById("image").animate({
                scale: { x: 1, y: 1 },
                duration: 300
            });
        })
        .then(function () {
            console.log("compelte animation LongPress");
            var product = args.object.product;
            if (isTapProductDetails) {
                return;
            }
            isTapProductDetails = true;
            ShareDataService.setData('currentItem', product)
            Utils.showModal(args.object.page, 'shared/components/product-details-modal/product-details-modal', function (eventData, state) {
                isTapProductDetails = false;
                if (state == "add") {
                    if (eventData) {
                        page.notify({
                            eventName: "notifyAddProductToCartFromProductDetails",
                            object: self,
                            eventData: eventData
                        })
                    }
                    else {
                        console.log('close product details modal');
                    }
                }
                else {
                    if (state == "openRelated") {
                        Utils.navigate("pages/related-product-list/related-product-list", false, product.productId);
                    }
                    else {
                        console.log("close Callback with Other state");
                    }
                }
            }, true);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function initActionBar() {
    var managementCategoryMap = ManagementCategoryMap;
    page.getViewById("actionBar").notify({
        eventName: "actionBarTitleNotify",
        object: this,
        eventData: managementCategoryMap.current().categoryName.toUpperCase()
    });
}