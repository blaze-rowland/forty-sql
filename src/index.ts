import { UserTable } from './examples/user.example';
import users from './examples/users';

const userTable = new UserTable('users', users);

// userTable.find(['fullName'], null, 10);

// userTable.update({ fullName: 'Rylee R Rowland' }, { id: 6 });

// userTable.add({
//   fullName: 'Paul Brodhead',
//   dateOfBirth: new Date(1997, 3, 11),
// });

// userTable.delete({ id: 17 });
