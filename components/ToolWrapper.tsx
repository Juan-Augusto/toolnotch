import Link from "next/link";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import AdUnit from "./AdUnit";
import FaqSection, { FaqItem } from "./FaqSection";

interface ToolWrapperProps {
  title: string;
  description: string;
  breadcrumbLabel: string;
  faqs: FaqItem[];
  adSlot?: string;
  children: React.ReactNode;
}

export default function ToolWrapper({
  title,
  description,
  breadcrumbLabel,
  faqs,
  adSlot,
  children,
}: ToolWrapperProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb + Back */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1 hover:text-gray-700 transition-colors">
              <Home size={14} />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-700 font-medium">{breadcrumbLabel}</span>
          </nav>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} />
            All tools
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-3">{description}</p>
          <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
            Files processed in your browser — never uploaded to our servers
          </span>
        </div>

        {/* Top Ad */}
        {adSlot && (
          <div className="mb-6">
            <AdUnit slot={adSlot} />
          </div>
        )}

        {/* Tool Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>

        {/* FAQ */}
        <FaqSection faqs={faqs} />
      </div>
    </main>
  );
}
