import { useEffect, useState } from "react";
import {
  MaterialSymbolsDarkMode,
  MaterialSymbolsNightlightBadge,
} from "./icons";
import styles from "./index.module.scss";
interface ThemeChangerProps {}

const ThemeChanger: React.FC<ThemeChangerProps> = (props) => {
  const [trigger, setTrigger] = useState(false);

  const handleThemeChange = () => {
    if (trigger) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  };

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }, []);
  return (
    <menu
      className={styles["main"]}
      onClick={(e) => {
        e.stopPropagation();
        setTrigger(!trigger);
        handleThemeChange();
      }}
    >
      {trigger ? (
        <MaterialSymbolsDarkMode />
      ) : (
        <MaterialSymbolsNightlightBadge />
      )}
    </menu>
  );
};

export default ThemeChanger;
