import { ProductTable } from './product.example';
import { UserTable } from './user.example';
import { Seeder } from './seed.example';
import { SqlService } from '../services/sql.service';
import users from './users';

const userTable = new UserTable('users', users);
const productTable = new ProductTable('products');

const usersSqlService = new SqlService(userTable.tableName);
const productsSqlService = new SqlService(productTable.tableName);

export const RunExample = async () => {
  /* 
  --------------------------------------------------------------------
    Create Tables 
  --------------------------------------------------------------------
  */
  await new Seeder().init();
  /* 
  --------------------------------------------------------------------
    Add Values to Tables 
  --------------------------------------------------------------------
  */
  // userTable.add({
  //   fullName: 'Blaze Rowland',
  //   dateOfBirth: new Date(1997, 11, 14),
  // });
  // productTable.add({
  //   name: 'Box',
  //   price: 50,
  //   createdAt: new Date(),
  //   createdBy: 1,
  // });
  /* 
  --------------------------------------------------------------------
    Find
  --------------------------------------------------------------------
  */
  // userTable
  //   .find({
  //     columns: ['id', 'fullName'],
  //     condition: { id: 1 },
  //   })
  //   .subscribe((users) => console.log(users));
  // userTable
  //   .findOne({
  //     columns: ['id'],
  //     condition: {
  //       fullName: 'Blaze Rowland',
  //     },
  //   })
  //   .subscribe((user) => console.log(user));
  /* 
  --------------------------------------------------------------------
    Update
  --------------------------------------------------------------------
  */
  // userTable
  //   .update({
  //     values: { fullName: 'Rylee Brown' },
  //     condition: { id: 1 },
  //   })
  //   .subscribe((res) => console.log(res));
  /* 
  --------------------------------------------------------------------
    Find and Update
  --------------------------------------------------------------------
  */
  // userTable
  //   .findOne({
  //     columns: ['id'],
  //     condition: {
  //       id: 1,
  //     },
  //   })
  //   .subscribe({
  //     next: (user) =>
  //       userTable
  //         .update({
  //           values: { fullName: 'Forrest Rowland' },
  //           condition: { id: user.id },
  //         })
  //         .subscribe((res) => console.log(res)),
  //   });
  /* 
  --------------------------------------------------------------------
    Find and Add to Relational Table
  --------------------------------------------------------------------
  */
  // userTable
  //   .findOne({
  //     columns: ['id'],
  //     condition: {
  //       fullName: 'Forrest Rowland',
  //     },
  //   })
  //   .subscribe({
  //     next: (user) => {
  //       productTable
  //         .add({
  //           name: 'Pacifier',
  //           price: 5,
  //           createdAt: new Date(),
  //           createdBy: user.id,
  //         })
  //         .subscribe((res) => console.log(res));
  //     },
  //   });
  /* 
  --------------------------------------------------------------------
    Delete
  --------------------------------------------------------------------
  */
  // productTable.delete({ id: 1 }).subscribe((res) => console.log(res));
  /* 
  --------------------------------------------------------------------
    Join Tables
  --------------------------------------------------------------------
  */
  // productTable
  //   .join({
  //     joinType: 'INNER JOIN',
  //     columnsToSelect: [
  //       { column: 'name' },
  //       { column: 'price' },
  //       { column: 'fullName', as: 'userName', table: userTable.tableName },
  //       { column: 'dateOfBirth', table: userTable.tableName },
  //     ],
  //     columnsOn: [
  //       {
  //         from: { column: 'id', table: userTable.tableName },
  //         to: { column: 'createdBy', table: productTable.tableName },
  //       },
  //     ],
  //   })
  //   .subscribe((res) => console.log(res));
  // productTable
  //   .join({
  //     joinType: 'LEFT JOIN',
  //     columnsToSelect: [
  //       { column: 'name' },
  //       { column: 'price' },
  //       { column: 'fullName', as: 'userName', table: userTable.tableName },
  //       { column: 'dateOfBirth', table: userTable.tableName },
  //     ],
  //     columnsOn: [
  //       {
  //         from: { column: 'id', table: userTable.tableName },
  //         to: { column: 'createdBy', table: productTable.tableName },
  //       },
  //     ],
  //   })
  //   .subscribe((res) => console.log(res));
  // productTable
  //   .join({
  //     joinType: 'RIGHT JOIN',
  //     columnsToSelect: [
  //       { column: 'name' },
  //       { column: 'price' },
  //       { column: 'fullName', as: 'userName', table: userTable.tableName },
  //       { column: 'dateOfBirth', table: userTable.tableName },
  //     ],
  //     columnsOn: [
  //       {
  //         from: { column: 'id', table: userTable.tableName },
  //         to: { column: 'createdBy', table: productTable.tableName },
  //       },
  //     ],
  //   })
  //   .subscribe((res) => console.log(res));
  /* 
  --------------------------------------------------------------------
    Union Tables
  --------------------------------------------------------------------
  */
  // userTable
  //   .union({
  //     queries: [
  //       {
  //         columns: ['id', 'fullName'],
  //         tableName: 'users',
  //       },
  //       {
  //         columns: ['id', 'name'],
  //         tableName: 'products',
  //       },
  //     ],
  //     all: true, // Changes whether Union statement is UNION (false || not provided) or UNION ALL (true)
  //   })
  //   .subscribe((res) => console.log(res));
  /* 
  --------------------------------------------------------------------
    Alter Table
  --------------------------------------------------------------------
  */
  // await usersSqlService.alterTableQuery({
  //   columnsToAdd: [
  //     {
  //       name: 'lastName',
  //       type: 'VARCHAR',
  //       size: 255,
  //     },
  //     {
  //       name: 'location',
  //       type: 'VARCHAR',
  //       size: 255,
  //     },
  //   ],
  // });
  // await usersSqlService.alterTableQuery({
  //   columnsToAlter: [
  //     {
  //       name: 'fullName',
  //       newName: 'firstName',
  //       type: 'VARCHAR',
  //       size: 255,
  //     },
  //   ],
  // });
  // await usersSqlService.alterTableQuery({
  //   columnsToRemove: [
  //     {
  //       name: 'location',
  //     },
  //   ],
  // });
  /* 
  --------------------------------------------------------------------
    Drop Table
  --------------------------------------------------------------------
  */
  // productsSqlService.dropTable();
};
