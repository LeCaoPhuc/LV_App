import { Observable } from "data/observable";
import { Product , Shelf , DepartmentStore,Mode} from "../../tools"
export class ShelfModel extends Observable{
    private shelfListLength ;
    private shelf;
    private productListLength;
    constructor(shelf){
        super();
        if(shelf.shelf){
            this.shelfListLength = shelf.shelfListLength;
            this.shelf = shelf.shelf;
            this.productListLength = shelf.shelf.listProductOnShelf.length;
        }else{
            this.shelfListLength = 0;
            this.shelf = {};
            this.productListLength =0;
        }
       
    }
    public initProductList(){
        return this.shelf.listProductOnShelf;
    }
}