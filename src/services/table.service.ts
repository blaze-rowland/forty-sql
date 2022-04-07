import dotenv from 'dotenv';
import {
  AlterQuery,
  CreateQuery,
  DeleteQuery,
  FindQuery,
  JoinQuery,
  UnionQuery,
  UpdateQuery,
} from '../models/sql.model';
import { TableQuery } from '../queries/table.query';
import { SqlService } from './sql.service';

dotenv.config();

export class TableService extends SqlService {
  public tableName: string;

  constructor(tableName: string) {
    super();
    this.tableName = tableName;
  }

  public find(model?: FindQuery): TableQuery {
    const query = new TableQuery(this);
    return query.select(model?.columns).where(model?.conditions);
  }

  public findOne(model: FindQuery): TableQuery {
    return this.findAmount(model, 1);
  }

  public findAmount(model: FindQuery, amount: number): TableQuery {
    return this.find(model).limit(amount);
  }

  public insert(): TableQuery {
    const query = new TableQuery(this);
    return query.insert();
  }

  public update(model: UpdateQuery): TableQuery {
    const query = new TableQuery(this);
    return query.update(model);
  }

  public delete(model: DeleteQuery): TableQuery {
    const query = new TableQuery(this);
    return query.delete(model);
  }

  public create(config: CreateQuery): TableQuery {
    const query = new TableQuery(this);
    return query.create(config);
  }

  public alter(config: AlterQuery): TableQuery {
    const query = new TableQuery(this);
    return query.alter(config);
  }

  public union(config: UnionQuery): TableQuery {
    const query = new TableQuery(this);
    return query.union(config);
  }

  public join(config: JoinQuery): TableQuery {
    const query = new TableQuery(this);
    return query.join(config);
  }

  public drop(): TableQuery {
    const query = new TableQuery(this);
    return query.drop();
  }
}
