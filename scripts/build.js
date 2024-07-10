const env = require("minimist")(process.argv.slice(2))["env"] ?? "dev";
const {parse} = require("yaml");
const path = require("path");
const fs = require("fs");
const md = require("./md");

const COMMON_CONFIG_PATH = path.join(process.cwd(), "./.config/.common.yaml");
const COMMON_CONFIG_FILE = fs.readFileSync(COMMON_CONFIG_PATH, "utf-8");
const COMMON_CONFIG = parse(COMMON_CONFIG_FILE);

const ENV_CONFIG_PATH = path.join(process.cwd(), `./.config/.${env}.yaml`);
const ENV_CONFIG_FILE = fs.readFileSync(ENV_CONFIG_PATH, "utf-8");
const ENV_CONFIG = parse(ENV_CONFIG_FILE);

const _config = {
  ...COMMON_CONFIG,
  ...ENV_CONFIG,
  build_time: new Date().toLocaleString(),
  blogs: md(),
}

try {
  fs.writeFileSync(
    path.join(process.cwd(), "./public/js/config.js"),
    `
    window.config=${JSON.stringify(_config)};
    console.log(\`%c lukeding builds in \$\{window.config.build_time\}\`, "color: #fff; font-size: 12px;border-radius: 2px; background: #2ECC71; padding: 2px 4px;")
    `
  )
} catch(err) {
  console.log(err);
}