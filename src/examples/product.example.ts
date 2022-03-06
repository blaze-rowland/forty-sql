import Table from '../table';

export class ProductSchema {
  id?: number;
  name: string;
  price: number;
  createdAt: Date;
  createdBy?: number;

  constructor(
    id: number,
    name: string,
    price: number,
    createdAt: Date,
    createdBy: number
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export type ProductDataset = Array<ProductSchema>;

export class ProductTable extends Table<ProductSchema> {
  constructor(tableName: string, products: ProductDataset = []) {
    super(tableName, ProductSchema, products);
  }
}
