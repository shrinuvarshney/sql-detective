import { useState } from 'react';
import { TableSchema } from '../types';
import { Database, ChevronDown, ChevronRight, Hash, Type } from 'lucide-react';

interface SchemaExplorerProps {
  schema: TableSchema[];
  onTokenClick?: (token: string) => void;
}

export default function SchemaExplorer({ schema, onTokenClick }: SchemaExplorerProps) {
  const [openTables, setOpenTables] = useState<{ [key: string]: boolean }>(() => {
    // Open the first table by default
    if (schema.length > 0) {
      return { [schema[0].name]: true };
    }
    return {};
  });

  const toggleTable = (tableName: string) => {
    setOpenTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  return (
    <div id="schema-explorer" className="flex flex-col space-y-3 bg-[#161B22] border border-[#30363D] rounded-xl p-4 shadow-md">
      <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider">
        <Database className="w-4 h-4 text-blue-500 animate-pulse" />
        <span>SCHEMA EXPLORER</span>
      </div>

      <div className="space-y-3">
        {schema.map((table) => {
          const isOpen = openTables[table.name];
          return (
            <div key={table.name} className="font-mono text-[12px] bg-[#0D1117] border border-[#30363D] rounded-lg overflow-hidden transition-all duration-200 hover:border-[#444c56]">
              {/* Table Header Accordion Toggle */}
              <div
                id={`table-toggle-${table.name}`}
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#161B22]/50 transition duration-150 cursor-pointer group select-none"
                onClick={() => toggleTable(table.name)}
              >
                <div className="flex items-center space-x-2 font-mono text-xs font-bold text-blue-300">
                  <span className="text-blue-500 text-[10px] w-3 text-center">
                    {isOpen ? '▼' : '▶'}
                  </span>
                  <span className="hover:text-blue-400 transition">{table.name}</span>
                  <span 
                    title="Insert table name into editor"
                    onClick={(e) => { e.stopPropagation(); onTokenClick?.(table.name); }}
                    className="hidden group-hover:inline-block text-[9px] text-blue-400 bg-blue-500/15 border border-blue-500/35 px-1 py-0.5 rounded hover:bg-blue-500/30 ml-1.5 transition font-semibold"
                  >
                    + INSERT
                  </span>
                </div>
                {table.rowCount !== undefined && (
                  <span className="text-[9px] bg-[#161B22] text-[#8B949E] border border-[#30363D] px-1.5 py-0.5 rounded font-mono">
                    {table.rowCount} rows
                  </span>
                )}
              </div>

              {/* Column Listing */}
              {isOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-[#30363D] divide-y divide-[#30363D]/40 bg-[#0D1117] text-[#8B949E] space-y-0.5">
                  {table.columns.map((col) => (
                    <div 
                      key={col.name} 
                      onClick={() => onTokenClick?.(col.name)}
                      title="Click to insert column into editor"
                      className="flex items-center justify-between py-1.5 px-1.5 text-[11px] font-mono rounded hover:bg-blue-600/10 hover:text-blue-300 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[#8B949E]/60 group-hover:text-blue-400 text-[10px] font-semibold select-none">+</span>
                        <span className="text-[#E6EDF3] group-hover:text-blue-400 font-medium transition-colors">{col.name}</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-[#8B949E]/70 bg-[#161B22] border border-[#30363D]/60 group-hover:border-blue-500/30 px-1 py-0.5 rounded transition-all">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
