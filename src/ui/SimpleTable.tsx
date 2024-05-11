import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, TableProps, TableBodyProps } from "@nextui-org/react";
import { ReactNode } from "react";

export default function SimpleTable<T>({
  headers,
  rows,
  bodyProps,
  ...tableProps
}: { headers: ReactNode[]; rows: ReactNode[][]; bodyProps?: TableBodyProps<T> } & TableProps) {
  return (
    <Table removeWrapper {...tableProps}>
      <TableHeader>
        {headers.map((item, index) => (
          <TableColumn key={"header_" + index}>{item}</TableColumn>
        ))}
      </TableHeader>
      <TableBody {...bodyProps}>
        {rows.map((row, index) => (
          <TableRow key={"row_" + index}>
            {row.map((cell, index) => (
              <TableCell key={"cell_" + index}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
