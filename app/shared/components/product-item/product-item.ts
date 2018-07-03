import { Observable } from "data/observable";
import { SliderControl, ShareDataService, Utils, httpRequest,typeOfProduct } from "../../../shared/tools";
import { Config } from "../../../shared/env-config";
var gestures = require("ui/gestures");
var app = require("application");
var nameOfProduct;
var managementProduct;
var lastPage;
var page;
var product;
export function onLoaded(args) {
    console.log("onLoaded Product Item");
    page = args.object.page;
    product = args.object.bindingContext;
    var productLayout = args.object;
    productLayout.on(gestures.GestureTypes.longPress, function (args) {
        console.log("gestures.GestureTypes.longPress");
        onTapProductDetails(args)
    })
    productLayout.on(gestures.GestureTypes.doubleTap, function (args) {
        console.log("gestures.GestureTypes.doubleTap");
    })
    productLayout.on(gestures.GestureTypes.pan, function (args) {
        if(args.object.isCheckOrder){
            console.log("Order is check");
            return;
        }
        SliderControl.onPanProductImage(args, function () {
            var cache = ShareDataService.getData("cacheDepartmentData");
            var product = args.object.bindingContext;
            if (product._productIsFresh) {
                Utils.showModal(page, "shared/components/scale-modal/scale-modal", function (quantity) {
                    console.log("close Scale");
                    if (quantity) {
                        page.notify({
                            eventName: "notifyAddProductToCart",
                            object: this,
                            eventData: {
                                product: product,
                                quantity: quantity
                            }
                        })
                    }
                }, false, { productId: product._productId} );
            }
            else {
                //check is order 
                if(product.typeOfProduct == typeOfProduct.ORDER){
                    page.notify({
                        eventName: "notifyAddProductToCart",
                        object: this,
                        eventData: {
                            product: product,
                            quantity: args.object.bindingContext._quantityOrder++
                        }
                    })
                }
                else{
                    page.notify({
                        eventName: "notifyAddProductToCart",
                        object: this,
                        eventData: {
                            product: product,
                            quantity: args.object.bindingContext._quantity++
                        }
                    })
                }
                
            }

        });
    })
    if (app.android) {
        productLayout.on(gestures.GestureTypes.pan, function (args) {
            console.log(product._enableGesture);
            if(product._enableGesture){
                managementProduct = ShareDataService.getData(product._typeOfManagementProductObject);
                var lastPage = ShareDataService.getData("lastPage");
                if(managementProduct){
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
                else{
                    console.log("managementProduct underfine product-item.ts");
                }
                
            }
        })
    }

}
var isTapFavoriteIcon = false;
export function onTapFavoriteIcon(args) {
    console.log("aaa");
    if (!Utils.checkInternetConnection()) {
        return;
    }
    if (isTapFavoriteIcon) {
        return;
    }
    isTapFavoriteIcon = true;
    Utils.showModal(args.object.page, "shared/components/confirm-favorite-modal/confirm-favorite-modal", function (confirmDelete) {
        console.log("Close CallBack onTapFavoriteIcon: " + confirmDelete);
        if (confirmDelete) {
            isTapFavoriteIcon = false;
            // Utils.showLoadingIndicator();
            deleteFavoriteProduct(args.object.favoriteId);
        }
        else {
            isTapFavoriteIcon = false;
            console.log("close Modal confirm favorite");
        }
    }, false)
}

function deleteFavoriteProduct(favoriteProductId) {
    var self = this;
    var url = "scanngo_v1/wishlist/" + favoriteProductId + "/delete";
    httpRequest.post(url, {}, localStorage.getItem("accessToken"))
        .then((res: any) => {
            if(res.statusCode == 200){
                res = res.content.toJSON();
                isTapFavoriteIcon = false;
                if (res && res.success) {
                    var favoriteList = ShareDataService.getData('favoriteList');
                    for (let i in favoriteList) {
                        if (favoriteProductId == favoriteList[i].productFavoriteId) {
                            favoriteList.splice(i ,1);
                            break;
                        }
                    }
                    ShareDataService.setData('favoriteList', favoriteList);
                    page.notify({
                        eventName: "notifyDeleteProductWishList",
                        object: self,
                        eventData: {}
                    })
                }
                else {
                        Utils.hideLoadingIndicator();
                        console.log("Error - deleteFavoriteProduct - product-item.ts ", res.statusCode)
                        Utils.toastAlert("Có lỗi khi tải dữ liệu");
                }
                // will call init poudtc list
            }
            else{
                if(res.content.toJSON().message){
                    Utils.hideLoadingIndicator();
                    var favoriteList = ShareDataService.getData('favoriteList');
                    for (let i in favoriteList) {
                        if (favoriteProductId == favoriteList[i].productFavoriteId) {
                            favoriteList.splice(i ,1);
                            break;
                        }
                    }
                    ShareDataService.setData('favoriteList', favoriteList);
                    page.notify({
                        eventName: "notifyDeleteProductWishList",
                        object: self,
                        eventData: {}
                    })
                    Utils.toastAlert("Sản phẩm yêu thích trống");
                }
                else{
                    Utils.hideLoadingIndicator();
                    console.log("Error - message undefine - deleteFavoriteProduct - product-item.ts ", res.statusCode)
                    Utils.toastAlert("Có lỗi khi tải dữ liệu message undefine");
                }   
            }
            
        })
        .catch((err) => {
            console.log("Error - deleteFavoriteProduct - product-item.ts ",err);
            Utils.toastAlert(Config.ERROR_MESSAGE_TOAST.ERROR_HANDLING);
            Utils.hideLoadingIndicator();
        })
}
var isTapProductDetails = false;
function onTapProductDetails(args) {
    var self = this;
    var product = args.object.bindingContext;
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
                    eventName: "notifyAddProductToCart",
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
                Utils.navigate("pages/related-product-list/related-product-list", false, product._productId);
            }
            else {
                console.log("close Callback with Other state");
            }
        }
    }, true)
}
