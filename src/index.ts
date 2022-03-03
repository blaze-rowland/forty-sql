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
  //   fullName: "Blaze Rowland",
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
  //       fullName: 'Rylee Rowland',
  //     },
  //   })
  //   .subscribe((user) => console.log(user));
  /* 
  --------------------------------------------------------------------
    Update
  --------------------------------------------------------------------
  */
  // userTable.update({ fullName: 'Rylee Rowland' }, { id: 1 });
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
  //         .update({ fullName: 'Rylee R Rowland' }, { id: user.id })
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
  // userTable.delete({ id: 1 });
  /* 
  --------------------------------------------------------------------
    Join Tables
  --------------------------------------------------------------------
  */
  // userTable
  //   .join('INNER JOIN', productTable.tableName, ['id', 'name'], {
  //     createdBy: 'id',
  //   })
  //   .subscribe((res) => console.log('Inner Joined', res));
  // userTable
  //   .join('LEFT JOIN', productTable.tableName, ['id', 'name'], {
  //     createdBy: 'id',
  //   })
  //   .subscribe((res) => console.log('Left Joined', res));
  // userTable
  //   .join('RIGHT JOIN', productTable.tableName, ['id', 'name'], {
  //     createdBy: 'id',
  //   })
  //   .subscribe((res) => console.log('Right Joined', res));
  /* 
  --------------------------------------------------------------------
    Union Tables
  --------------------------------------------------------------------
  */
  // userTable
  //   .union(
  //     [
  //       {
  //         columns: ['id', 'fullName'],
  //         tableName: 'users',
  //       },
  //       {
  //         columns: ['id', 'name'],
  //         tableName: 'products',
  //       },
  //     ],
  //     true // Changes whether Union statement is UNION (false || not provided) or UNION ALL (true)
  //   )
  //   .subscribe((res) => console.log(res));
})();
