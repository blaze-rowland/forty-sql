import { ModifyTableColumn, SqlWhereQuery } from '../../../models/sql.model';
import { CreateQuery } from './sequelize';

export function handleModifyName(
  result: Array<CreateQuery>,
  column: ModifyTableColumn
) {
  result.push('CHANGE');
  result.push(column.name);
  result.push(column.newName);
  return result;
}

export function handleForeign(
  result: Array<CreateQuery>,
  column: ModifyTableColumn
) {
  result.push(
    ',',
    'FOREIGN KEY',
    column.name,
    'REFERENCES',
    column.foreignKey?.referenceTable,
    `(${column.foreignKey?.referenceId})`
  );
  return result;
}

export function handlePrimaryKey(
  result: Array<CreateQuery>,
  column: ModifyTableColumn
) {
  if (column.autoIncrement) result.push('AUTO_INCREMENT');
  result.push('PRIMARY KEY');
  result.push(`(${column.name})`);
  return result;
}

export function handleCondition(
  result: Array<CreateQuery>,
  sqlQuery: SqlWhereQuery
) {
  const conditionArr = Object.entries(sqlQuery.condition);
  conditionArr.forEach(([key, value], index) => {
    let operator = 'AND';

    if (sqlQuery.operator) {
      operator = sqlQuery.operator;
    }

    result.push(
      key,
      '=',
      value,
      addIfNotLastIteration(conditionArr, index, operator)
    );
  });

  return result;
}

export function handleUpdateColumns(values: any) {
  const result: Array<CreateQuery> = [];

  const iterable = Object.keys(values);
  iterable.forEach((key, index) => {
    result.push(key, '= ?', addIfNotLastIteration(iterable, index, ','));
  });

  return result;
}

export function addIfNotLastIteration(
  arr: Array<any>,
  index: number,
  strToAdd: string
) {
  return index === arr.length - 1 ? '' : strToAdd;
}
