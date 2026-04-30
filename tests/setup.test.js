import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { setup } from '../bin/commands/setup.js';

const AIWORKERS_DIR = path.join(import.meta.dirname, '..');

let tmpDir;

before(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aiworkers-test-'));
});

after(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('aiworkers setup', () => {
  test('creates .claude directory structure', () => {
    setup(tmpDir);

    assert.ok(fs.existsSync(path.join(tmpDir, '.claude')));
    assert.ok(fs.existsSync(path.join(tmpDir, '.claude', 'commands', 'aiworkers')));
    assert.ok(fs.existsSync(path.join(tmpDir, '.claude', 'skills', 'aiworkers')));
    assert.ok(fs.existsSync(path.join(tmpDir, '.claude', 'agents', 'aiworkers')));
    assert.ok(fs.existsSync(path.join(tmpDir, '.claude', 'rules', 'aiworkers')));
  });

  test('links all commands', () => {
    const srcCommands = fs.readdirSync(path.join(AIWORKERS_DIR, 'src', 'commands'));
    const destCommands = fs.readdirSync(path.join(tmpDir, '.claude', 'commands', 'aiworkers'));
    assert.deepEqual(destCommands.sort(), srcCommands.sort());
  });

  test('links all skills', () => {
    const srcSkills = fs.readdirSync(path.join(AIWORKERS_DIR, 'src', 'skills'));
    const destSkills = fs.readdirSync(path.join(tmpDir, '.claude', 'skills', 'aiworkers'));
    assert.deepEqual(destSkills.sort(), srcSkills.sort());
  });

  test('copies all agent files', () => {
    const srcAgents = fs.readdirSync(path.join(AIWORKERS_DIR, 'src', 'agents')).filter(f => f.endsWith('.md'));
    const destAgents = fs.readdirSync(path.join(tmpDir, '.claude', 'agents', 'aiworkers'));
    assert.deepEqual(destAgents.sort(), srcAgents.sort());
  });

  test('copies all rule files', () => {
    const srcRules = fs.readdirSync(path.join(AIWORKERS_DIR, 'src', 'rules')).filter(f => f.endsWith('.md'));
    const destRules = fs.readdirSync(path.join(tmpDir, '.claude', 'rules', 'aiworkers'));
    assert.deepEqual(destRules.sort(), srcRules.sort());
  });

  test('adds rule imports to CLAUDE.md', () => {
    const claudeMd = fs.readFileSync(path.join(tmpDir, '.claude', 'CLAUDE.md'), 'utf8');
    const srcRules = fs.readdirSync(path.join(AIWORKERS_DIR, 'src', 'rules')).filter(f => f.endsWith('.md'));

    for (const name of srcRules) {
      assert.ok(claudeMd.includes(`@rules/aiworkers/${name}`), `Missing import for ${name}`);
    }
  });

  test('running setup twice does not duplicate imports in CLAUDE.md', () => {
    setup(tmpDir);

    const claudeMd = fs.readFileSync(path.join(tmpDir, '.claude', 'CLAUDE.md'), 'utf8');
    const srcRules = fs.readdirSync(path.join(AIWORKERS_DIR, 'src', 'rules')).filter(f => f.endsWith('.md'));

    for (const name of srcRules) {
      const line = `@rules/aiworkers/${name}`;
      const count = claudeMd.split(line).length - 1;
      assert.equal(count, 1, `Import for ${name} appears ${count} times, expected 1`);
    }
  });
});
