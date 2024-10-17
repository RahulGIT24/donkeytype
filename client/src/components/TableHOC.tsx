import { useTable, usePagination, TableOptions } from "react-table";
import convertToCustomFormat from "../utils/convertDate";

const TableHoc = ({
  columns,
  data,
}:{
    columns:any,
    data:any
}) => {
  const options = {
    columns,
    data,
    initialState: { pageIndex: 0 },
    manualPagination:true,
  };

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow,page } =
    useTable(options as TableOptions<Object>, usePagination) as any;

  return (
    <>
      <div
        className={`w-full px-7 overflow-auto mt-3 max-h-screen`}
      >
        <table {...getTableProps()} className="w-[100%]">
          <thead className="bg-zinc-800 text-wheat py-5">
            {headerGroups.map((headerGroup:any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column:any) => (
                  <th
                    className="p-3 font-semibold"
                    {...column.getHeaderProps()}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row:any,index:number) => {
              console.log(row)
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`${index % 2 == 0 ? "bg-zinc-700":"bg-transparent"} border rounded-full border-zinc-800`}>
                  {row.cells.map((cell:any) => (
                    <td
                      className={`p-3 text-center py-5 text-lg ${cell.column.id === "profilePic" && "flex justify-center"}`}
                      {...cell.getCellProps()}
                    >
                      {cell.column.id === 'createdAt'? (
                      <p>{convertToCustomFormat(String(row.original.createdAt))}</p>
                    ) : (
                      cell.render("Cell")
                    )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableHoc;
