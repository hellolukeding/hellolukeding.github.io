import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { classNames } from "src/utils/classNames";
import { createATA } from "./ata";
import styles from "./index.module.scss";

interface EditorProps {
  className?: string;
  onChange?: (val?: string) => void;
}

const Editor: React.FC<EditorProps> = (props) => {
  const code = `
  const logStr=(str:string)=>{
    console.log(str);
  };
  logStr("hello world");
  `;

  const handleEditorMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });
    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  };

  return (
    <MonacoEditor
      className={classNames(styles["editor"], props?.className ?? "")}
      path={"luke.tsx"}
      language={"typescript"}
      onMount={handleEditorMount}
      value={code}
      theme="vs-dark"
      onChange={(value) => {
        props?.onChange && props.onChange(value);
      }}
      options={{
        fontSize: 16,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
};

export default Editor;
