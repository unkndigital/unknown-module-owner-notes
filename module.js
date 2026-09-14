"use strict";
const fs = require("fs"), path = require("path");
function main(action, args, dataRoot) {
  if (!dataRoot || !path.isAbsolute(dataRoot)) throw Error("The host must supply a private data directory");
  if (!args || typeof args !== "object" || Array.isArray(args)) throw Error("Expected argument object");
  const stat=fs.lstatSync(dataRoot);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error("Expected an ordinary private directory");
  const marker=path.join(dataRoot,"active.json"), noteFile=path.join(dataRoot,"note.json");
  function read(file, fallback) {
    try { const stat=fs.lstatSync(file); if (!stat.isFile() || stat.isSymbolicLink() || stat.size>4096) throw Error("Unexpected data file"); return JSON.parse(fs.readFileSync(file,"utf8")); }
    catch(error) { if (error.code === "ENOENT") return fallback; throw error; }
  }
  function write(file, value) {
    const temporary=file+"."+process.pid+".tmp";
    fs.writeFileSync(temporary,JSON.stringify(value)+"\n",{flag:"wx",mode:0o600});
    fs.renameSync(temporary,file);
  }
  function remove(file) { if(read(file,null)!==null)fs.unlinkSync(file); }
  if (action === "saveNote") {
    if (Object.keys(args).length!==1 || typeof args.note!=="string" || args.note.length>500 || /[\u0000-\u001f\u007f]/.test(args.note)) throw Error("Invalid note");
    write(noteFile,{note:args.note});
  } else {
    if (Object.keys(args).length) throw Error("Unexpected arguments");
    if (action === "enable") write(marker,{active:true});
    else if (action === "disable") remove(marker);
    else if (action === "clearNote") remove(noteFile);
    else if (action === "reconcile") { if (!read(marker,null)) throw Error("Activation marker missing; explicit owner recovery is required"); }
    else if (action !== "status") throw Error("Unknown action");
  }
  return {returnValue:true,active:!!read(marker,null),note:(read(noteFile,{note:""})).note};
}
if (require.main === module) {
  try { process.stdout.write(JSON.stringify(main(process.argv[2],JSON.parse(process.argv[3]||"{}"),process.env.UNKNOWN_MODULE_DATA))); }
  catch(error) { process.stdout.write(JSON.stringify({returnValue:false,errorText:error.message}));process.exitCode=1; }
}
module.exports = {main};
