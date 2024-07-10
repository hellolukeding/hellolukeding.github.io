import React from "react";
import { classNames } from "src/utils/classNames";
import styles from "./index.module.scss";
export interface CardProps {
  id: string;
  x: number;
  y: number;
  label: string;
  type: string;
  nodes: {
    type: string;
    level: number;
    enumType: string;
    color: string;
    slot?: string;
    label?: string;
  }[];
  titleBarColor: string[];
}

export const drawCards = (ref: React.RefObject<SVGAElement>, cards: CardProps[]) => {
  if (!ref.current) return;
  const cardsContainer = ref.current;
  cardsContainer.innerHTML = "";
  cards.forEach((card) => {
    //创建标题栏渐变色
    const defs = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "defs"
    );
    const linearGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    linearGradient.setAttribute("id", `titleGradient-${card.id}`);
    linearGradient.setAttribute("x1", "0%"); // 渐变起点的x坐标
    linearGradient.setAttribute("y1", "100%"); // 渐变起点的y坐标
    linearGradient.setAttribute("x2", "100%"); // 渐变终点的x坐标
    linearGradient.setAttribute("y2", "0%"); // 渐变终点的y坐标
    const stop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    stop1.setAttribute("offset", "10%");
    stop1.setAttribute(
      "style",
      `stop-color: ${card.titleBarColor[0]}; stop-opacity: 1`
    );
    linearGradient.appendChild(stop1);

    const stop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute(
      "style",
      `stop-color: ${card.titleBarColor[1]}; stop-opacity: 1`
    );
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    cardsContainer.appendChild(defs);

    const nodeSpacing = 50;
    const topBottomPadding = 20;
    const titleBarHeight = 30; // 标题栏高度
    const maxLevel =
      Math.max(...card.nodes.map((node) => node.level)) + 1;
    const cardHeight =
      maxLevel * nodeSpacing + topBottomPadding * 2 + titleBarHeight;

    const group = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    group.setAttribute("class", "card-container");
    group.setAttribute("data-id", card.id);
    group.setAttribute("user-select", "none");
    group.setAttribute("transform", `translate(${card.x},${card.y})`);

    const rect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    rect.setAttribute("fill", "#222");
    rect.setAttribute("width", "150");
    rect.setAttribute("height", `${cardHeight}`);
    rect.setAttribute("rx", "10");
    rect.setAttribute("ry", "10");
    group.appendChild(rect);

    // 使用path绘制带有指定圆角的矩形
    // 创建标题栏
    const titleBarWidth = 150;
    const borderRadius = 10; // 圆角大小
    const titleBar = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    const dValue = `M 0,${borderRadius}
          a ${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius}
          h ${titleBarWidth - borderRadius * 2}
          a ${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius}
          v ${titleBarHeight - borderRadius}
          h -${titleBarWidth}
          z`;

    titleBar.setAttribute("class", classNames(styles.card, "draggable"));
    titleBar.setAttribute("d", dValue);
    titleBar.setAttribute("fill", `url(#titleGradient-${card.id})`);
    group.appendChild(titleBar);

    const text = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text.setAttribute("x", `${titleBarWidth / 2}`);
    text.setAttribute("y", `${titleBarHeight / 2}`);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("class", styles["card-title"]);
    text.textContent = card.label;
    group.appendChild(text);

    card.nodes.forEach((node, index) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("class", styles.node);
      circle.setAttribute("cx", node.type === "in" ? "0" : "150");
      circle.setAttribute(
        "cy",
        (topBottomPadding +
          titleBarHeight +
          (node.level + 1) * nodeSpacing -
          nodeSpacing / 2) + ""
      );
      circle.setAttribute("r", "7");
      circle.setAttribute("fill", node.color);
      circle.setAttribute("data-card-id", card.id);
      circle.setAttribute("data-node-id", `${card.id}-node${index + 1}`);
      group.appendChild(circle);

      if (node.label !== undefined) {
        // 计算文本标签的位置
        let labelX = node.type === "in" ? 15 : 135; // 基本的X坐标
        const labelY =
          topBottomPadding +
          titleBarHeight +
          node.level * nodeSpacing +
          40;

        // 创建SVG文本元素
        const nodeLabel = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        nodeLabel.setAttribute("x", labelX + "");
        nodeLabel.setAttribute("y", labelY + ""); // 在节点下方留出一定空间
        nodeLabel.setAttribute("text-anchor", "middle"); // 文本居中对齐
        nodeLabel.setAttribute("fill", "#aaa"); // 文本居中对齐
        nodeLabel.setAttribute("alignment-baseline", "hanging");
        nodeLabel.setAttribute("class", styles["node-label"]);
        nodeLabel.textContent = node.label;

        // 计算文本的宽度（假定的，因为SVG没有直接获取文本宽度的方法）
        const estimatedTextLength = node.label.length * 10; // 估算每个字符6像素宽

        // 确保文本不会超出卡片右边界
        if (labelX + estimatedTextLength / 2 > 150) {
          labelX = 150 - estimatedTextLength / 2;
          nodeLabel.setAttribute("x", labelX + "");
        }

        // 确保文本不会超出卡片左边界
        if (labelX - estimatedTextLength / 2 < 0) {
          labelX = estimatedTextLength / 2;
          nodeLabel.setAttribute("x", labelX + "");
        }

        group.appendChild(nodeLabel);
      }

      switch (node.slot) {
        case "input":
          const foreignObject = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "foreignObject"
          );
          foreignObject.setAttribute("x", "10");
          foreignObject.setAttribute(
            "y",
            (topBottomPadding +
              titleBarHeight +
              node.level * nodeSpacing +
              12) + ""
          );
          foreignObject.setAttribute("width", 130 + ""); // 保持原始宽度
          foreignObject.setAttribute("height", nodeSpacing - 24 + ""); // 保持原始高度，减去的24像素为上下内边距之和
          foreignObject.setAttribute("class", styles["card-input-container"]);
          const input = document.createElement("input");
          input.type = "text";
          //@ts-ignore
          input.value = node.value;

          input.addEventListener("input", function () {
            //@ts-ignore
            node.value = input.value;
          });
          input.setAttribute("class", styles["card-input"]);

          // Change border color on focus and blur
          input.addEventListener("focus", () => {
            input.style.outline = "none"; // Remove default focus outline
            input.style.borderColor = "white"; // Keep border color white on focus
          });

          input.addEventListener("blur", () => {
            input.style.borderColor = "white"; // Revert to white when not focused
          });

          // 阻止事件冒泡
          input.addEventListener("click", function (event) {
            event.stopPropagation();
          });

          input.addEventListener("mousedown", function (event) {
            event.stopPropagation();
          });

          input.addEventListener("touchstart", function (event) {
            event.stopPropagation();
          });

          foreignObject.appendChild(input);
          group.appendChild(foreignObject);
          break;
      }
    });
    const deleteIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    deleteIcon.setAttribute("class", "card-delete-icon");
    deleteIcon.setAttribute("x", "125");
    deleteIcon.setAttribute("y", "5"); // 使其贴近标题栏的右上角
    deleteIcon.setAttribute("width", "20");
    deleteIcon.setAttribute("height", "20");
    deleteIcon.setAttribute("fill", "transparent");
    deleteIcon.setAttribute("data-card-id", card.id);
    deleteIcon.setAttribute("style", "cursor: pointer;");
    group.appendChild(deleteIcon);

    const delText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    delText.setAttribute("x", "135");
    delText.setAttribute("y", "20"); // 调整位置以垂直居中
    delText.setAttribute("text-anchor", "middle");
    delText.setAttribute("fill", "white");
    delText.setAttribute("font-size", "16px"); // 适当调整字体大小以适应图标
    delText.setAttribute("pointer-events", "none"); // 确保点击事件只触发于删除图标上
    delText.textContent = "×";
    group.appendChild(delText);

    cardsContainer.appendChild(group);
  })

}

export interface LinkProps {
  source: {
    x: number;
    y: number;
    enumType: string;
    color: string;
  };
  target: {
    x: number;
    y: number;
    enumType: string;
    color: string;
  };
}

export const drawLinks1 = (ref: React.RefObject<SVGAElement>, links: LinkProps[]) => {
  if (!ref.current) return;
  const linksContainer = ref.current;
  linksContainer.innerHTML = "";
  // 清除旧的删除图标
  document
    .querySelectorAll(".delete-icon")
    .forEach((icon) => icon.remove());

  links.forEach((link) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", styles.link);
    path.setAttribute("stroke", link.target.color);
    path.setAttribute("stroke-width", "5");
    path.setAttribute("fill", "none");

    const isCallType = link.source.enumType === "call";
    if (isCallType) {
      path.setAttribute("stroke-dasharray", "10");
      path.setAttribute("stroke-dashoffset", "0");

      // Add animation element to the path for dashed lines
      const animate = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );
      animate.setAttribute("attributeName", "stroke-dashoffset");
      animate.setAttribute("dur", "0.5s");
      animate.setAttribute("repeatCount", "indefinite");
      animate.setAttribute("from", "20");
      animate.setAttribute("to", "0");
      path.appendChild(animate);
    }

    // 根据源点和终点的X坐标差异动态计算控制点的距离
    let dist;
    if (link.source.x - link.target.x > 0) {
      dist = 200; // 如果终点在源点的左侧，控制点距离更远
    } else {
      dist = Math.abs(link.target.x - link.source.x) * 0.3; // 否则，根据两点间的距离调整控制点距离
    }

    // 使用动态计算的控制点距离来定义曲线
    const d = `M${link.source.x} ${link.source.y} C${link.source.x + dist
      } ${link.source.y} ${link.target.x - dist} ${link.target.y} ${link.target.x
      } ${link.target.y}`;
    path.setAttribute("d", d);
    linksContainer.appendChild(path);

    // 计算中点
    const midX = (link.source.x + link.target.x) / 2;
    const midY = (link.source.y + link.target.y) / 2;

    // 绘制删除图标
    const deleteIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    deleteIcon.setAttribute("class", "delete-icon");
    deleteIcon.setAttribute("cx", midX + "");
    deleteIcon.setAttribute("cy", midY + "");
    deleteIcon.setAttribute("style", "cursor: pointer;");
    deleteIcon.setAttribute("r", 10 + "");
    deleteIcon.setAttribute("fill", "red");
    //@ts-ignore
    deleteIcon.setAttribute("data-link-level", index); // 用于标识该删除图标对应的线
    linksContainer.appendChild(deleteIcon);

    // 可以选择添加一个×文本在圆圈中间
    const text = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text.setAttribute("x", midX + "");
    text.setAttribute("y", midY + 5 + ""); // 轻微调整以垂直居中
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "15px");
    text.setAttribute("pointer-events", "none"); // 确保点击事件只触发于圆圈上
    text.textContent = "×";
    linksContainer.appendChild(text);
  });
}

export const attachEventListeners = () => {
  const cardTitles = document.querySelectorAll(".draggable") ?? [] as unknown as NodeListOf<SVGElement>;
  const rect = (document.getElementById("global-canvas") as HTMLElement).getBoundingClientRect();
  cardTitles.forEach((title) => {
    (() => {
      /*---------------------------------------  ------------------------------------------*/
      const card = title.parentNode as SVGElement;
      let isDragging = false;
      let mouseInitX = 0;
      let mouseInitY = 0;
      let offsetX = 0;
      let offsetY = 0;
      let initialX = 0;
      let initialY = 0;
      /*---------------------------------------  ------------------------------------------*/
      const init = () => {
        const transform = card.getAttribute("transform");
        if (transform) {
          const match = transform.match(/translate\((\d+),(\d+)\)/);
          if (match) {
            initialX = parseInt(match[1]);
            initialY = parseInt(match[2]);
          }
        }
      }


      const startDrag = (e: MouseEvent) => {
        mouseInitX = e.clientX;
        mouseInitY = e.clientY;
        isDragging = true;
        title.setAttribute("style", "cursor: grabbing");
        init();
      };

      const drag = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        offsetX = e.clientX - mouseInitX;
        offsetY = e.clientY - mouseInitY;

        card.setAttribute(
          "transform",
          `translate(${initialX + offsetX},${initialY + offsetY})`
        );
      }

      const stopDrag = (e: Event) => {
        isDragging = false;
        initialX = 0;
        initialY = 0;

        title.setAttribute("style", "cursor: grab");
      }


      /*---------------------------------------  ------------------------------------------*/
      title.addEventListener("mousedown", (e) => startDrag(e as MouseEvent));
      document.addEventListener("mousemove", (e) => drag(e as MouseEvent));
      document.addEventListener("mouseup", (e) => stopDrag(e));
      //todo 移动card，连接线同时跟着移动
    })()

  });
}

//绘制连接线
export const drawLinks = (ref: React.RefObject<SVGAElement>, links: LinkProps[]) => {

  if (!ref.current) return;
  ref.current.innerHTML = "";
  //来自外部
  links.forEach(link => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("class", styles["link-line"]);
    line.setAttribute("stroke", link.source.color);
    line.setAttribute("stroke-width", "5");
    line.setAttribute("fill", "none");
    const d = `M${link.source.x} ${link.source.y} L${link.target.x} ${link.target.y}`;
    line.setAttribute("d", d);
    ref.current!.appendChild(line);
    //todo:enum-type
  });

  //listen
  (() => {
    let isDrawing = false;
    let tempPath: SVGPathElement | null = null;
    let tempStart = { x: 0, y: 0 };
    let tempEnd = { x: 0, y: 0 };
    const container = document.getElementById("global-canvas")!;
    const topBounding = container?.getBoundingClientRect().top ?? 0;

    container.addEventListener("click", (e) => {
      const startNode = e.target as SVGElement;
      const { nodeId } = startNode.dataset;
      if (nodeId) {
        if (!isDrawing) {
          isDrawing = true;
          const { height, width, x, y } = startNode.getBoundingClientRect();
          const center = { x: x + width / 2, y: y + height / 2 - topBounding };
          tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          ref.current!.appendChild(tempPath);
          tempPath.setAttribute("class", styles["link-line"]);
          tempStart = {
            x: center.x,
            y: center.y
          };
          tempEnd = {
            x: center.x,
            y: center.y
          };
        } else {
          isDrawing = false;
        }
      }
    });

    container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (isDrawing) {
        tempPath?.remove();
        isDrawing = false;
      }
    })
    container.addEventListener("mousemove", (e) => {
      if (isDrawing) {
        const { clientX, clientY } = e;
        tempEnd.x = clientX;
        tempEnd.y = clientY;
        const controlPointX = tempStart.x + (tempEnd.x - tempStart.x) / 2;
        const controlPointY = tempStart.y;
        const d = `M${tempStart.x} ${tempStart.y} Q${controlPointX} ${controlPointY} ${tempEnd.x} ${tempEnd.y - topBounding}`;
        tempPath!.setAttribute("d", d);
      }
    });
  })()
}



