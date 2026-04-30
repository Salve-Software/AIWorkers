import fs from 'fs';
import path from 'path';
import boxen from 'boxen';
import { c } from '../banner.js';

const isWindows = process.platform === 'win32';

const AIWORKERS_DIR = path.join(import.meta.dirname, '..', '..');
const TARGET_DIR = process.env.INIT_CWD || process.cwd();
const CLAUDE_DIR = path.join(TARGET_DIR, '.claude');
const CLAUDE_MD = path.join(CLAUDE_DIR, 'CLAUDE.md');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function symlink(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.symlinkSync(src, dest, isWindows ? 'junction' : 'dir');
}

function linkDir(srcDir, destDir, label) {
  ensureDir(destDir);
  console.log(`  ${c.bold}${label}${c.reset}`);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    symlink(src, dest);
    console.log(`    ${c.green}✓${c.reset} ${entry.name}`);
  }
}

function linkFiles(srcDir, destDir, label) {
  ensureDir(destDir);
  console.log(`  ${c.bold}${label}${c.reset}`);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.name.endsWith('.md')) continue;
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (isWindows) {
      fs.copyFileSync(src, dest);
    } else {
      symlink(src, dest);
    }
    console.log(`    ${c.green}✓${c.reset} ${entry.name}`);
  }
}

function updateClaudeMd(rulesDir) {
  ensureDir(CLAUDE_DIR);
  if (!fs.existsSync(CLAUDE_MD)) fs.writeFileSync(CLAUDE_MD, '');

  const current = fs.readFileSync(CLAUDE_MD, 'utf8');
  const entries = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));
  const lines = [];

  console.log(`  ${c.bold}CLAUDE.md${c.reset}`);
  for (const name of entries) {
    const line = `@rules/aiworkers/${name}`;
    if (!current.includes(line)) {
      lines.push(line);
      console.log(`    ${c.green}✓${c.reset} Added import: ${c.dim}${line}${c.reset}`);
    } else {
      console.log(`    ${c.gray}—${c.reset} Already imported: ${c.dim}${line}${c.reset}`);
    }
  }

  if (lines.length > 0) {
    const prefix = current.length > 0 && !current.endsWith('\n') ? '\n' : '';
    fs.appendFileSync(CLAUDE_MD, prefix + lines.join('\n') + '\n');
  }
}

export function setup() {
  console.log(`${c.dim}  Linking to ${CLAUDE_DIR}${c.reset}\n`);

  linkDir(path.join(AIWORKERS_DIR, 'src', 'commands'), path.join(CLAUDE_DIR, 'commands', 'aiworkers'), 'Commands');
  console.log();
  linkDir(path.join(AIWORKERS_DIR, 'src', 'skills'), path.join(CLAUDE_DIR, 'skills', 'aiworkers'), 'Skills');
  console.log();
  linkFiles(path.join(AIWORKERS_DIR, 'src', 'agents'), path.join(CLAUDE_DIR, 'agents', 'aiworkers'), 'Agents');
  console.log();
  linkFiles(path.join(AIWORKERS_DIR, 'src', 'rules'), path.join(CLAUDE_DIR, 'rules', 'aiworkers'), 'Rules');
  console.log();
  updateClaudeMd(path.join(AIWORKERS_DIR, 'src', 'rules'));

  console.log(boxen(
    `${c.green}${c.bold}Done!${c.reset} AIWorkers is ready in this project.\n\n` +
    `${c.bold}What's next:${c.reset}\n` +
    `  ${c.cyan}1.${c.reset} Open Claude Code in this project\n` +
    `  ${c.cyan}2.${c.reset} Type ${c.bold}/feature${c.reset} to build a feature with the PDCA workflow\n` +
    `  ${c.cyan}3.${c.reset} Type ${c.bold}/rn-component${c.reset} to scaffold a React Native component\n` +
    `  ${c.cyan}4.${c.reset} Commit and push — Claude handles branching, commits, and PRs`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'green',
    }
  ));
}
