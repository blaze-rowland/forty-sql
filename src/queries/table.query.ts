import {
  AlterQuery,
  Column,
  ColumnKeyValue,
  ColumnModify,
  ColumnRemove,
  CreateQuery,
  DeleteQuery,
  JoinQuery,
  UnionQuery,
  UpdateQuery,
} from '../models/sql.model';
import { TableService } from '../services/table.service';
import { Query } from './query';

export class TableQuery extends Query {
  private _tableService: TableService;

  constructor(tableService: TableService) {
    super();
    this._tableService = tableService;
  }

  public select(columns?: Array<string>): TableQuery {
    const qb = this.query;
    qb.push('SELECT');
    qb.push(columns ? columns.join(', ') : '*');
    qb.push('FROM', this._tableService.tableName);

    this.setQuery = qb;

    return this;
  }

  public where(conditions?: ColumnKeyValue): TableQuery {
    const qb = this.query;

    if (!conditions) return this;
    if (!qb.includes('SELECT')) this.select();

    qb.push(this._createWhereClause(qb, conditions));

    this.setQuery = qb;

    return this;
  }

  public insert(): TableQuery {
    const qb = this.query;

    qb.push('INSERT INTO', this._tableService.tableName, 'SET', '?');

    this.setQuery = qb;
    return this;
  }

  public limit(amount: number): TableQuery {
    const qb = this.query;

    if (!qb.includes('SELECT')) this.select();
    if (!amount) return this;

    this.limitAmount = amount;

    qb.push('LIMIT', amount);

    this.setQuery = qb;
    return this;
  }

  public update(model: UpdateQuery): TableQuery {
    const qb = this.query;

    qb.push('UPDATE', this._tableService.tableName, 'SET ?');
    qb.push(this._createWhereClause(qb, model.conditions));

    this.setQuery = qb;
    return this;
  }

  public delete(model: DeleteQuery): TableQuery {
    const qb = this.query;

    qb.push('DELETE FROM', this._tableService.tableName);

    qb.push(this._createWhereClause(qb, model));

    this.setQuery = qb;
    return this;
  }

  public create(config: CreateQuery): TableQuery {
    const qb = this.query;
    qb.push('CREATE TABLE', this._tableService.tableName, '(');

    config.columns.forEach((column: Column, index: number) => {
      qb.push(column.name);

      if (column.type) qb.push(column.type);
      if (column.size) qb.push('(', column.size, ')');
      if (column.nullable === false) qb.push('NOT NULL');
      if (column.unique) qb.push('UNIQUE');
      if (column.primaryKey) qb.push('PRIMARY KEY');
      if (column.autoIncrement) qb.push('AUTO_INCREMENT');
      if (column.default)
        qb.push(
          'DEFAULT',
          typeof column.default === 'string'
            ? `'${column.default}'`
            : column.default
        );

      if (column.foreignKey) qb.push(this._handleCreateForeignKey(qb, column));

      qb.push(this.addIfNotLastIteration(config.columns, index, ', '));
    });

    qb.push(')');

    return this;
  }

  public alter(config: AlterQuery): TableQuery {
    const qb = this.query;

    qb.push('ALTER TABLE', this._tableService.tableName);

    if (config.columnsToAdd) {
      config.columnsToAdd.forEach((column: Column, index: number) => {
        qb.push(
          'ADD COLUMN',
          column.name,
          column.type,
          column.size ? `(${column.size})` : ''
        );

        if (column.foreignKey) {
          qb.push(this._handleCreateForeignKey(qb, column, true));
        }

        qb.push(this.addIfNotLastIteration(config.columnsToAdd, index, ', '));
      });
    }

    if (config.columnsToModify) {
      if (config.columnsToAdd) qb.push(', ');

      config.columnsToModify.forEach((column: ColumnModify, index: number) => {
        if (column.isForeign) {
          this._handleDropForeignKey(column);
        }

        if (column.oldName) {
          qb.push('CHANGE');
        } else {
          qb.push('MODIFY');
        }

        qb.push(
          column.oldName,
          column.name,
          column.type,
          column.size ? `(${column.size})` : ''
        );

        if (column.isForeign) {
          qb.push(this._handleCreateForeignKey(qb, column, true));
        }

        qb.push(
          this.addIfNotLastIteration(config.columnsToModify, index, ', ')
        );
      });
    }

    if (config.columnsToRemove) {
      config.columnsToRemove.forEach((column: ColumnRemove, index: number) => {
        if (config.columnsToAdd || config.columnsToModify) qb.push(', ');

        if (column.isForeign) {
          this._handleDropForeignKey(column);
        }

        qb.push('DROP COLUMN', column.name);
        qb.push(
          this.addIfNotLastIteration(config.columnsToRemove, index, ', ')
        );
      });
    }

    this.setQuery = qb;

    return this;
  }

  public union(config: UnionQuery): TableQuery {
    const qb = this.query;

    qb.push('SELECT');
    qb.push(this._createSelectClause(config.columns));
    qb.push('FROM');
    qb.push(this._tableService.tableName);
    if (config.conditions)
      qb.push(this._createWhereClause(qb, config.conditions));
    qb.push('UNION');
    if (config.all) qb.push('ALL');
    qb.push('SELECT');
    qb.push(this._createSelectClause(config.union.columns));
    qb.push('FROM');
    qb.push(config.union.table);
    if (config.union.conditions)
      qb.push(this._createWhereClause(qb, config.union.conditions));

    this.setQuery = qb;

    return this;
  }

  public join(config: JoinQuery): TableQuery {
    const qb = this.query;

    if (!config.joinType) return this;

    qb.push('SELECT');

    config.columnsToSelect.forEach((column: any, index: number) => {
      qb.push(
        column.table
          ? `${column.table}.${column.column}`
          : `${this._tableService.tableName}.${column.column}`
      );
      if (column.as) qb.push('as', column.as);
      qb.push(this.addIfNotLastIteration(config.columnsToSelect, index, ', '));
    });

    qb.push('FROM', this._tableService.tableName);

    config.columnsOn.forEach((column: any) => {
      qb.push(
        config.joinType,
        column.from.table,
        'ON',
        `${column.from.table}.${column.from.column}`,
        '=',
        `${column.to.table}.${column.to.column}`
      );
    });

    if (config.orderBy?.length) qb.push('ORDER BY');

    config.orderBy?.forEach((order: any, index: number) => {
      qb.push(`${order.table}.${order.column}`);
      qb.push(this.addIfNotLastIteration(config.orderBy, index, ', '));
    });

    if (
      config.orderBy?.length &&
      (config.asc === true || config.asc === false)
    ) {
      if (config.asc === true) qb.push('ASC');
      if (config.asc === false) qb.push('DESC');
    }

    this.setQuery = qb;
    return this;
  }

  public drop(): TableQuery {
    const qb = this.query;
    qb.push('DROP TABLE IF EXISTS', this._tableService.tableName);
    this.setQuery = qb;

    return this;
  }

  // Helpers

  private _createSelectClause(columns?: Array<string>): string {
    return columns ? columns.join(', ') : '*';
  }

  private _createWhereClause(
    query: Array<unknown>,
    conditions: ColumnKeyValue
  ): Array<unknown> {
    query.push('WHERE');

    const arr = Object.entries(conditions);
    for (const [index, [key, value]] of Object.entries(arr)) {
      query.push(key, '=', `'${value}'`);

      query.push(this.addIfNotLastIteration(arr, parseInt(index), ', '));
    }

    return query;
  }

  private _handleDropForeignKey(column: any): void {
    const removeForeignQuery = this.queryBuilder([
      `ALTER TABLE ${this._tableService.tableName} DROP FOREIGN KEY fk_${
        column.oldName || column.name
      }`,
    ]);
    this.run(null, removeForeignQuery);
  }

  private _handleCreateForeignKey(
    qb: Array<unknown>,
    column: Column,
    isAlter?: boolean
  ): Array<unknown> {
    qb.push(',', isAlter ? 'ADD' : '', 'CONSTRAINT', `fk_${column.name}`);
    qb.push('FOREIGN KEY', `(${column.name})`);

    if (column?.foreignKey?.referenceTable)
      qb.push('REFERENCES', column.foreignKey.referenceTable);

    if (column?.foreignKey?.referenceId)
      qb.push('(', column.foreignKey.referenceId, ')');

    return qb;
  }
}
