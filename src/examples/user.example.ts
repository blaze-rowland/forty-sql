import { SqlService } from "../services/sql.service";
import { Table } from "../table";

class UserSchema {
  id?: number;
  fullName: string;
  dateOfBirth: Date;

  constructor(id: number, fullName: string, dateOfBirth: Date) {
    this.id = id;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
  }
}

type UserDataset = Array<UserSchema>;

export class UserTable extends Table<UserSchema> {
  constructor(tableName: string, users: UserDataset = []) {
    super(tableName, UserSchema, users);
  }
}
