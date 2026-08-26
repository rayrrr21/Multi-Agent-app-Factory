// worktree-test.ts
// Script to verify that multiple agents can work in parallel using git worktrees
// Creates worktrees for Expo Builder, Supabase Engineer, Product Logic, and QA agents.
// It checks that each worktree can create a temporary file without lock collisions,
// then cleans up the worktrees.

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

function runCommand(cmd: string) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: "inherit" });
}

function ensureGit() {
  try {
    execSync("git --version", { stdio: "ignore" });
  } catch {
    console.error("Git is not installed or not in PATH. Install Git first.");
    process.exit(1);
  }
}

function createWorktree(name: string) {
  const worktreePath = path.resolve(".worktrees", name);
  // Ensure parent folder exists
  fs.mkdirSync(path.dirname(worktreePath), { recursive: true });
  // Add worktree on a new branch to avoid conflicts
  runCommand(`git worktree add -B ${name} "${worktreePath}" HEAD`);
  return worktreePath;
}

function testWorktree(path: string) {
  const testFile = path + "/tmp_test.txt";
  fs.writeFileSync(testFile, "test " + Date.now());
  // Stage and commit to ensure git can handle it without lock issues
  runCommand(`git -C "${path}" add tmp_test.txt`);
  // Stage and commit to ensure git can handle it without lock issues
  runCommand(`git -C "${path}" commit -m "Worktree test commit" --allow-empty`);
  // Cleanup the test file
  fs.unlinkSync(testFile);
}

function removeWorktree(name: string) {
  const worktreePath = path.resolve(".worktrees", name);
  // Remove the worktree safely
  runCommand(`git worktree remove ${worktreePath} --force`);
  // Delete the directory if it still exists
  if (fs.existsSync(worktreePath)) {
    fs.rmSync(worktreePath, { recursive: true, force: true });
  }
}

function main() {
  ensureGit();
  const agents = ["expo-builder", "supabase-engineer", "product-logic", "qa"];
  const created: string[] = [];

  console.log("Creating worktrees for agents...");
  for (const agent of agents) {
    const wp = createWorktree(agent);
    created.push(agent);
    console.log(`Created worktree for ${agent} at ${wp}`);
  }

  console.log("Testing each worktree for lock safety...");
  for (const agent of agents) {
    const wp = path.resolve(".worktrees", agent);
    testWorktree(wp);
    console.log(`Worktree ${agent} passed lock test`);
  }

  console.log("Cleaning up worktrees...");
  for (const agent of created) {
    removeWorktree(agent);
    console.log(`Removed worktree ${agent}`);
  }

  console.log("All worktree tests passed.");
}

main();
