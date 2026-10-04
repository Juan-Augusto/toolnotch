import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  AppCard,
  AppTable,
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from "@/components/ui";

export interface GradeConversionRow {
  decimal: string;
  percent: string;
  letter: string;
  gpa: string;
}

export interface GradeConversionColumns {
  decimal: string;
  percent: string;
  letter: string;
  gpa: string;
}

interface Props {
  heading: string;
  intro: string;
  columns: GradeConversionColumns;
  rows: GradeConversionRow[];
  disclaimer: string;
  exampleHeading: string;
  exampleBody: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function AppBrGradeConversionTable({
  heading,
  intro,
  columns,
  rows,
  disclaimer,
  exampleHeading,
  exampleBody,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <section aria-labelledby="conversion-table-heading" className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h2
          id="conversion-table-heading"
          className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono"
        >
          {heading}
        </h2>
      </div>

      <p className="leading-relaxed text-label text-xs sm:text-sm font-mono">
        {intro}
      </p>

      <AppTable hoverable aria-label={heading}>
        <AppTableHeader>
          <AppTableRow hoverable={false}>
            <AppTableHead>{columns.decimal}</AppTableHead>
            <AppTableHead>{columns.percent}</AppTableHead>
            <AppTableHead>{columns.letter}</AppTableHead>
            <AppTableHead align="right">{columns.gpa}</AppTableHead>
          </AppTableRow>
        </AppTableHeader>
        <AppTableBody>
          {rows.map((row) => (
            <AppTableRow key={row.gpa + row.decimal}>
              <AppTableCell className="font-mono text-label">{row.decimal}</AppTableCell>
              <AppTableCell className="font-mono text-label">{row.percent}</AppTableCell>
              <AppTableCell className="font-mono font-medium text-foreground">
                {row.letter}
              </AppTableCell>
              <AppTableCell align="right" className="font-mono font-bold text-primary">
                {row.gpa}
              </AppTableCell>
            </AppTableRow>
          ))}
        </AppTableBody>
      </AppTable>

      <p className="text-xs text-label leading-relaxed font-mono">
        {disclaimer}
      </p>

      <AppCard border cornerAccents={false} className="p-3.5 sm:p-4 bg-tertiary">
        <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground font-mono mb-1.5">
          {exampleHeading}
        </h3>
        <p className="text-xs sm:text-sm text-label leading-relaxed font-mono mb-3">
          {exampleBody}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:underline"
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </AppCard>
    </section>
  );
}
