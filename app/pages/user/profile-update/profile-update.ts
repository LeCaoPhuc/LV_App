import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { ProfileUpdateModel } from './profile-update.model';
import app = require('application');
import { Color } from 'color/color';
import { Utils, ParseService } from '../../../shared/tools';
export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new ProfileUpdateModel(page);
}

export function onTextFieldLoaded(args) {
    var textField = args.object;
    var color = new Color("white");
    if (app.android) {
        textField.android.setHintTextColor(color.android);
    }
    else if (app.ios) {
        var placeholder = textField.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
    }
}

export function setTextFieldHintColor(textField) {
    var color = new Color("white");
    if (app.android) {
        textField.android.setHintTextColor(color.android);
    }
    else if (app.ios) {
        var placeholder = textField.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
    }
}

export function srollViewLoaded(args) {
    Utils.hideScrollViewBar(args.object);
}