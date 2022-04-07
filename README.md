# @Forty-boy/SQL

A MySQL Library for Node.js

Currently creating this as a hobby project, but we'll see where it goes.

## Installing the Project

1. `npm install @forty-boy/sql` OR `yarn add @forty-boy/sql`
2. `const Forty = require('@forty-boy/sql')` \
   OR \
   `import Forty from '@forty-boy/sql'` \
   OR \
   `import { Table } from '@forty-boy/sql'`
3. Create `.env` file at root with values for corresponding keys in `.env-example` found [here](https://github.com/blaze-rowland/forty-sql/blob/main/.env-example)

## Cloning the Project

1. Clone the repository [here](https://github.com/blaze-rowland/forty-sql.git)
2. Run `npm install` OR `yarn install`
3. Create `.env` file at root with values for corresponding keys in `.env-example`
4. Run `npm run dev` OR `yarn run dev`

## Changelog

### Version 1.1.0

- Completely refactored
  - **Note** Almost everything syntax wise has stayed the same.
  - Removed unnecessary dependencies
  - Now using a chaining convention, although you may not ever need to touch it.
  - Now uses `Query` as an abstraction.
    - Now use `TableQuery` or `DatabaseQuery`
  - Can now create, switch, or drop Databases
  - `SqlService` is now an abstraction
    - Now can use `TableService` or `DatabaseService`

### Version 1.0.5

- [SqlService can now drop tables](https://github.com/blaze-rowland/forty-sql/issues/9)
- [SqlService can now alter tables](https://github.com/blaze-rowland/forty-sql/issues/8)

### Version 1.0.4

- [Fixed issue with Join method](https://github.com/blaze-rowland/forty-sql/issues/7)

### Version 1.0.3

- [Can now run find with just condition](https://github.com/blaze-rowland/forty-sql/issues/6)
- [Fixed update query updating all rows](https://github.com/blaze-rowland/forty-sql/issues/4)
- [Fixed delete query deleting all rows](https://github.com/blaze-rowland/forty-sql/issues/5)

### Version 1.0.2

- [Can now run find() on a Table class with just the columns you want to receive with no condition arguments](https://github.com/blaze-rowland/forty-sql/issues/3)
  - E.g. `userTable.find({ columns: ['id', 'createdAt'] });`

### Version 1.0.1

- [Can now run find() on a Table class to return all results](https://github.com/blaze-rowland/forty-sql/issues/2)
- [Can now create Unique columns when creating a table](https://github.com/blaze-rowland/forty-sql/issues/1)

## Examples

### Creating a Table Schema

For the rest of these examples we'll be using this user table

```
class UserSchema {
  id?: number; // This is nullable for Create calls
  fullName: string;
  dateOfBirth: Date;

  constructor(id: number, fullName: string, dateOfBirth: Date) {
    this.id = id;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
  }
}

type UserDateset = Array<UserSchema>;

export class UserTable extends Table<UserSchema> {
  constructor(tableName: string, users: UserDataset = []) {
    super(tableName, UserSchema, users);
  }
}
```

---

### Create Table

```
async createProducts(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const tableService = new TableService('products');
      tableService.create({
        columns: [
          {
            name: 'id',
            type: 'INT',
            size: 11,
            primaryKey: true,
            autoIncrement: true,
            nullable: false,
          },
          { name: 'name', type: 'VARCHAR', size: 255, default: 'Test Product' },
          { name: 'price', type: 'INT', size: 11 },
          { name: 'createdAt', type: 'DATETIME' },
          {
            name: 'createdBy',
            type: 'INT',
            nullable: false,
            foreignKey: {
              referenceId: 'id',
              referenceTable: 'users',
            },
          },
        ]
      }).subscribe((res) => resolve());
    } catch (err) {
      return reject(err);
    }
  })
}
```

---

### Add Values to Table

```
userTable.insert({
  fullName: 'Blaze Rowland',
  dateOfBirth: new Date(1997, 11, 14),
});
```

---

### Find, Find one, or Find a specific amount of Values

```
userTable
  .find({
    columns: ['id', 'fullName'],
    condition: { id: 1 },
  })
  .subscribe((users) => console.log(users));
```

```
userTable
  .findOne({
    columns: ['id'],
    condition: {
      fullName: 'Blaze Rowland',
    },
  })
  .subscribe((user) => console.log(user));
```

```
userTable
  .findAmount({
    columns: ['id'],
    condition: {
      fullName: 'Blaze Rowland',
    },
  }, 3)
  .subscribe((user) => console.log(user));
```

---

### Update Values

```
userTable
  .update({
    values: { fullName: 'Rylee Brown' },
    condition: { id: 1 },
  })
  .subscribe((res) => console.log(res));
```

---

### Find and Update Values

```
userTable
  .findOne({
    columns: ['id'],
    condition: {
      id: 1,
    },
  })
  .subscribe({
    next: (user) =>
      userTable
        .update({
          values: { fullName: 'Forrest Rowland' },
          condition: { id: user.id },
        })
        .subscribe((res) => console.log(res)),
  });
```

---

### Find and Add to Relational Table

```
userTable
  .findOne({
    columns: ['id'],
    condition: {
      fullName: 'Forrest Rowland',
    },
  })
  .subscribe({
    next: (user) => {
      productTable
        .insert({
          name: 'Pacifier',
          price: 5,
          createdAt: new Date(),
          createdBy: user.id,
        })
        .subscribe((res) => console.log(res));
    },
  });
```

---

### Delete from Table

```
productTable.delete({ id: 1 });
```

---

### Join Tables

```
  productTable
  .join({
    joinType: 'INNER JOIN',
    columnsToSelect: [
      { column: 'name' },
      { column: 'price' },
      { column: 'fullName', as: 'userName', table: userTable.tableName },
      { column: 'dateOfBirth', table: userTable.tableName },
    ],
    columnsOn: [
      {
        from: { column: 'id', table: userTable.tableName },
        to: { column: 'createdBy', table: productTable.tableName },
      },
    ],
  })
  .subscribe((res) => console.log(res));
```

```
  productTable
  .join({
    joinType: 'LEFT JOIN',
    columnsToSelect: [
      { column: 'name' },
      { column: 'price' },
      { column: 'fullName', as: 'userName', table: userTable.tableName },
      { column: 'dateOfBirth', table: userTable.tableName },
    ],
    columnsOn: [
      {
        from: { column: 'id', table: userTable.tableName },
        to: { column: 'createdBy', table: productTable.tableName },
      },
    ],
  })
  .subscribe((res) => console.log(res));
```

```
  productTable
  .join({
    joinType: 'RIGHT JOIN',
    columnsToSelect: [
      { column: 'name' },
      { column: 'price' },
      { column: 'fullName', as: 'userName', table: userTable.tableName },
      { column: 'dateOfBirth', table: userTable.tableName },
    ],
    columnsOn: [
      {
        from: { column: 'id', table: userTable.tableName },
        to: { column: 'createdBy', table: productTable.tableName },
      },
    ],
  })
  .subscribe((res) => console.log(res));
```

---

### Union Tables

```
productTable
  .union({
    columns: ['id', 'name'],
    conditions: {
      id: '1',
    },
    all: true,
    union: {
      table: userTable.tableName,
      columns: ['id', 'fullName'],
      conditions: {
        id: '1',
      },
    },
  })
  .subscribe((res) => console.log(res));
```

### Alter Tables

Create an instance of the SQL Service

```
const sqlService = new SqlService('users')
```

Add Columns:

```
userTable.alter({
  columnsToAdd: [
    {
      name: 'location',
      type: 'VARCHAR',
      size: 255,
    }
  ]
}).subscribe((res) => console.log(res))
```

Alter Columns:

```
userTable.alter({
  columnsToModify: [
    {
      name: 'firstName',
      newName: 'fullName',
      type: 'VARCHAR',
      size: 255,
    },
  ],
});
```

Remove Columns:

```
userTable.alter({
  columnsToRemove: [
    {
      name: 'lastName',
    },
  ],
});
```

`columnsToAdd`, `columnsToAlter`, and `columnsToRemove` can all be added to the alterAbleQuery like so:

```
userTable.alter({
  columnsToAdd: [
    {
      name: 'location',
      type: 'VARCHAR',
      size: 255,
    },
  ],
  columnsToModify: [
    {
      name: 'firstName',
      newName: 'fullName',
      type: 'VARCHAR',
      size: 255,
    },
  ],
  columnsToRemove: [
    {
      name: 'lastName',
    },
  ],
});
```

### Drop Tables

```
userTable().drop();
```

## Database

### Creating an instance of the Database class

```
const fortyDatabase = new Database('forty');
```

### Creating a database

```
fortyDatabase.create();
```

### Switching databases

_Option 1_

```
fortyDatabase.databaseName = 'newDatabase';
fortyDatabase.switch();
```

_Option 2_

```
fortyDatabase.switch('newDatabase');
```

### Dropping a database

_Option 1_

```
// This will throw an error if you haven't FIRST switched databases.

fortyDatabase.delete();
```

_Option 2_

```
fortyDatabase.delete('newDatabase');
```
