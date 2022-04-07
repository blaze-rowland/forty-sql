import { DatabaseQuery } from '../queries/database.query';
import { SqlService } from './sql.service';

export class DatabaseService extends SqlService {
  databaseName: string;

  constructor(databaseName: string) {
    super();
    this.databaseName = databaseName;
  }

  public create(): DatabaseQuery {
    const query = new DatabaseQuery(this);
    return query.create();
  }

  public delete(databaseName?: string): DatabaseQuery {
    const query = new DatabaseQuery(this);
    return query.delete(databaseName);
  }
}
