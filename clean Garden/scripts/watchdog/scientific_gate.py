from pathlib import Path
import argparse,json,re,subprocess
ROOT=Path(__file__).resolve().parents[2]; CFG=ROOT/'.watchdog.json'
def main():
 p=argparse.ArgumentParser(); p.add_argument('--git-command',choices=['commit','push'],required=True); a=p.parse_args(); c=json.loads(CFG.read_text(encoding='utf-8-sig'))
 if not c.get('enabled',True): return 0
 print('\n'+'='*72+'\n HEPHAISTOS — GIT WATCHDOG\n'+'='*72+f'\n Gate: git {a.git_command}')
 m=ROOT/c.get('master_file','docs/master/PROJECT_MASTER.md')
 if not m.exists(): print('[FAIL] MASTER missing'); return 1
 t=m.read_text(encoding='utf-8')
 for s in c.get('required_sections',[]):
  if not re.search(rf'^##\s+{re.escape(s)}\s*$',t,re.M): print('[FAIL] section missing: {s}'); return 1
 if c.get('require_initialized_project',True):
  q=ROOT/'.hephaistos/project.yaml'
  if not q.exists() or not re.search(r'^\s*status:\s*ACTIVE\s*$',q.read_text(encoding='utf-8'),re.M|re.I): print('[FAIL] Project UNINITIALIZED'); return 1
 if c.get('block_unresolved_conflicts',True) and subprocess.run(['git','diff','--name-only','--diff-filter=U'],cwd=ROOT,capture_output=True,text=True).stdout.strip(): print('[FAIL] unresolved conflicts'); return 1
 if a.git_command=='commit' and c.get('require_staged_changes_on_commit',True) and not subprocess.run(['git','diff','--cached','--name-only'],cwd=ROOT,capture_output=True,text=True).stdout.strip(): print('[FAIL] No staged changes'); return 1
 for cmd in c.get('tests',{}).get(a.git_command,[]):
  print('[TEST]',cmd)
  if subprocess.run(cmd,cwd=ROOT,shell=True).returncode: print('[FAIL] test failed'); return 1
 print('[PASS] WATCHDOG: PASS'); return 0
if __name__=='__main__': raise SystemExit(main())
