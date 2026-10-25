Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
cliPath = fso.BuildPath(scriptDir, "cli.js")
WshShell.Run "node """ & cliPath & """ inject", 0, False
