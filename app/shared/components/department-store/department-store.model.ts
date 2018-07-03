import { Observable } from "data/observable";
import { Product , Shelf , DepartmentStore,Mode} from "../../tools"
import * as platformModule from "tns-core-modules/platform";
import app = require('application');
var enums = require("ui/enums");
export class DepartmentStoreModel extends Observable{
    private listProductOnDepartmentStore = new Array<Product>();
    private listShelfOnDepartmentStore= new Array<Shelf>();
    private mode ;
    private indexOfView;
    private sliderLeft;
    private sliderCenter;
    private sliderRight;
    private screenWidth;
    private isTranslating = false;
    private page;
    constructor(page,departmentStore){
        super();
        this.listProductOnDepartmentStore = departmentStore.listProductOnDepartmentStore;
        this.listShelfOnDepartmentStore = departmentStore.listShelfOnDepartmentStore;
        this.mode = departmentStore.mode;
        this.indexOfView = departmentStore.indexOfView;       
        this.screenWidth = platformModule.screen.mainScreen.widthDIPs;
        this.page = page;
    }
    public initShelfList(){
        return this.listShelfOnDepartmentStore;
    }
}