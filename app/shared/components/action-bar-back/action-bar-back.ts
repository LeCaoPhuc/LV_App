var app = require("application");
var titleActionBarStyle;
import { Color } from "color";

export function onLoaded(args) {
   
}
export function onTitleCreatingView(args) {
    if(app.ios) {
        var nativeView = (new MarqueeLabel()).initWithFrameDurationAndFadeLength(new CGRect(100, 0, 100, 50), 8.0, 10.0);
        if(nativeView && args.object && args.object.page && args.object.page.getViewById("actionBar")) {
            args.object.page.getViewById("actionBar").on("actionBarTitleNotify", function(data) {
                nativeView.text = data.eventData + '        ';
            });
            nativeView.textColor = (new Color("white")).ios;
            nativeView.textAlignment = NSTextAlignment.Center;
            args.view = nativeView;
        }
        
    }
    else {
        var nativeView = args.object;
        if(args.object &&  args.object.page && args.object.page.getViewById("actionBar")) {
            args.object.page.getViewById("actionBar").on("actionBarTitleNotify", function(data) {
                if(nativeView && nativeView.android) {
                    nativeView.android.setText(data.eventData);
                    nativeView.android.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
                    nativeView.android.setMarqueeRepeatLimit("marquee_forever");
                    nativeView.android.setSingleLine(true);
                    nativeView.android.setSelected(true);
                }
            });
        }
    }
}