import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
interface PreviewerProps {
  code: string;
}

const Previewer: React.FC<PreviewerProps> = (props) => {
  const previewRef = useRef<HTMLIFrameElement>(null);

  // useEffect(() => {
  //   const res = transform(props.code, {
  //     presets: ["react", "typescript"],
  //     filename: "luke.tsx",
  //   });
  //   console.log(res.code);
  //   const url = URL.createObjectURL(
  //     new Blob([res.code as string], { type: "text/javascript" })
  //   );

  //   if (previewRef.current) {
  //     const window = previewRef.current.contentWindow!;
  //     let cusScript: HTMLScriptElement | undefined;
  //     if (window.document.getElementById("cusScript")) {
  //       cusScript = window.document.getElementById(
  //         "cusScript"
  //       ) as HTMLScriptElement;
  //     } else {
  //       cusScript = window.document.createElement("script");
  //       cusScript.type = "module";
  //       cusScript.id = "cusScript";
  //       window.document.body.appendChild(cusScript);
  //     }
  //     cusScript.src = url;
  //   }
  //   // const transformImportSourcePlugin: PluginObj = {
  //   //   visitor: {
  //   //     ImportDeclaration(path) {
  //   //       path.node.source.value = url;
  //   //     },
  //   //   },
  //   // };
  // }, [props.code]);

  useEffect(() => {
    if (previewRef.current) {
      //根节点
      const rootDiv = previewRef.current.contentDocument!.createElement("div");
      rootDiv.setAttribute("id", "root");
      rootDiv.innerHTML = ` 
      <div style="position:absolute;color:white;font-size: 20px;top: 0;left:0;width:100%;height:100%;display: flex;justify-content: center;align-items: center;">
      Loading...
    </div>
    `;

      previewRef.current.contentDocument!.body.appendChild(rootDiv);
      //引入react
      const script =
        previewRef.current.contentDocument?.createElement("script")!;
      script.setAttribute("type", "importmap");
      script.innerHTML = JSON.stringify({
        imports: {
          react: "https://esm.sh/react@18.2.0",
          "react-dom/client": "https://esm.sh/react-dom@18.2.0",
        },
      });
      previewRef.current.contentDocument?.body.appendChild(script);
      //test
      const testScript =
        previewRef.current.contentDocument?.createElement("script")!;
      testScript.setAttribute("type", "module");
      testScript.innerHTML = `
      import React from 'react';
      import ReactDOM from 'react-dom';
      console.log(React, ReactDOM)
      const App = () => {
        return React.createElement('div', null, 'Hello World');
      }
      ReactDOM.render(React.createElement(App), document.getElementById('root'));

      `;
      previewRef.current.contentDocument?.body.appendChild(testScript);
    }
  }, []);
  return (
    <>
      <iframe title="Preview" className={styles.preview} ref={previewRef} />
    </>
  );
};

export default Previewer;
