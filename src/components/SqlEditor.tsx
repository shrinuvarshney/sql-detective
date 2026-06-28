import { useRef, MutableRefObject } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  isLoading: boolean;
  editorRefProp?: MutableRefObject<any>;
}

export default function SqlEditor({
  value,
  onChange,
  onRun,
  onReset,
  isLoading,
  editorRefProp
}: SqlEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    if (editorRefProp) {
      editorRefProp.current = editor;
    }

    // Add keyboard shortcut: Ctrl+Enter or Cmd+Enter to execute SQL query
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    // Custom dark theme to match GitHub Dark / Supabase style
    monaco.editor.defineTheme('detectiveTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'identifier', foreground: '9cdcfe' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#F3F4F6',
        'editorLineNumber.foreground': '#484F58',
        'editorLineNumber.activeForeground': '#58A6FF',
        'editor.lineHighlightBackground': '#161B22',
        'editorCursor.foreground': '#58A6FF',
        'editor.selectionBackground': '#264F78',
      }
    });

    monaco.editor.setTheme('detectiveTheme');

    // Register SQL Autocompletions for database tables and columns
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          // Core Keywords
          {
            label: 'SELECT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'SELECT ',
            range
          },
          {
            label: 'FROM',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'FROM ',
            range
          },
          {
            label: 'WHERE',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'WHERE ',
            range
          },
          {
            label: 'ORDER BY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'ORDER BY ',
            range
          },
          {
            label: 'LIMIT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'LIMIT ',
            range
          },
          {
            label: 'DISTINCT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'DISTINCT ',
            range
          },
          {
            label: 'GROUP BY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'GROUP BY ',
            range
          },
          {
            label: 'HAVING',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'HAVING ',
            range
          },
          {
            label: 'INNER JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'INNER JOIN ',
            range
          },
          {
            label: 'LEFT JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'LEFT JOIN ',
            range
          },
          {
            label: 'ON',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'ON ',
            range
          },
          {
            label: 'AVG',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'AVG(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertRule.InsertAsSnippet,
            range
          },
          {
            label: 'MAX',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'MAX(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertRule.InsertAsSnippet,
            range
          },
          // Table completions
          {
            label: 'suspects',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: 'suspects',
            detail: 'Suspect Logs [id, name, age, occupation, city, bank_balance, car_model]',
            range
          },
          {
            label: 'phone_calls',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: 'phone_calls',
            detail: 'Call Logs [id, caller_id, receiver_id, duration_seconds, timestamp]',
            range
          },
          {
            label: 'crimes',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: 'crimes',
            detail: 'Crime Incidents [id, title, date, location, severity, suspect_id]',
            range
          },
          // Column completions
          { label: 'id', kind: monaco.languages.CompletionItemKind.Field, insertText: 'id', range },
          { label: 'name', kind: monaco.languages.CompletionItemKind.Field, insertText: 'name', range },
          { label: 'age', kind: monaco.languages.CompletionItemKind.Field, insertText: 'age', range },
          { label: 'occupation', kind: monaco.languages.CompletionItemKind.Field, insertText: 'occupation', range },
          { label: 'city', kind: monaco.languages.CompletionItemKind.Field, insertText: 'city', range },
          { label: 'bank_balance', kind: monaco.languages.CompletionItemKind.Field, insertText: 'bank_balance', range },
          { label: 'car_model', kind: monaco.languages.CompletionItemKind.Field, insertText: 'car_model', range },
          { label: 'duration_seconds', kind: monaco.languages.CompletionItemKind.Field, insertText: 'duration_seconds', range },
          { label: 'caller_id', kind: monaco.languages.CompletionItemKind.Field, insertText: 'caller_id', range },
          { label: 'receiver_id', kind: monaco.languages.CompletionItemKind.Field, insertText: 'receiver_id', range },
          { label: 'title', kind: monaco.languages.CompletionItemKind.Field, insertText: 'title', range },
          { label: 'severity', kind: monaco.languages.CompletionItemKind.Field, insertText: 'severity', range },
          { label: 'date', kind: monaco.languages.CompletionItemKind.Field, insertText: 'date', range },
          { label: 'location', kind: monaco.languages.CompletionItemKind.Field, insertText: 'location', range },
          { label: 'timestamp', kind: monaco.languages.CompletionItemKind.Field, insertText: 'timestamp', range },
          { label: 'suspect_id', kind: monaco.languages.CompletionItemKind.Field, insertText: 'suspect_id', range }
        ];

        return { suggestions };
      }
    });
  };

  return (
    <div id="sql-editor-panel" className="flex flex-col h-full rounded-xl bg-[#0D1117] border border-[#30363D] overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0D1117] border-b border-[#30363D]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF7B72]/80" />
          <div className="w-3 h-3 rounded-full bg-[#F0883E]/80" />
          <div className="w-3 h-3 rounded-full bg-[#7EE787]/80" />
          <span className="text-xs font-mono text-gray-400 pl-2">investigation_terminal.sql</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
          <span className="bg-[#161B22] px-2 py-0.5 rounded text-[10px] text-[#58A6FF] font-semibold border border-[#30363D]">
            Ctrl + Enter
          </span>
          <span>to run</span>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 w-full bg-[#0D1117] min-h-[220px]">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex flex-col items-center justify-center h-full text-sm text-gray-400 font-mono space-y-2">
              <RotateCcw className="w-6 h-6 animate-spin text-blue-500" />
              <span>Booting Agency Compiler...</span>
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"Fira Code", ui-monospace, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Editor Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-t border-[#30363D]">
        <button
          id="btn-reset-query"
          onClick={onReset}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-white bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>

        <button
          id="btn-run-query"
          onClick={onRun}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-1.5 rounded bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 disabled:opacity-50 transition cursor-pointer shadow-lg"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isLoading ? 'EXECUTING...' : 'EXECUTE QUERY'}</span>
        </button>
      </div>
    </div>
  );
}
