param([string]$Target=".")
$ErrorActionPreference='Stop'
$src=Split-Path -Parent $MyInvocation.MyCommand.Path
$dst=(Resolve-Path $Target).Path
$items=@('.agent','.hephaistos','.githooks','scripts','docs','evidence','.watchdog.json','hephaistos.cmd','hephaistos.ps1')
foreach($item in $items){$from=Join-Path $src $item;if(Test-Path $from){Copy-Item $from (Join-Path $dst $item) -Recurse -Force}}
if(Test-Path (Join-Path $dst '.git')){git -C $dst config core.hooksPath .githooks | Out-Null}
Write-Host '✅ HEPHAISTOS installed.'
Write-Host '.\hephaistos init --name "My Project" --mission "Describe the mission"'
