export type TableRow = {
  rowTitle: string;
  cells: (string | React.JSX.Element)[];
};

interface TableProps {
  title?: string;
  columnHeaders?: string[];
  tableRows: TableRow[];
  removeRowTitleStyling?: boolean;
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
            {props.columnHeaders.map((columnHeader, index) => {
              return (
                <th scope="col" className="govuk-table__header" key={`${index}: ${columnHeader}`}>
                  {columnHeader}
                </th>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody className="govuk-table__body">
        {props.tableRows.map((tableRow, i) => {
          return (
            <tr className="govuk-table__row" key={i + ": " + tableRow.rowTitle}>
              {props.removeRowTitleStyling ? (
                <td scope="row" className="govuk-table__cell">
                  {tableRow.rowTitle}
                </td>
              ) : (
                <th scope="row" className="govuk-table__header">
                  {tableRow.rowTitle}
                </th>
              )}
              {tableRow.cells.map((cell, j) => {
                return (
                  <td className="govuk-table__cell" key={"cell-" + i + "-" + j}>
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
