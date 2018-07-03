import { Color } from "color";
import * as frameModule from "tns-core-modules/ui/frame";
import { isAndroid, isIOS, device, screen } from "platform";
import * as enums from "ui/enums";
import { RadSideDrawer } from "nativescript-telerik-ui/sidedrawer";
import { Utils } from "../../../shared/tools";
import { Label } from "ui/label";
var frames = require("ui/frame");
var app = require("application");
var titleActionBarStyle2;
var titleActionBarStyle3;
var subTitleActionBar;
export function onLoaded(args) {

}

export function onTitleCreatingView(args) {
    if (app.ios) {
        var nativeView = (new MarqueeLabel()).initWithFrameDurationAndFadeLength(new CGRect(100, 0, 100, 50), 8.0, 10.0);
        args.object.page.getViewById("actionBar").on("actionBarTitleNotify", function (args) {
            nativeView.text = args.eventData + '        ';
        });
        nativeView.textColor = (new Color("white")).ios;
        nativeView.textAlignment = NSTextAlignment.Center;
        args.view = nativeView;
    }
    else {
        var nativeView = args.object;
        args.object.page.getViewById("actionBar").on("actionBarTitleNotify", function (data) {
            if (nativeView.android) {
                nativeView.android.setText(data.eventData.toUpperCase());
                nativeView.android.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
                nativeView.android.setMarqueeRepeatLimit("marquee_forever");
                nativeView.android.setSingleLine(true);
                nativeView.android.setSelected(true);
            }
        });
    }
}

export function onSubTitleCreatingView(args) {
    if (app.ios) {
        var nativeView = (new MarqueeLabel()).initWithFrameDurationAndFadeLength(new CGRect(100, 0, 100, 50), 8.0, 10.0);
        args.object.page.getViewById("actionBar").on("actionBarSubTitleNotify", function (args) {
            nativeView.text = args.eventData + '        ';
        });
        nativeView.textColor = (new Color("white")).ios;
        nativeView.textAlignment = NSTextAlignment.Center;
        args.view = nativeView;
    }
    else {
        var nativeView = args.object;
        args.object.page.getViewById("actionBar").on("actionBarSubTitleNotify", function (data) {
            if (nativeView.android) {
                nativeView.android.setText(data.eventData);
                nativeView.android.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
                nativeView.android.setMarqueeRepeatLimit("marquee_forever");
                nativeView.android.setSingleLine(true);
                nativeView.android.setSelected(true);
            }
        });
    }

}

function setAnimate(titleActionBar) {
    if (app.ios) {
        if (titleActionBar) {
            var uiLabel = new UILabel();
            var menuSearch = titleActionBar.page.getViewById("menuSearch");
            var menuLeft = titleActionBar.page.getViewById("menuLeft");
            var menuHome = titleActionBar.page.getViewById("menuHome");
            var menuList = titleActionBar.page.getViewById("menuList");
            uiLabel.text = titleActionBar.text;
            if (menuSearch && menuLeft && menuHome && menuList) {
                var screenWidth = screen.mainScreen.widthDIPs;
                var lengthOfString = uiLabel.attributedText.size().width + 10;
                if (lengthOfString <= screenWidth - menuLeft.width - menuHome.width - menuSearch.width - menuList.width - 10) {
                    return;
                }
                var translateXLabel = lengthOfString + 50;
                var translateXLabelTemp = 2 * lengthOfString + screenWidth;
                var currentTransLateX = titleActionBar.translateX;
                titleActionBar.translateX = currentTransLateX + (screenWidth - menuSearch.width);
                titleActionBar.animate({
                    translate: { x: -1 * translateXLabel, y: 0 },
                    duration: translateXLabel / 0.05,
                    iterations: 3000,
                    curve: enums.AnimationCurve.linear
                })
                    .then(() => {
                        this.setAnimate();
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            }
        }
    }
}

export function onSearchTap(args) {
    var page = args.object.page;
    console.log("onSearchTap");
    Utils.showModal(page, "shared/components/search/search", function (action, keyword, productId) {
        if (action == "itemProductTap") {
            if(args.object && args.object.bindingContext &&  args.object.bindingContext.isFirst) {
                args.object.bindingContext.isFirst.value = true;
            }
            console.log("itemProductTap");
            // object {} truyen search-product-list 
            Utils.showLoadingIndicator();
            setTimeout(function() {
                Utils.navigate("pages/search-product-list/search-product-list", false, {
                    type: 'one'
                });
            },100)
        }
        else {
            if (action == "submit") {
                if(args.object && args.object.bindingContext &&  args.object.bindingContext.isFirst) {
                    args.object.bindingContext.isFirst.value = true;
                }
                Utils.showLoadingIndicator();
                setTimeout(function(){
                    Utils.navigate("pages/search-product-list/search-product-list", false, {
                        type: 'many',
                        keyword: keyword
                    });
                },200)
            }
            else {
                console.log("Another action");
            }
        }
    }, false)
}


export function onSearchBarLoaded(args) {
    // args.object.backgroundColor = "red";
    // args.object.ios.searchBarStyle = UISearchBarStyle.UISearchBarStyleMinimal;
    // args.object.ios.backgroundImage = UIImage.new();
}