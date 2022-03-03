import { ProductTable } from "./examples/product.example";
import { Seeder } from "./examples/seed.example";
import { UserTable } from "./examples/user.example";
import users from "./examples/users";

const userTable = new UserTable("users", users);
const productTable = new ProductTable("products");

(async () => {
  // await new Seeder().init();
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
  // userTable.find(["id"], null, 1).subscribe({
  //   next: (users) =>
  //     userTable
  //       .update({ fullName: "Rylee Brown" }, { id: users[0].id })
  //       .subscribe((res) => console.log(res)),
  // });
  // userTable.update({ fullName: 'Rylee Rowland' }, { id: 1 });
  // userTable.delete({ id: 1 });

  // userTable.find(["id"], { fullName: "Rylee Brown" }).subscribe({
  //   next: (users) => {
  //     productTable.add({
  //       name: "Television",
  //       price: 350,
  //       createdAt: new Date(),
  //       createdBy: users[0].id,
  //     });
  //   },
  // });

  userTable
    .findOne(["id"], { fullName: "Rylee Brown" })
    .subscribe((user) => console.log(user));
})();
