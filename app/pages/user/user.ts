import { Page } from 'ui/page';
import { UserModel } from './user.model';

export function navigatingTo(args) {
	let page = <Page>args.object;
	page.bindingContext = new UserModel(page); 
}
