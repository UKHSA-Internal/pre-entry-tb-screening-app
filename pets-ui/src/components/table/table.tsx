export type TableRow = {
  rowTitle: string;
  cells: string[];
};

interface TableProps {
  title?: string;
  columnHeaders?: string[];
  tableRows: TableRow[];
}

export default function Table(props: Readonly<TableProps>) {
  return (
    <table className="govuk-table">
      {props.title && (
        <caption className="govuk-table__caption govuk-table__caption--m">{props.title}</caption>
      )}
      {props.columnHeaders && (
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            {props.columnHeaders.map((columnHeader) => {
              return (
                <th scope="col" className="govuk-table__header" key={columnHeader}>
                  {columnHeader}
                </th>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody className="govuk-table__body">
        {props.tableRows.map((tableRow) => {
          return (
            <tr className="govuk-table__row" key={tableRow.rowTitle}>
              <th scope="row" className="govuk-table__header">
                {tableRow.rowTitle}
              </th>
              {tableRow.cells.map((cell) => {
                return (
                  <td className="govuk-table__cell" key={cell}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
