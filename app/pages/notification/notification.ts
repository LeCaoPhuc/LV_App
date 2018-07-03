import { NotificationModel } from "./notification.model";
import { Config } from "../../shared/env-config";
var notificationModel;

export function onNavigatingTo(args) {
    notificationModel = new NotificationModel(args.object, args.object._modalContext);
    args.object.bindingContext  = notificationModel;
}

export function onLoaded(args) {
    var page = args.object;
    args.object.bindingContext  = notificationModel;
    page.getViewById("actionBar").notify({
        eventName: "actionBarTitleNotify",
        object: this,
        eventData: Config.TITLE.NOTIFY
    });
}
