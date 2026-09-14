# Owner Notes

A small module-development example for Unknown Home 0.3.0. Its implementation
only saves a note and activation marker inside `UNKNOWN_MODULE_DATA`. It makes
no network requests, invokes no shell commands and changes no TV settings.
The framework still runs it with full root privileges: this scope is a code
property, not a sandbox guarantee.

Use only on a TV you own. Review the source and MIT license before installation.
The candidate is tested with local fixtures, not certified for any TV firmware.
Already working owner-controlled root access and the modular core are prerequisites.
No LG account, consent submission, authentication bypass or rooting method is supplied.

Build from the modular workspace:

```text
npm ci --ignore-scripts
node tools/build.js module examples/owner-notes
```

The resulting ZIP installs disabled. Enable it explicitly, then use **Save note**
and **Read note** in Modules. Disable removes its activation marker but retains
the note. Removal of module code retains all recovery data. To erase the note,
use **Clear note** before disabling. Reinstallation uses the same retained data.
Do not store passwords or household information in a teaching example.

Forks must retain the included copyright and license notices when redistributing
this code. Change the module ID and publisher when making a distinct module;
do not imply endorsement by the original project.
