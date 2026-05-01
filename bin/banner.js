import figlet from 'figlet';
import boxen from 'boxen';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  cyan:   '\x1b[36m',
  yellow: '\x1b[33m',
  gray:   '\x1b[90m',
};

export function banner() {
  const ascii = figlet.textSync('AIWorkers', { font: 'Slant' });
  const content = `${c.cyan}${ascii}${c.reset}\n  ${c.dim}v${pkg.version} · Claude Code configurations for every project${c.reset}`;
  console.log(boxen(content, {
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderStyle: 'round',
    borderColor: 'cyan',
    dimBorder: true,
  }));
  console.log();
}
