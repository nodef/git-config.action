import * as os   from "os";
import * as fs   from "fs";
import * as cp   from "child_process";
import * as core from "@actions/core";
import {dirname, join} from "path";


// Globals.
const E = process.env;


// Read a file and normalize line endings to LF.
function readFile(pth: string): string {
  if (!fs.existsSync(pth)) return "";
  var d = fs.readFileSync(pth, "utf8");
  return d.replace(/\r\n?/g, "\n");
}
// Write a file and normalize line endings to the current OS.
function writeFile(pth: string, d: string): void {
  d = d.replace(/\r\n?|\n/g, os.EOL);
  fs.writeFileSync(pth, d);
}


// Check if an array has a regex match.
function hasRegex(xs: string[], re: RegExp): boolean {
  for (var x of xs)
    if (re.test(x)) return true;
  return false;
}
// Populate credentials for GitHub from environment variables.
function populateDefaultCredentials(xs: string[]): string[] {
  if (xs.length>0 && !hasRegex(xs, /^(auto|default)$/i)) return xs;
  xs  = xs.filter(r => !/^auto$/i.test(r));
  const GITHUB_TOKEN = E.GH_TOKEN || E.GITHUB_TOKEN || "";
  if  (!GITHUB_TOKEN) return xs;
  xs.push(`https://${GITHUB_TOKEN}:@gist.github.com`);
  xs.push(`https://${GITHUB_TOKEN}:@github.com`);
  return xs;
}
// Populate entries for GitHub from environment variables.
function populateDefaultEntries(xs: string[], credentials: string[]): string[] {
  // const USER_NAME  = E.GIT_AUTHOR_NAME  || E.GIT_COMMITTER_NAME  || E.NAME  || E.USER || "";
  // const USER_EMAIL = E.GIT_AUTHOR_EMAIL || E.GIT_COMMITTER_EMAIL || E.EMAIL || "";
  if (!hasRegex(xs, /credential\.helper/i) && credentials.length>0) xs.push("credential.helper = store");
  // if (!hasRegex(xs, /user\.name/i)  && USER_NAME)  xs.push(`user.name  = ${USER_NAME}`);
  // if (!hasRegex(xs, /user\.email/i) && USER_EMAIL) xs.push(`user.email = ${USER_EMAIL}`);
  return xs;
}


// Fix a credential string.
function fixCredential(x: string): string {
  var rc = /[:=](\w+)\s*$/;
  var rk = /^((?:\w+:)?\/\/)?(\w+:\w*@)?([\s\S]+?)\/?$/;
  var k  = x.replace(rc, ""  ).trim();
  var v  = x.replace(rc, "$1").trim();
  return k.replace(rk, (_, p1, p2, p3) => {
    p1 = !p1 || p1==="//"? "https://" : p1;
    p2 = !p2 && v? `${v}:@` : p2;
    return `${p1}${p2}${p3}`;
  });
}
// Fix an entry (config) string.
function fixEntry(x: string): string {
  var i = x.lastIndexOf("=");
  var k = x.substring(0, i).trim();
  var v = x.substring(i+1) .trim().replace(/[\'\"]([\s\S]+?)[\'\"]/, "$1");
  return `${k} "${v}"`;
}


// Main function.
function main(): void {
  const HOME = E.HOME || E.HOMEPATH || E.USERPROFILE;
  const PATH = E.GIT_CONFIG_GLOBAL  || `${HOME}/.gitconfig`;
  var   path = core.getInput("path") || PATH;
  var  reset = core.getBooleanInput("reset")  || false;
  var credentialsPath = core.getInput("credentials-path") || join(dirname(PATH), ".git-credentials");
  var credentials     = core.getMultilineInput("credentials") || [];
  var entries         = core.getMultilineInput("entries")     || [];
  var gitcredentials  = reset? "" : readFile(credentialsPath);
  credentials = populateDefaultCredentials(credentials);
  entries     = populateDefaultEntries(entries, credentials);
  for (let c of credentials)
    gitcredentials += fixCredential(c) + "\n";
  writeFile(credentialsPath, gitcredentials);
  if (reset) writeFile(path, "");
  for (let e of entries)
    cp.execSync(`git config --file "${path}" ${fixEntry(e)}`);
}
main();
