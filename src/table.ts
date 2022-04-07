import { Observable } from 'rxjs';
import {
  AlterQuery,
  ColumnKeyValue,
  CreateQuery,
  DeleteQuery,
  FindQuery,
  JoinQuery,
  UnionQuery,
  UpdateQuery,
} from './models/sql.model';
import { TableService } from './services/table.service';

export abstract class Table<T> {
  public tableName: string;
  public schema: T;
  public dataset: Array<T>;
  public columns: Array<string>;
  public tableService: TableService;

  constructor(tableName: string, schema: any, dataset: Array<T> = []) {
    this.tableName = tableName;
    this.schema = schema;
    this.dataset = dataset;
    this.columns = Object.keys(new schema());

    this.tableService = new TableService(this.tableName);
  }

  public find(query?: FindQuery): Observable<Array<T>> {
    return this.tableService.find(query).run();
  }

  public findOne(query: FindQuery): Observable<T> {
    return this.tableService.findOne(query).run();
  }

  public findAmount(query: FindQuery, amount: number): Observable<T> {
    return this.tableService.findAmount(query, amount).run();
  }

  public insert(values: ColumnKeyValue): Observable<any> {
    return this.tableService.insert().run(values);
  }

  public update(query: UpdateQuery): Observable<any> {
    return this.tableService.update(query).run(query.values);
  }

  public delete(query: DeleteQuery): Observable<any> {
    return this.tableService.delete(query).run();
  }

  public create(config: CreateQuery): Observable<any> {
    return this.tableService.create(config).run();
  }

  public alter(config: AlterQuery): Observable<any> {
    return this.tableService.alter(config).run();
  }

  public union(config: UnionQuery): Observable<any> {
    return this.tableService.union(config).run();
  }

  public join(config: JoinQuery): Observable<any> {
    return this.tableService.join(config).run();
  }

  public drop(): Observable<any> {
    return this.tableService.drop().run();
  }
}
