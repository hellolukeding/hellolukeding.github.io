import { transform } from "@babel/standalone";
import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
interface PreviewerProps {
  code: string;
}

const Previewer: React.FC<PreviewerProps> = (props) => {
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const res = transform(props.code, {
      presets: ["react", "typescript"],
      filename: "luke.tsx",
    });
    console.log(res.code);
    const url = URL.createObjectURL(
      new Blob([res.code as string], { type: "text/javascript" })
    );
    const previewWindow = previewRef.current!.contentWindow!;
    const getContainer = new Promise<HTMLScriptElement>((resolve, reject) => {
      const timer = setInterval(() => {
        if (previewWindow.document.getElementById("cusScript")) {
          clearInterval(timer);
          resolve(
            previewWindow.document.getElementById(
              "cusScript"
            )! as HTMLScriptElement
          );
        }
      }, 10);
    });
    getContainer.then((container) => {
      container.innerHTML = "";
      container.src = url;
    });
  }, [props.code]);

  useEffect(() => {
    if (previewRef.current) {
      //根节点
      const rootDiv = previewRef.current.contentDocument!.createElement("div");
      rootDiv.setAttribute("id", "root");
      rootDiv.setAttribute(
        "style",
        "display: flex;justify-content: center;align-items: center;width:100%;height:100%;background-color: #333;color: white;"
      );
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
      testScript.setAttribute("id", "cusScript");
      testScript.innerHTML = `
      import React from 'react';
      import { useState } from "react";
      import ReactDOM from 'react-dom/client';
      console.log(React, ReactDOM)
      const App = () => {
        const [num, setNum] = useState(() => {
          const num1 = 1 + 2;
          const num2 = 2 + 3;
          return num1 + num2;
        });
        return React.createElement('div', {
          onClick: () => {
           setNum(prevNum => prevNum + 1)
          }
        },num);
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
