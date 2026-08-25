// verify-worktrees.ts
// Script that creates a git worktree for each agent, writes a unique fixture file,
// commits it, verifies that fixtures are isolated between worktrees, then cleans up.

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

function run(cmd: string) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: "inherit" });
}

function ensureGit() {
  try {
    execSync("git --version", { stdio: "ignore" });
  } catch {
    console.error("Git is not installed. Please install Git before running this script.");
    process.exit(1);
  }
}

function createWorktree(agent: string): { worktreePath: string; branch: string } {
  const timestamp = Date.now();
  const branch = `${agent}-${timestamp}`;
  const worktreePath = path.resolve('.worktrees', branch);
  // Ensure parent directory exists
  fs.mkdirSync(path.dirname(worktreePath), { recursive: true });
  // Create a new branch and attach a worktree
  run(`git worktree add -b ${branch} ${worktreePath} HEAD`);
  return { worktreePath, branch };
}

function writeFixture(worktreePath: string, agent: string) {
  const fixturePath = path.join(worktreePath, `fixture_${agent}.txt`);
  const content = `Fixture for ${agent} at ${new Date().toISOString()}`;
  fs.writeFileSync(fixturePath, content, { encoding: "utf8" });
  return fixturePath;
}

function commitFixture(worktreePath: string, fixturePath: string, agent: string) {
  const relativePath = path.relative(worktreePath, fixturePath);
  run(`git -C ${worktreePath} add ${relativePath}`);
  run(`git -C ${worktreePath} commit -m "Add fixture for ${agent}"`);
}

function verifyIsolation(worktrees: Record<string, string>, agent: string, fixturePath: string) {
  // Ensure the fixture exists only in its own worktree
  for (const [otherAgent, otherPath] of Object.entries(worktrees)) {
    if (otherAgent === agent) continue;
    const otherFixture = path.join(otherPath, `fixture_${agent}.txt`);
    if (fs.existsSync(otherFixture)) {
      console.error(`Isolation failure: fixture for ${agent} found in ${otherAgent}'s worktree.`);
      process.exit(1);
    }
  }
  console.log(`Isolation verified for ${agent}.`);
}

function cleanWorktree(worktreePath: string, fixturePath: string) {
  // Remove the fixture file and commit the deletion
  const relativePath = path.relative(worktreePath, fixturePath);
  if (fs.existsSync(fixturePath)) {
    fs.unlinkSync(fixturePath);
    run(`git -C ${worktreePath} rm ${relativePath}`);
    run(`git -C ${worktreePath} commit -m "Remove fixture"`);
  }
}

function removeWorktree(worktreePath: string, branch: string) {
  // Remove the worktree and delete the temporary branch
  run(`git worktree remove ${worktreePath} --force`);
  // Delete the branch (may already be merged, but force delete to be safe)
  run(`git branch -D ${branch}`);
  // Delete the directory if it still exists
  if (fs.existsSync(worktreePath)) {
    fs.rmSync(worktreePath, { recursive: true, force: true });
  }
}

function main() {
  ensureGit();
  const agents = ["expo-builder", "supabase-engineer", "product-logic", "qa"];
  const worktreeInfo: Record<string, { path: string; branch: string }> = {};

  console.log("Creating worktrees for each agent...");
  for (const agent of agents) {
    const { worktreePath, branch } = createWorktree(agent);
    worktreeInfo[agent] = { path: worktreePath, branch };
    console.log(`Worktree for ${agent}: ${worktreePath} (branch ${branch})`);
  }

  // Write and commit fixtures
  for (const agent of agents) {
    const { path: wp } = worktreeInfo[agent];
    const fixture = writeFixture(wp, agent);
    commitFixture(wp, fixture, agent);
    console.log(`Committed fixture for ${agent}.`);
  }

  // Verify isolation
  for (const agent of agents) {
    const { path: wp } = worktreeInfo[agent];
    const fixture = path.join(wp, `fixture_${agent}.txt`);
    const otherWorktrees: Record<string, string> = {};
    for (const [a, info] of Object.entries(worktreeInfo)) {
      otherWorktrees[a] = info.path;
    }
    verifyIsolation(otherWorktrees, agent, fixture);
  }

  // Clean up worktrees
  console.log("Cleaning up worktrees...");
  for (const agent of agents) {
    const { path: wp, branch } = worktreeInfo[agent];
    const fixture = path.join(wp, `fixture_${agent}.txt`);
    cleanWorktree(wp, fixture);
    removeWorktree(wp, branch);
    console.log(`Cleaned and removed worktree for ${agent}.`);
  }

  console.log("All worktree isolation tests completed successfully.");
}

main();
