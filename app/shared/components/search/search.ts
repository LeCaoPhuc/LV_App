import { SearchViewModel } from "./search.model";

export function onLoaded(args) {
    var page = args.object;
    var closeCallback =  args.object._closeModalCallback;
    args.object.bindingContext = new SearchViewModel(page,closeCallback,args.object._modalContext);
}