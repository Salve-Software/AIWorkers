import fs from 'fs';
import path from 'path';
import boxen from 'boxen';
import { c } from '../banner.js';

const AIWORKERS_DIR = path.join(import.meta.dirname, '..', '..');

function copyDir(srcDir, destDir, label) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`  ${c.bold}${label}${c.reset}`);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dest = path.join(destDir, entry.name);
    fs.cpSync(path.join(srcDir, entry.name), dest, { recursive: true, force: true });
    console.log(`    ${c.green}✓${c.reset} ${entry.name}`);
  }
}

function copyFiles(srcDir, destDir, label) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`  ${c.bold}${label}${c.reset}`);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.name.endsWith('.md')) continue;
    fs.copyFileSync(path.join(srcDir, entry.name), path.join(destDir, entry.name));
    console.log(`    ${c.green}✓${c.reset} ${entry.name}`);
  }
}

function updateClaudeMd(claudeMd, rulesDir) {
  if (!fs.existsSync(claudeMd)) fs.writeFileSync(claudeMd, '');

  const current = fs.readFileSync(claudeMd, 'utf8');
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
    fs.appendFileSync(claudeMd, prefix + lines.join('\n') + '\n');
  }
}

export function setup(targetDir) {
  const resolvedTarget = targetDir ?? process.env.INIT_CWD ?? process.cwd();
  const claudeDir = path.join(resolvedTarget, '.claude');
  const claudeMd = path.join(claudeDir, 'CLAUDE.md');

  fs.mkdirSync(claudeDir, { recursive: true });
  console.log(`${c.dim}  Copying to ${claudeDir}${c.reset}\n`);

  copyDir(path.join(AIWORKERS_DIR, 'src', 'commands'), path.join(claudeDir, 'commands', 'aiworkers'), 'Commands');
  console.log();
  copyDir(path.join(AIWORKERS_DIR, 'src', 'skills'), path.join(claudeDir, 'skills', 'aiworkers'), 'Skills');
  console.log();
  copyFiles(path.join(AIWORKERS_DIR, 'src', 'agents'), path.join(claudeDir, 'agents', 'aiworkers'), 'Agents');
  console.log();
  copyFiles(path.join(AIWORKERS_DIR, 'src', 'rules'), path.join(claudeDir, 'rules', 'aiworkers'), 'Rules');
  console.log();
  updateClaudeMd(claudeMd, path.join(AIWORKERS_DIR, 'src', 'rules'));

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
