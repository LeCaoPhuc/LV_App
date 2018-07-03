import { Utils, httpRequest, Error, ShareDataService, ParseService } from "../../tools";
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import localStorage = require("nativescript-localstorage");
import dialogs = require("ui/dialogs");
import { Config } from "../../env-config";
import app = require('application');
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
var phone = require("nativescript-phone");
var permissions = require("nativescript-permissions");
var sideDrawer: RadSideDrawer;
var frame = require("ui/frame");

export function onLoaded(args) {
    sideDrawer = <RadSideDrawer>(args.object.page.getViewById("sideBar"));
    if(sideDrawer) {
            sideDrawer.gesturesEnabled = true;
    }  
    sideDrawer.on("drawerClosed", function () {
        sideDrawer.gesturesEnabled = false;
    })
    if (app.ios) {
        var scrollViewSideBar = args.object.page.getViewById("scrollViewSideBar");
        scrollViewSideBar.ios.bounces = false;
    }
}

export function closeSideBar() {
    if (sideDrawer) {
        sideDrawer.closeDrawer();
        return true
    }
    else {
        console.log("Can't close sidebar");
        return false;
    }

}

export function profileUpdate() {
    closeSideBar()
    Utils.navigate('pages/user/profile-update/profile-update');
}

export function logOut(args) {
    closeSideBar();
    setTimeout(function () {
        dialogs.confirm({
            title: "Đăng Xuất",
            message: "Bạn có muốn đăng xuất?",
            okButtonText: "Có",
            cancelButtonText: "Không"
        }).then(function (result) {
            if (result) {
                Utils.showLoadingIndicator();
                ParseService.logOut()
                    .then((res) => {
                        Utils.hideLoadingIndicator();
                        localStorage.setItem("isLogged", false);
                        localStorage.setItem("listItemsInCart", undefined);
                        if(args.object && args.object.bindingContext &&  args.object.bindingContext.isFirst) {
                            args.object.bindingContext.isFirst.value = true;
                        }
                        Utils.navigate('pages/user/user', true, {}, {
                            name: 'slideRight',
                            duration: 250,
                            curve: "ease"
                        });
                    })
                    .catch((err) => {
                        Utils.hideLoadingIndicator();
                        console.log(err);
                    })
            }
        });
    }, 500);
}

export function onTapComment(args) {
    closeSideBar()
    setTimeout(function () {
        Utils.showModal(args.object.page, 'shared/components/feedback/feedback', function (isNavigate) {
            console.log('close Commnet modal');
            if (isNavigate) {
                Utils.navigate("pages/home-page/home-page", true);
            }
        }, false)
    }, 500);

}

export function openPrivacyPolicyPage(args) {
    closeSideBar()
    Utils.showLoadingIndicator();
    ShareDataService.setData('staticModalType', Config.STATIC_PAGE.PRIVACY_POLICY);
    setTimeout(function () {
        Utils.showModal(args.object.page, 'shared/components/static-modal/static-modal', function () {
            console.log('close PrivacyPolicy modal');
             Utils.hideLoadingIndicator();
        }, true)
    }, 500);
}

export function openFAQPage(args) {
    closeSideBar()
    Utils.showLoadingIndicator();
    ShareDataService.setData('staticModalType', Config.STATIC_PAGE.FAQ);
    setTimeout(function () {
        Utils.showModal(args.object.page, 'shared/components/static-modal/static-modal', function () {
            console.log('close FAQ modal');
            Utils.hideLoadingIndicator();
        }, true)
    }, 500);
}

export function callHotline() {
    if (app.android) {
        ParseService.cloud('getShopInfo',{})
        .then((res)=>{
             if(res && res.success) {
                if(res.data) {
                    var hotlineNumber = res.data.get('shop_phone_number');
                    permissions.requestPermission(android.Manifest.permission.CALL_PHONE, Config.CALL_CENTER_NUMBER)
                    .then((res) => {
                        phone.dial(hotlineNumber, false);
                    })
                    .catch((err) => {
                        console.log("permission.CALL_PHONE : false");
                    })
                } 
            }
            
        })
        .catch((err)=>{
            console.log('error - callHotline - ', err);
            Utils.toastAlert('Có lỗi khi lấy dữ liệu tổng đài !');
        })
       
    }
    else {
        phone.dial(hotlineNumber, false);
    }

}

export function openNotificationPage(args) {
    Utils.showLoadingIndicator();
    closeSideBar()
    Utils.navigate('pages/notification/notification');
}

export function openWarehouseInfoPage(args) {
    closeSideBar()
    Utils.navigate('pages/warehouse-info/warehouse-info');
}

export function openCheckOrderPage(args) {
    closeSideBar()
    ShareDataService.setData('listOrderType', 'check');
    Utils.navigate('pages/order/list-order/list-order');
}

export function openOrderHistoryPage(args) {
    closeSideBar()
    ShareDataService.setData('listOrderType', 'history');
    Utils.navigate('pages/order/list-order/list-order');
}