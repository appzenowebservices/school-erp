'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Shared markdown renderer for AI-generated learning content.
// Tables (worksheets, study plans) need remark-gfm. No raw HTML allowed.
export default function Markdown({ text }) {
  return (
    <div className="ai-md text-sm text-gray-800 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-lg font-bold text-[#0f345a] mt-3 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold text-[#0f345a] mt-3 mb-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold text-[#15487d] mt-2 mb-1">{children}</h3>,
          p: ({ children }) => <p className="my-1.5">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-1.5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-1.5 space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="w-full text-[13px] border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border border-gray-200 bg-[#f3f9ff] px-2 py-1.5 text-left font-semibold">{children}</th>,
          td: ({ children }) => <td className="border border-gray-200 px-2 py-1.5 align-top">{children}</td>,
          code: ({ children }) => <code className="bg-gray-100 rounded px-1 text-[12px] font-mono">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 rounded-xl p-3 overflow-x-auto text-[12px] my-2">{children}</pre>,
          hr: () => <hr className="my-3 border-gray-200" />,
        }}
      >
        {text || ""}
      </ReactMarkdown>
      <style>{`@media print {
        body * { visibility: hidden; }
        .print-area, .print-area * { visibility: visible; }
        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
      }`}</style>
    </div>
  );
}
