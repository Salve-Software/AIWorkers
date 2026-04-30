#!/usr/bin/env node

import { createRequire } from 'module';
import boxen from 'boxen';
import { banner, c } from './banner.js';
import { setup } from './commands/setup.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const command = process.argv[2];

if (command === 'setup') {
  banner();
  setup();
} else if (command === '--version' || command === '-v') {
  console.log(pkg.version);
} else if (!command || command === '--help' || command === '-h') {
  banner();
  console.log(boxen(
    `${c.bold}Usage:${c.reset}  aiworkers <command>\n\n` +
    `${c.bold}Commands:${c.reset}\n\n` +
    `  ${c.cyan}setup${c.reset}      Link AIWorkers into the current project's .claude/ folder\n` +
    `  ${c.cyan}--version${c.reset}  Print the installed version\n` +
    `  ${c.cyan}--help${c.reset}     Show this help message\n\n` +
    `${c.bold}Example:${c.reset}\n\n` +
    `  cd my-project\n` +
    `  aiworkers setup`,
    {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      dimBorder: true,
    }
  ));
  console.log();
} else {
  console.error(`\n  ${c.yellow}Unknown command:${c.reset} ${command}\n`);
  process.exit(1);
}
