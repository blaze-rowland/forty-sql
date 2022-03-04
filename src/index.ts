import { ProductTable } from './examples/product.example';
import { Seeder } from './examples/seed.example';
import { UserTable } from './examples/user.example';
import users from './examples/users';

const userTable = new UserTable('users', users);
const productTable = new ProductTable('products');

(async () => {
  /* 
  --------------------------------------------------------------------
    Create Tables 
  --------------------------------------------------------------------
  */
  // await new Seeder().init();
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
  //     next: (users) => {
  //       productTable
  //         .add({
  //           name: 'Pacifier',
  //           price: 5,
  //           createdAt: new Date(),
  //           createdBy: users.id,
  //         })
  //         .subscribe((res) => console.log(res));
  //     },
  //   });
  /* 
  --------------------------------------------------------------------
    Delete
  --------------------------------------------------------------------
  */
  // productTable.delete({ id: 1 });
  /* 
  --------------------------------------------------------------------
    Join Tables
  --------------------------------------------------------------------
  */
  // userTable
  //   .join({
  //     joinType: 'INNER JOIN',
  //     tableName: productTable.tableName,
  //     columnsToSelect: ['id', 'name'],
  //     columnsOn: { createdBy: 'id' },
  //   })
  //   .subscribe((res) => console.log(res));
  // userTable
  //   .join({
  //     joinType: 'LEFT JOIN',
  //     tableName: productTable.tableName,
  //     columnsToSelect: ['id', 'name'],
  //     columnsOn: { createdBy: 'id' },
  //   })
  //   .subscribe((res) => console.log(res));
  // userTable
  //   .join({
  //     joinType: 'RIGHT JOIN',
  //     tableName: productTable.tableName,
  //     columnsToSelect: ['id', 'name'],
  //     columnsOn: { createdBy: 'id' },
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
})();
