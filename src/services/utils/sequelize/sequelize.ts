import {
  ColumnOn,
  ColumnToSelect,
  JoinOrderBy,
  ModifyTableColumn,
  SqlAlterTableQuery,
  SqlJoinQuery,
  SqlUnionQuery,
  SqlUpdateQuery,
  SqlWhereQuery,
  TableColumn,
} from '../../../models/sql.model';
import {
  addIfNotLastIteration,
  handleCondition,
  handleForeign,
  handleModifyName,
  handlePrimaryKey,
  handleUpdateColumns,
} from './sequelize.helpers';

export type CreateQuery = string | number | unknown | undefined;
export function createQuery(queryArray: Array<CreateQuery>): string {
  return queryArray.join(' ');
}

export function sequelizeCreateColumns(
  columnsToCreate: Array<TableColumn>
): string {
  columnsToCreate.sort((left, right) => {
    return left.hasOwnProperty('foreignKey')
      ? 1
      : right.hasOwnProperty('foreignKey')
      ? -1
      : 0;
  });

  let result = '(';

  columnsToCreate.forEach((column, index) => {
    result += sequelizeCreateSingleColumn(column);
    result += addIfNotLastIteration(columnsToCreate, index, ', ');
  });

  return result;
}

export function sequelizeCreateSingleColumn(column: ModifyTableColumn): string {
  let result: Array<CreateQuery> = [];

  if (column.newName) result = handleModifyName(result, column);

  if (!column.newName) result.push(column.name);
  if (column.type) result.push(column.type);
  if (column.size) result.push(`(${column.size})`);
  if (column.default) result.push('DEFAULT', column.default);

  if (column.primaryKey) result = handlePrimaryKey(result, column);

  if (column.foreignKey) result = handleForeign(result, column);

  if (column.unique) result.push('UNIQUE');

  return createQuery(result);
}

export function sequelizeFindQuery(
  currentTableName: string,
  sqlQuery?: SqlWhereQuery
): string {
  if (!sqlQuery) return `SELECT * FROM ${currentTableName}`;

  const result: Array<CreateQuery> = [];

  result.push(
    'SELECT',
    sqlQuery.columns || '*',
    'FROM',
    sqlQuery.tableName || currentTableName,
    sequelizeWhereQuery(sqlQuery) ?? ''
  );

  return createQuery(result);
}

export function sequelizeWhereQuery(sqlQuery: SqlWhereQuery): string {
  let result: Array<CreateQuery> = [];

  if (!sqlQuery || !sqlQuery.condition) {
    if (sqlQuery.limit) result.push('LIMIT', sqlQuery.limit);
    return createQuery(result);
  }

  result.push('WHERE');

  result = handleCondition(result, sqlQuery);

  if (sqlQuery.isNull === true) result.push('IS NOT NULL');
  if (sqlQuery.isNull === false) result.push('IS NULL');

  if (sqlQuery.groupBy) result.push('GROUP BY', sqlQuery.groupBy);

  if (sqlQuery.orderBy) {
    const ascDesc = sqlQuery.asc ? 'ASC' : sqlQuery.desc ? 'DESC' : '';
    result.push('ORDER BY', sqlQuery.orderBy, ascDesc);
  }

  if (sqlQuery.having) result.push('HAVING', sqlQuery.having);
  if (sqlQuery.limit) result.push('LIMIT', sqlQuery.limit);

  return createQuery(result);
}

export function sequelizeInsertQuery(tableName: string): string {
  const result: Array<CreateQuery> = [];

  result.push('INSERT INTO', tableName, 'SET ?');

  return createQuery(result);
}

export function sequelizeUpdateQuery(
  sqlQuery: SqlUpdateQuery,
  tableName: string
): string {
  const { values } = sqlQuery;
  const result: Array<CreateQuery> = [];

  const updateQuery = createQuery(handleUpdateColumns(values));
  result.push(
    'UPDATE',
    tableName,
    'SET',
    updateQuery,
    sequelizeWhereQuery(sqlQuery) ?? ''
  );

  return createQuery(result);
}

export function sequelizeDeleteQuery(
  condition: any,
  tableName: string
): string {
  const result: Array<CreateQuery> = [];

  result.push('DELETE FROM', tableName, sequelizeWhereQuery({ condition }));

  return createQuery(result);
}

export function sequelizeAlterColumnsQuery(
  sqlQuery: SqlAlterTableQuery
): string {
  const { columnsToAdd, columnsToAlter, columnsToRemove } = sqlQuery;
  const result: Array<CreateQuery> = [];

  if (columnsToAdd) {
    columnsToAdd.forEach((column, index) => {
      result.push('ADD');
      result.push(sequelizeCreateSingleColumn(column));
      result.push(addIfNotLastIteration(columnsToAdd, index, ','));
    });
  }

  if (columnsToAlter) {
    columnsToAlter.forEach((column, index) => {
      if (columnsToAdd?.length) result.push(', ');
      result.push('ADD');
      result.push(sequelizeCreateSingleColumn(column));
      result.push(addIfNotLastIteration(columnsToAlter, index, ','));
    });
  }

  if (columnsToRemove) {
    columnsToRemove.forEach((column, index) => {
      if (columnsToAdd?.length || columnsToAlter?.length) result.push(', ');
      result.push('DROP COLUMN');
      result.push(column.name);
      result.push(addIfNotLastIteration(columnsToRemove, index, ','));
    });
  }

  return createQuery(result);
}

export function sequelizeJoinQuery(
  sqlQuery: SqlJoinQuery,
  tableName: string
): string | void {
  const { joinType, columnsOn, columnsToSelect, orderBy, asc } = sqlQuery;

  const result: Array<CreateQuery> = [];

  if (!joinType) return;

  result.push('SELECT');

  columnsToSelect.forEach((column: ColumnToSelect, index: number) => {
    if (column.table) result.push(column.table);
    else result.push(tableName);

    result.push('.', column.column);

    if (column.as) result.push('as', column.as);

    result.push(addIfNotLastIteration(columnsToSelect, index, ','));
  });

  result.push('FROM', tableName);

  columnsOn.forEach((column: ColumnOn) => {
    result.push(
      joinType,
      column.from.table,
      'ON',
      column.from.table,
      '.',
      column.from.column,
      '=',
      column.to.table,
      '.',
      column.to.column
    );
  });

  if (orderBy?.length) {
    result.push('ORDER BY');

    orderBy.forEach((order: JoinOrderBy, index: number) => {
      result.push(order.table, '.', order.column);
      result.push(addIfNotLastIteration(orderBy, index, ','));
    });

    const ascDesc = asc ? 'ASC' : asc === false ? 'DESC' : '';

    result.push(ascDesc);
  }

  return createQuery(result);
}

export function sequelizeUnionQuery(
  sqlQuery: SqlUnionQuery,
  createFindQuery: any,
  tableName: string
): string | void {
  const { queries, all } = sqlQuery;

  if (!queries?.length) return;

  const result: Array<CreateQuery> = [];

  queries.forEach((query, index) => {
    const unionAll = all ? 'ALL' : '';

    result.push(
      createFindQuery(query, tableName),
      addIfNotLastIteration(queries, index, `UNION ${unionAll}`)
    );
  });

  return createQuery(result);
}
