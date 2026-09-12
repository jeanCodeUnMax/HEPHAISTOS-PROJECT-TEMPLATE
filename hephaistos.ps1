$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
python "$root\.hephaistos\scripts\hephaistos\hephaistos_cli.py" @args
exit $LASTEXITCODE
