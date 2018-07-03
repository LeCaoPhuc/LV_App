export class ShareDataService {
    private static data = {};
    constructor() {

    }
    static setData(key: any, value: any) {
    if(key) 
        this.data[key] = value;
    }

    static getData(key: any) {
        return this.data[key];
    }

    static fetchData(key: any) {
        return this.data[key].fetch();
    }
}