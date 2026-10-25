Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
daemonPath = fso.BuildPath(fso.GetParentFolderName(scriptDir), "lib\daemon.js")
WshShell.Run "node """ & daemonPath & """", 0, False
