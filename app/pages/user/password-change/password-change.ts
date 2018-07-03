import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { PasswordChangeModel } from './password-change.model';


export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new PasswordChangeModel();
}