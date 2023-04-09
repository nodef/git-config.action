const os   = require('os');
const fs   = require('fs');
const cp   = require('child_process');
const core = require('@actions/core');
const {dirname, join} = require('path');


// Globals.
const E = process.env;


// Read a file and normalize line endings to LF.
function readFile(pth) {
  var d = fs.readFileSync(pth, 'utf8');
  return d.replace(/\r\n?/g, '\n');
}
// Write a file and normalize line endings to the current OS.
function writeFile(pth, d) {
  d = d.replace(/\r\n?|\n/g, os.EOL);
  fs.writeFileSync(pth, d);
}


// Check if an array has a regex match.
function hasRegex(x, re) {
  for (var v of x)
    if (re.test(v)) return true;
  return false;
}
// Populate credentials for GitHub from environment variables.
function populateDefaultCredentials(xs) {
  if (!hasRegex(xs, /^(auto|default)$/i)) return xs;
  xs  = xs.filter(r => !/^auto$/i.test(r));
  const GITHUB_TOKEN = E.GH_TOKEN || E.GITHUB_TOKEN || '';
  if  (!GITHUB_TOKEN) return xs;
  xs.push(`https://${GITHUB_TOKEN}:@gist.github.com`);
  xs.push(`https://${GITHUB_TOKEN}:@github.com`);
  return xs;
}


// Fix a credential string.
function fixCredential(x) {
  var rc = /[:=](\w+)\s*$/;
  var rk = /^((?:\w+:)?\/\/)?(\w+:\w*@)?([\s\S]+?)\/?$/;
  var k  = x.replace(rc, ''  ).trim();
  var v  = x.replace(rc, '$1').trim();
  return k.replace(rk, (_, p1, p2, p3) => {
    p1 = !p1 || p1==='//'? 'https://' : p1;
    p2 = !p2 && v? `${v}:@` : p2;
    return `${p1}${p2}${p3}`;
  });
}
// Fix an entry (config) string.
function fixEntry(x) {
  var i = x.lastIndexOf('=');
  var k = x.substring(0, i).trim();
  var v = x.substring(i+1) .trim();
  return `${k} "${v}"`;
}


// Main function.
function main() {
  const HOME = E.HOME || E.HOMEPATH || E.USERPROFILE;
  const PATH = E.GIT_CONFIG_GLOBAL  || `${HOME}/.gitconfig`;
  var   path = core.getInput('path') || PATH;
  var  reset = core.getBooleanInput('reset')  || false;
  var credentialsPath = core.getInput('credentials-path') || join(dirname(PATH), '.gitcredentials');
  var credentials     = core.getMultilineInput('credentials') || [];
  var entries         = core.getMultilineInput('entries')     || [];
  var gitcredentials  = reset? '' : readFile(credentialsPath);
  credentials = populateDefaultCredentials(credentials);
  for (let c of credentials)
    gitcredentials += fixCredential(c) + '\n';
  writeFile(credentialsPath, gitcredentials);
  if (reset) writeFile(path, '');
  for (let e of entries)
    cp.execSync(`git config --file "${path}" ${fixEntry(e)}`);
}
main();
