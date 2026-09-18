"use client";

import React, {
  type TableHTMLAttributes,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";
import { AppCornerAccents } from "./AppCornerAccents";

export interface TableColumn<T = any> {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  render?: (row: T, index: number) => ReactNode;
}

export interface AppTableProps<T = any>
  extends Omit<TableHTMLAttributes<HTMLTableElement>, "border"> {
  /** Config-driven column definitions. When provided with `data`, renders automatically. */
  columns?: TableColumn<T>[];
  /** Array of row data for config-driven rendering. */
  data?: T[];
  /** Key extractor for rows when using `data`. Defaults to index or row.id / row.key. */
  rowKey?: (row: T, index: number) => string | number;
  /** Whether to render ToolNotch brutalist corner accents. */
  cornerAccents?: boolean;
  /** Whether to render outer container border. Defaults to true. */
  border?: boolean;
  /** Whether to enable row hover highlight. Defaults to true. */
  hoverable?: boolean;
  /** Whether to apply alternating zebra striping. */
  striped?: boolean;
  /** Compact padding variant for high-density tables. */
  compact?: boolean;
  /** Custom classes for the outer wrapper container. */
  containerClassName?: string;
  /** Children elements when using compound components (<AppTableHeader>, etc.) */
  children?: ReactNode;
}

export interface AppTableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface AppTableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface AppTableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface AppTableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  striped?: boolean;
  selected?: boolean;
}

export interface AppTableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  compact?: boolean;
}

export interface AppTableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  compact?: boolean;
}

export interface AppTableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {}

const alignClasses: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const AppTableHeader = forwardRef<HTMLTableSectionElement, AppTableHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <thead
      ref={ref}
      className={`bg-tertiary border-b border-border text-foreground font-semibold text-xs sm:text-sm tracking-normal ${className}`}
      {...props}
    >
      {children}
    </thead>
  )
);
AppTableHeader.displayName = "AppTableHeader";

export const AppTableBody = forwardRef<HTMLTableSectionElement, AppTableBodyProps>(
  ({ className = "", children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={`divide-y divide-border text-xs sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </tbody>
  )
);
AppTableBody.displayName = "AppTableBody";

export const AppTableFooter = forwardRef<HTMLTableSectionElement, AppTableFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={`bg-tertiary/50 border-t border-border text-xs sm:text-sm font-semibold ${className}`}
      {...props}
    >
      {children}
    </tfoot>
  )
);
AppTableFooter.displayName = "AppTableFooter";

export const AppTableRow = forwardRef<HTMLTableRowElement, AppTableRowProps>(
  (
    {
      className = "",
      hoverable = true,
      striped = false,
      selected = false,
      children,
      ...props
    },
    ref
  ) => (
    <tr
      ref={ref}
      className={`
        transition-colors
        ${hoverable ? "hover:bg-tertiary/60" : ""}
        ${striped ? "even:bg-tertiary/30" : ""}
        ${selected ? "bg-secondary/5 border-secondary/40" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  )
);
AppTableRow.displayName = "AppTableRow";

export const AppTableHead = forwardRef<HTMLTableCellElement, AppTableHeadProps>(
  ({ className = "", align = "left", compact = false, children, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={`px-4 ${compact ? "py-2" : "py-2.5 sm:py-3"} font-semibold text-foreground text-xs sm:text-sm ${
        alignClasses[align]
      } ${className}`}
      {...props}
    >
      {children}
    </th>
  )
);
AppTableHead.displayName = "AppTableHead";

export const AppTableCell = forwardRef<HTMLTableCellElement, AppTableCellProps>(
  ({ className = "", align = "left", compact = false, children, ...props }, ref) => (
    <td
      ref={ref}
      className={`px-4 ${compact ? "py-2" : "py-2.5 sm:py-3"} text-xs sm:text-sm ${
        alignClasses[align]
      } ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
AppTableCell.displayName = "AppTableCell";

export const AppTableCaption = forwardRef<HTMLTableCaptionElement, AppTableCaptionProps>(
  ({ className = "", children, ...props }, ref) => (
    <caption
      ref={ref}
      className={`mt-2 text-xs font-mono text-label text-left ${className}`}
      {...props}
    >
      {children}
    </caption>
  )
);
AppTableCaption.displayName = "AppTableCaption";

export function AppTable<T = any>({
  columns,
  data,
  rowKey,
  cornerAccents = false,
  border = true,
  hoverable = true,
  striped = false,
  compact = false,
  containerClassName = "",
  className = "",
  children,
  ...props
}: AppTableProps<T>) {
  const isDataDriven = Boolean(columns && data);

  const getRowKey = (row: T, idx: number): string | number => {
    if (rowKey) return rowKey(row, idx);
    if (typeof row === "object" && row !== null) {
      if ("id" in row && (row as any).id !== undefined) return (row as any).id;
      if ("key" in row && (row as any).key !== undefined) return (row as any).key;
    }
    return idx;
  };

  return (
    <div
      className={`
        relative
        w-full
        rounded-[2px]
        overflow-hidden
        bg-background
        ${border ? "border border-border" : ""}
        ${containerClassName}
      `}
    >
      {cornerAccents && <AppCornerAccents position="all" />}

      <div className="w-full overflow-x-auto">
        <table
          className={`w-full text-xs sm:text-sm border-collapse ${className}`}
          {...props}
        >
          {isDataDriven ? (
            <>
              <AppTableHeader>
                <AppTableRow hoverable={false}>
                  {columns!.map((col) => (
                    <AppTableHead
                      key={col.key}
                      align={col.align}
                      compact={compact}
                      className={col.headerClassName}
                    >
                      {col.header}
                    </AppTableHead>
                  ))}
                </AppTableRow>
              </AppTableHeader>
              <AppTableBody>
                {data!.map((row, rowIdx) => (
                  <AppTableRow
                    key={getRowKey(row, rowIdx)}
                    hoverable={hoverable}
                    striped={striped}
                  >
                    {columns!.map((col) => (
                      <AppTableCell
                        key={col.key}
                        align={col.align}
                        compact={compact}
                        className={col.className}
                      >
                        {col.render
                          ? col.render(row, rowIdx)
                          : (row as any)[col.key]}
                      </AppTableCell>
                    ))}
                  </AppTableRow>
                ))}
              </AppTableBody>
            </>
          ) : (
            children
          )}
        </table>
      </div>
    </div>
  );
}

// Compound attachment
AppTable.Header = AppTableHeader;
AppTable.Body = AppTableBody;
AppTable.Footer = AppTableFooter;
AppTable.Row = AppTableRow;
AppTable.Head = AppTableHead;
AppTable.Cell = AppTableCell;
AppTable.Caption = AppTableCaption;

export default AppTable;
