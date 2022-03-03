import { SqlService } from '../services/sql.service';

export class Seeder {
  async init() {
    await this._createUsers();
    await this._createProducts();
  }

  private async _createUsers(): Promise<void> {
    const sql = new SqlService('users');
    await sql.createTableQuery([
      {
        name: 'id',
        type: 'INT',
        size: 11,
        primaryKey: true,
        autoIncrement: true,
        nullable: false,
      },
      { name: 'fullName', type: 'VARCHAR', size: 255, default: 'Testy Test' },
      { name: 'dateOfBirth', type: 'DATETIME' },
    ]);
  }

  private async _createProducts(): Promise<void> {
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
      { name: 'name', type: 'VARCHAR', size: 255, default: 'Testy Test' },
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
}
