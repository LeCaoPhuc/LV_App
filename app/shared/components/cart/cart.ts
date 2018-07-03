import { EventData, fromObject } from 'data/observable';
import * as observable from "tns-core-modules/data/observable";
import * as pages from "tns-core-modules/ui/page";
import * as LabelModule from "tns-core-modules/ui/label";
import localStorage = require("nativescript-localstorage");
import { Config } from '../../env-config';
import { Utils, ShareDataService, Product } from '../../tools';
import platformModule = require("platform");
import app = require('application');
import enums = require("ui/enums");
import { httpRequest } from "../../tools/http";
import dialogs = require("ui/dialogs");
import { CartViewModel } from "./cart.model";

var gestures = require("ui/gestures");

var context: any;
var closeCallback: Function;
var item: any;
var cartViewModel: any;
var modelView: any;
var page;
var interval = {};
export function onLoaded(args) {
    var cartViewHeader: any;
    var cartViewBodyTop: any;
    var cartView: any;
    page = args.object.page;
    cartViewHeader = page.getViewById('cartViewHeader');
    cartViewBodyTop = page.getViewById('cartViewBodyTop');
    cartView = page.getViewById('cart');
    cartViewHeader.off(gestures.GestureTypes.pan);
    cartViewBodyTop.off(gestures.GestureTypes.pan);
    cartViewHeader.on(gestures.GestureTypes.pan, onPanCart);
    cartViewBodyTop.on(gestures.GestureTypes.pan, onPanCart);
    modelView = args.object.bindingContext;
    cartViewModel = new CartViewModel(page);
    args.object.bindingContext = cartViewModel;
    /**
     * ANDROID: hide btn Group and btn Scan when resume app (Leave app when CartView open)
     */
    if (cartView.translateY == 0 && app.android) {
        cartViewModel.displayBtnScan(false);
    }
}

export function onChangeQuantityTap(args) {
    var item = args.object.bindingContext;
    var minValue: number = 1;
    if (item.isFresh) {
        minValue = 0.1;
    }
    switch (args.object.typeButton) {
        case 'minius':
            if (item.quantity > minValue) {
                item.quantity = Math.round((item.quantity - minValue) * 1000) / 1000;
            }
            console.log(item.quantity);
            break;
        case 'plus':
            item.quantity = Math.round((item.quantity + minValue) * 1000) / 1000;
            console.log(item.quantity);
            break;
        default:
            break;
    }
    cartViewModel.calcTotalPrice();
    var listItemsInCart = {};
    for (let i = 0; i < cartViewModel.listItemsInCart.length; i++) {
        listItemsInCart[cartViewModel.listItemsInCart.getItem(i).productId] = cartViewModel.listItemsInCart.getItem(i);
    }
    localStorage.setItem('listItemsInCart', listItemsInCart);
    Utils.changeQuantityOfProductInCart(item.productId, item.quantity, args.object.page);
}

export function onChangeQuantityTouch(args) {
    var item = args.object.bindingContext;
    var minValue: number = 1;
    if (item.isFresh) {
        minValue = 0.1;
    }
    if (args.action == "down") {
        interval[item.id] = setInterval(() => {
            switch (args.object.typeButton) {
                case 'minius':
                    if (item.quantity > minValue) {
                        item.quantity = Math.round((item.quantity - minValue) * 1000) / 1000;
                    }
                    console.log(item.quantity);
                    break;
                case 'plus':
                    item.quantity = Math.round((item.quantity + minValue) * 1000) / 1000;
                    console.log(item.quantity);
                    break;
                default:
                    break;
            }
            cartViewModel.calcTotalPrice();
        }, 200);
    }
    else if (args.action == "up" || args.action == "cancel") {
        clearInterval(interval[item.id]);
        cartViewModel.calcTotalPrice();
    }
}

export function showProductDetail(args) {
    var item = args.view.bindingContext;
    if (cartViewModel.isTapProductDetails) {
        return;
    }
    cartViewModel.isTapProductDetails = true;
    ShareDataService.setData('currentItem', item);
    Utils.showModal(args.object.page, 'shared/components/product-details-modal/product-details-modal', function (eventData, state) {
        cartViewModel.isTapProductDetails = false;
        if (state == "add") {
            if (eventData) {
                var product = eventData.product;
                for (let i = 0; i < cartViewModel.listItemsInCart.length; i++) {
                    if (cartViewModel.listItemsInCart.getItem(i).id == product.id) {
                        // if this product already in cart, update quantity
                        var item = cartViewModel.listItemsInCart.getItem(i);
                        var itemId = cartViewModel.listItemsInCart.getItem(i).id;
                        item.quantity = eventData.quantity;
                        cartViewModel.calcTotalPrice();
                        cartViewModel.showAddProductSuccessCheck();
                        return;
                    }
                }
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
    }, true);
}

export function onTapBuyProductPromotion(args) {
    closeCartView(args);
    Utils.showLoadingIndicator();
    setTimeout(function () {
        Utils.navigate("pages/promotion-product-list/promotion-product-list", false, args.object.page.typeOfPage);
    }, 500)
}

export function closeCartView(args) {
    if (cartViewModel.iconArrow.src == "res://icon_double_arrow_down") {
        cartViewModel.displayBtnScan(false);
        if (cartViewModel.cartView.parent.getViewById("sliderView")) {
            cartViewModel.cartView.parent.getViewById("sliderView").animate({
                opacity: 1,
                duration: 333,
            });
        }
        cartViewModel.cartView.animate({
            translate: {
                x: cartViewModel.cartView.translateX,
                y: platformModule.screen.mainScreen.heightDIPs - 95 - cartViewModel.softButtonHeight
            },
            duration: 333,
            curve: enums.AnimationCurve.easeInOut
        }).then(() => {
            cartViewModel.cartView.backgroundImage = "";
            // cartViewModel.cartView.backgroundColor = "transparent";
            cartViewModel.iconArrow.src = "res://icon_double_arrow_up";
            cartViewModel.displayBtnScan(true);
        })
    }
    else {
    }
}

export function openCartView(args) {
    if (cartViewModel.iconArrow.src == "res://icon_double_arrow_up") {
        cartViewModel.displayBtnScan(false);
        if (cartViewModel.cartView.parent.getViewById("sliderView")) {
            cartViewModel.cartView.parent.getViewById("sliderView").animate({
                opacity: 0.4,
                duration: 333,
            });
        }
        cartViewModel.cartView.animate({
            translate: {
                x: cartViewModel.cartView.translateX,
                y: 0
            },
            duration: 333,
            curve: enums.AnimationCurve.easeInOut
        }).then(() => {
            cartViewModel.displayBtnScan(false);
            cartViewModel.iconArrow.src = "res://icon_double_arrow_down";
        })
    }
    else {
    }
}

export function onTapCartViewHeader(args) {
    if (cartViewModel.iconArrow.src == "res://icon_double_arrow_up") {
        openCartView(args);
    }
    else if (cartViewModel.iconArrow.src == "res://icon_double_arrow_down") {
        closeCartView(args);
    }
}

export function onDeleteTap(args) {
    var radlistview = page.getViewById('lv');
    var item = args.object.bindingContext;
    /**
     * Call API delete cart item
     */
    console.log('delete item with id: ' + item.productId);
    cartViewModel.listItemsInCart.splice(cartViewModel.listItemsInCart.indexOf(item), 1);
    cartViewModel.calcTotalPrice();
    radlistview.swipeActions = "false";
    setTimeout(function () {
        radlistview.swipeActions = "true";
    }, 300);
    var listItemsInCart = {};
    for (let i = 0; i < cartViewModel.listItemsInCart.length; i++) {
        listItemsInCart[cartViewModel.listItemsInCart.getItem(i).productId] = cartViewModel.listItemsInCart.getItem(i);
    }
    localStorage.setItem('listItemsInCart', listItemsInCart);
    Utils.changeQuantityOfProductInCart(item.productId, 0, args.object.page);
}

function onPanCart(args) {
    var screenSize = platformModule.screen.mainScreen.heightDIPs - 95 - cartViewModel.softButtonHeight;
    switch (args.state) {
        case 1:
            cartViewModel.prevDeltaY = 0;
            cartViewModel.displayBtnScan(false);
            for (let i = 0; i < cartViewModel.listItemsInCart.length; i++) {
                cartViewModel.listItemsInCart.getItem(i).showDeleteLayout = false;
            }
            cartViewModel.notifyPropertyChange('listItemsInCart', cartViewModel.listItemsInCart);
            break;
        case 2:
            var deltaY = cartViewModel.cartView.translateY + args.deltaY - cartViewModel.prevDeltaY;
            if (deltaY > 0 && deltaY < screenSize) {
                cartViewModel.cartView.translateY = deltaY;
                cartViewModel.cartView.parent.getViewById("sliderView").opacity = ((deltaY / screenSize) + 0.5) * 0.8;
                cartViewModel.prevDeltaY = args.deltaY;
            }
            break;
        case 3:
            if (args.deltaY < -1) {
                openCartView(args);
            }
            else {
                closeCartView(args);
            }
            break;
        default:
            break;
    }
}

/**
 * FOR ANDROID
 */

export function onDeleteTapAndroid(args) {
    var item = args.object.bindingContext;
    var height = cartViewModel.cartView.getChildById(item.id).getActualSize().height;
    var deleteLayout = cartViewModel.cartView.getChildById(`${item.id}_deleteLayout`);
    deleteLayout.height = height;
    item.showDeleteLayout = true;
    cartViewModel.cartView.getChildById('lv').refresh();
}

export function cancelDeleteItemAndroid(args) {
    console.log('cancelDeleteItem');
    var item = args.object.bindingContext;
    item.showDeleteLayout = false;
}

export function confirmDeleteItemAndroid(args) {
    var item = args.object.bindingContext;
    console.log('delete item with id: ' + item.id);
    // CartService.deleteProductInLocalCart(item);
    cartViewModel.listItemsInCart.splice(cartViewModel.listItemsInCart.indexOf(item), 1);
    cartViewModel.calcTotalPrice();
    var listItemsInCart = {};
    for (let i = 0; i < cartViewModel.listItemsInCart.length; i++) {
        listItemsInCart[cartViewModel.listItemsInCart.getItem(i).productId] = cartViewModel.listItemsInCart.getItem(i);
    }
    localStorage.setItem('listItemsInCart', listItemsInCart);
    Utils.changeQuantityOfProductInCart(item.productId, 0, args.object.page);
}
