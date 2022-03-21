import { SqlServiceClean } from '../services/sql.service-clean';
import { TableClean } from '../table-clean';
import { ProductTable } from './product.example';

class UserSchemaClean {
  id?: number;
  fullName: string;
  dateOfBirth: Date;

  constructor(id: number, fullName: string, dateOfBirth: Date) {
    this.id = id;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
  }
}
type UserDataset = Array<UserSchemaClean>;
class UserTableClean extends TableClean<UserSchemaClean> {
  constructor(tableName: string, users: UserDataset = []) {
    super(tableName, UserSchemaClean, users);
  }
}

class ProductSchemaClean {
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
type ProductDataset = Array<ProductSchemaClean>;
class ProductTableClean extends TableClean<ProductSchemaClean> {
  constructor(tableName: string, products: ProductDataset = []) {
    super(tableName, ProductSchemaClean, products);
  }
}

class TorrentSchemaClean {
  id?: number;
  name: string;
  url: string;
  userId: number;

  constructor(id: number, name: string, url: string, userId: number) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.userId = userId;
  }
}
type TorrentDataset = Array<TorrentSchemaClean>;
class TorrentTableClean extends TableClean<TorrentSchemaClean> {
  constructor(tableName: string, dataset: TorrentDataset = []) {
    super(tableName, TorrentSchemaClean, dataset);
  }
}

function findAllUsers(table: UserTableClean) {
  table.find().subscribe({
    next: (users) => console.log(users),
    error: (err) => console.error(err),
  });
}

function findOneUser(table: UserTableClean) {
  table
    .findOne({
      columns: ['id'],
      condition: {
        fullName: 'Rylee',
      },
    })
    .subscribe({
      next: (user) => console.log(user),
      error: (err) => console.error(err),
    });
}

function addOneUser(table: UserTableClean) {
  table
    .add({
      fullName: 'Forrest',
      dateOfBirth: new Date(6, 15, 2022),
    })
    .subscribe({
      next: (added) => console.log(added),
      error: (err) => console.error(err),
    });
}

function joinTwoTables(
  table: ProductTable | ProductTableClean,
  tableToJoin: UserTableClean
) {
  table
    .join({
      joinType: 'INNER JOIN',
      columnsToSelect: [
        { column: 'name' },
        { column: 'price' },
        { column: 'fullName', as: 'userName', table: tableToJoin.tableName },
        { column: 'dateOfBirth', table: tableToJoin.tableName },
      ],
      columnsOn: [
        {
          from: { column: 'id', table: tableToJoin.tableName },
          to: { column: 'createdBy', table: table.tableName },
        },
      ],
    })
    .subscribe({
      next: (result) => console.log(result),
      error: (err) => console.error(err),
    });
}

function updateOneUser(table: UserTableClean) {
  table
    .update({
      values: {
        fullName: 'Forrest Rowland',
      },
      condition: {
        id: 1,
      },
    })
    .subscribe({
      next: (updated) => console.log(updated),
      error: (err) => console.error(err),
    });
}

function unionTwoTables(
  table: UserTableClean,
  tableToUnion: ProductTableClean
) {
  table
    .union({
      queries: [
        {
          columns: ['id', 'fullName'],
          tableName: table.tableName,
        },
        {
          columns: ['id', 'name'],
          tableName: tableToUnion.tableName,
        },
      ],
      all: true,
    })
    .subscribe({
      next: (result) => console.log(result),
      error: (err) => console.error(err),
    });
}

function deleteFromTable(table: ProductTableClean) {
  table.delete({ id: 2 }).subscribe({
    next: (deleted) => console.log(deleted),
    error: (err) => console.error(err),
  });
}

function rawQueryOnTable(table: UserTableClean) {
  table
    .rawQuery('SELECT * FROM ' + table.tableName + ' WHERE id = 1')
    .subscribe({
      next: (results) => console.log(results),
      error: (err) => console.error(err),
    });
}

async function createTable(table: TorrentTableClean) {
  const sqlService = new SqlServiceClean(table.tableName);

  const result = await sqlService.createTable([
    {
      name: 'id',
      type: 'INT',
      size: 11,
      primaryKey: true,
      autoIncrement: true,
      nullable: false,
    },
    {
      name: 'name',
      type: 'VARCHAR',
      size: 255,
      nullable: false,
    },
    {
      name: 'url',
      type: 'VARCHAR',
      size: 255,
      nullable: false,
    },
    {
      name: 'userId',
      type: 'INT',
      size: 11,
      nullable: false,
      foreignKey: {
        referenceId: 'id',
        referenceTable: 'users',
        action: 'cascade',
      },
    },
  ]);

  console.log(result);
}

(async () => {
  const usersTableClean = new UserTableClean('users');
  const productTableClean = new ProductTableClean('products');
  const torrentTableClean = new TorrentTableClean('torrents');
  // const productTable = new ProductTable('products');

  // findAllUsers(usersTableClean);
  // findOneUser(usersTableClean);
  // addOneUser(usersTableClean);
  // joinTwoTables(productTable, usersTableClean);
  // updateOneUser(usersTableClean);
  // unionTwoTables(usersTableClean, productTableClean);
  // deleteFromTable(productTableClean);
  // rawQueryOnTable(usersTableClean);

  await createTable(torrentTableClean);
})();
