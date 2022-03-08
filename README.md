# @Forty/SQL

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
    const sql = new SqlService('products');
    await sql.createTableQuery([
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
    ]);
}
```

---

### Add Values to Table

```
userTable.add({
  fullName: 'Blaze Rowland',
  dateOfBirth: new Date(1997, 11, 14),
});
```

---

### Find and Find one Value

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
        .add({
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
userTable
  .join({
    joinType: 'INNER JOIN',
    tableName: productTable.tableName,
    columnsToSelect: ['id', 'name'],
    columnsOn: { createdBy: 'id' },
  })
  .subscribe((res) => console.log(res));
```

```
userTable
  .join({
    joinType: 'LEFT JOIN',
    tableName: productTable.tableName,
    columnsToSelect: ['id', 'name'],
    columnsOn: { createdBy: 'id' },
  })
  .subscribe((res) => console.log(res));
```

```
userTable
  .join({
    joinType: 'RIGHT JOIN',
    tableName: productTable.tableName,
    columnsToSelect: ['id', 'name'],
    columnsOn: { createdBy: 'id' },
  })
  .subscribe((res) => console.log(res));
```

---

### Union Tables

```
userTable
  .union({
    queries: [
      {
        columns: ['id', 'fullName'],
        tableName: 'users',
      },
      {
        columns: ['id', 'name'],
        tableName: 'products',
      },
    ],
    all: true, // Changes whether Union statement is UNION (false || not provided) or UNION ALL (true)
  })
  .subscribe((res) => console.log(res));
```
