export class Product {

    constructor(public id:number,
                public sku: string,
                public name: string,
                public description: string,
                public unitPrice: string,
                public imageUrl: string,
                public active: string,
                public unitsInStock: string,
                public dateCreated: string,
                public lastUpdated: string,

//this data matches the actual properties from Json data
//comming back from my SpringDataRest API
    ){

    }
}
