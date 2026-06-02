' Duplo clique: abre o navegador (sem janela preta visivel)

Option Explicit

Dim fso, shell, folder, port, pathEnv, buildCmd, serveCmd

port = "3456"
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = folder

pathEnv = shell.ExpandEnvironmentStrings("%PATH%")
pathEnv = "C:\Program Files\nodejs;" & pathEnv
pathEnv = shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\nodejs;" & pathEnv
shell.Environment("PROCESS")("PATH") = pathEnv

If shell.Run("cmd /c where node >nul 2>&1", 0, True) <> 0 Then
  shell.Popup "Node.js nao encontrado." & vbCrLf & vbCrLf & "Instale em nodejs.org" & vbCrLf & "Ou use o PC do desenvolvimento (Cursor).", 0, "LA Custom - Estoque", 16
  WScript.Quit 1
End If

If Not fso.FileExists(folder & "\dist\index.html") Then
  shell.Popup "Preparando demo (primeira vez). Aguarde ate 1 minuto...", 4, "LA Custom", 64
  buildCmd = "cmd /c npm run build:demo"
  If shell.Run(buildCmd, 0, True) <> 0 Then
    shell.Popup "Erro ao gerar demo. Rode npm install na pasta do projeto.", 0, "Erro", 16
    WScript.Quit 1
  End If
End If

serveCmd = "cmd /c npx --yes serve@14.2.4 dist -l " & port
shell.Run serveCmd, 0, False

WScript.Sleep 2500
shell.Run "http://localhost:" & port, 1, False
