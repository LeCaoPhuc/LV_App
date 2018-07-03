
export class DisplayActionBar {

    private  _titleActionBar ;
    private  _subTitleActionBar;
    private _actionBarStyle : number = 0;

    constructor(style?: number){
        if(style){
            this._actionBarStyle = style;
        }
    }
    get actionBarStyle(): any {
        return this._actionBarStyle;
    }

    set actionBarStyle(actionBarStyle: any) {
        switch(actionBarStyle){
            // isHomepage
            case 1:
            break;
            // isCategory
            case 2:
            break;
            // isSubCategory
            case 3:
            break;
            // isOptional
            case 4:
            break;
        }
        this._actionBarStyle = actionBarStyle;
    }
    get titleActionBar(): any {
        return this._titleActionBar;
    }

    set titleActionBar(titleActionBar: any) {
        this._titleActionBar = titleActionBar.toUpperCase();
    }
    
     get subTitleActionBar(): any {
        return this._subTitleActionBar;
    }

    set subTitleActionBar(subTitleActionBar: any) {
        this._subTitleActionBar = subTitleActionBar;
    }
}
