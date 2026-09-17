// Fails when an em dash or en dash appears in anything a user can see.
// The product rule is plain punctuation everywhere: commas, colons and full stops.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const targets = ["src", "package.json", "README.md", "CHANGELOG.md"];
const pattern = /[–—]/;

function* walk(path) {
  const stats = statSync(path, { throwIfNoEntry: false });
  if (!stats) return;
  if (stats.isDirectory()) {
    for (const entry of readdirSync(path)) yield* walk(join(path, entry));
  } else {
    yield path;
  }
}

const offenders = [];
for (const target of targets) {
  for (const file of walk(join(root, target))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (pattern.test(line)) offenders.push(`${relative(root, file)}:${index + 1}: ${line.trim()}`);
    });
  }
}

if (offenders.length > 0) {
  console.error("Em or en dashes found. Replace them with a comma, colon, full stop or brackets:\n");
  for (const offender of offenders) console.error(`  ${offender}`);
  process.exit(1);
}
console.log("No em or en dashes found.");
