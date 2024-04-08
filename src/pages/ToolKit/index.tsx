import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import {
  CardProps,
  attachEventListeners,
  drawCards,
  drawLinks,
} from "./method";
const ToolKit: React.FC = () => {
  const cardRef = useRef<SVGAElement>(null);
  const linkRef = useRef<SVGAElement>(null);

  useEffect(() => {
    drawCards(cardRef, cards);
    drawLinks(linkRef, []);
    attachEventListeners();
  }, []);
  return (
    <section className={styles.container}>
      <svg className={styles.canvas} id="global-canvas">
        <g ref={linkRef}></g>
        {/* <!-- 用于存放线条 --> */}
        <g ref={cardRef}></g>
        {/* <!-- 用于存放卡片 --> */}
      </svg>
    </section>
  );
};

export default ToolKit;

let cards: CardProps[] = [
  {
    id: "card0",
    x: 0,
    y: 0,
    label: "Start",
    type: "start",
    nodes: [
      {
        type: "out",
        level: 0,
        enumType: "call",
        color: "#fff",
      },
    ],
    titleBarColor: ["#84fab0", "#8fd3f4"],
  },
  {
    id: "card1",
    x: 100,
    y: 200,
    label: "Condition",
    type: "condition",
    nodes: [
      {
        type: "in",
        level: 0,
        enumType: "call",
        color: "#fff",
      },
      {
        type: "in",
        level: 1,
        enumType: "int",
        color: "#28C76F",
        slot: "input",
        label: "int",
      },
      {
        type: "in",
        level: 2,
        enumType: "int",
        color: "#28C76F",
        slot: "input",
        label: "int",
      },
      {
        type: "out",
        level: 0,
        enumType: "call",
        color: "#fff",
      },
      {
        type: "out",
        level: 1,
        enumType: "bool",
        color: "#0396FF",
        label: "bool",
      },
    ],
    titleBarColor: ["#fccb90", "#d57eeb"],
  },
  {
    id: "card2",
    x: 300,
    y: 400,
    label: "ToString",
    type: "call",
    nodes: [
      {
        type: "in",
        level: 0,
        enumType: "call",
        color: "#fff",
      },
      {
        type: "in",
        level: 1,
        enumType: "bool",
        color: "#0396FF",
        label: "bool",
      },
      {
        type: "out",
        level: 0,
        enumType: "call",
        color: "#fff",
      },
      {
        type: "out",
        level: 1,
        enumType: "string",
        color: "#DE4313",
        label: "string",
      },
    ],
    titleBarColor: ["#3C8CE7", "#00EAFF"],
  },
  {
    id: "card3",
    x: 100,
    y: 300,
    label: "Print",
    type: "print",
    nodes: [
      {
        type: "in",
        level: 0,
        enumType: "call",
        color: "#fff",
      },
      {
        type: "in",
        level: 1,
        enumType: "string",
        color: "#DE4313",
        label: "string",
      },
    ],
    titleBarColor: ["#f6d365", "#fda085"],
  },
];
