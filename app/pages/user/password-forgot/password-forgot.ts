import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { ForgotPasswordModel } from './password-forgot.model';

export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new ForgotPasswordModel(page);
}

export function onLoaded(args) {
    let page = args.object.page;
    page.getViewById("actionBar").notify({
        eventName: "actionBarTitleNotify",
        object: this,
        eventData: "Quên mật khẩu"
    });
}