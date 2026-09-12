from pathlib import Path
import argparse,json,re,subprocess
# ROOT is now clean Garden (parents[3] since the file is in clean Garden/.hephaistos/scripts/watchdog/scientific_gate.py)
ROOT=Path(__file__).resolve().parents[3]
CFG=ROOT/'.hephaistos'/'.watchdog.json'
def main():
 p=argparse.ArgumentParser(); p.add_argument('--git-command',choices=['commit','push'],required=True); a=p.parse_args(); c=json.loads(CFG.read_text(encoding='utf-8-sig'))
 if not c.get('enabled',True): return 0
 print('\n'+'='*72+'\n HEPHAISTOS — GIT WATCHDOG\n'+'='*72+f'\n Gate: git {a.git_command}')
 m=MASTER_PATH=ROOT/'.hephaistos'/'master'/'PROJECT_MASTER.md'
 if not m.exists(): print(f'[FAIL] MASTER missing at {m}'); return 1
 t=m.read_text(encoding='utf-8')
 for s in c.get('required_sections',[]):
  if not re.search(rf'^##\s+{re.escape(s)}\s*$',t,re.M): print(f'[FAIL] section missing: {s}'); return 1
 if c.get('require_initialized_project',True):
  q=ROOT/'.hephaistos'/'project.yaml'
  if not q.exists() or not re.search(r'^\s*status:\s*ACTIVE\s*$',q.read_text(encoding='utf-8'),re.M|re.I): print('[FAIL] Project UNINITIALIZED'); return 1
 
 branch_name = subprocess.run(['git','rev-parse','--abbrev-ref','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
 protected = c.get('protected_branches', [])
 if a.git_command == 'commit' and branch_name in protected:
  print(f'[FAIL] Direct commits to {branch_name} are blocked. Please use a task branch (e.g. task/T001) and merge via PR.')
  return 1

 if c.get('block_unresolved_conflicts',True) and subprocess.run(['git','diff','--name-only','--diff-filter=U'],cwd=ROOT,capture_output=True,text=True).stdout.strip(): print('[FAIL] unresolved conflicts'); return 1
 
 if a.git_command=='commit' and c.get('require_staged_changes_on_commit',True):
  staged_out = subprocess.run(['git','diff','--cached','--name-only'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
  if not staged_out: print('[FAIL] No staged changes'); return 1
  
  # --- HEPHAISTOS PHASE LOCKING ---
  staged_files = staged_out.split('\n')
  state_file = ROOT/'.hephaistos'/'state.yaml'
  phase = 'IDLE'
  if state_file.exists():
   sm = re.search(r'^current_phase:\s*([A-Za-z_]+)', state_file.read_text(encoding='utf-8'), re.M)
   if sm: phase = sm.group(1).upper()
  
  for f in staged_files:
   # Les fichiers de gestion Hephaistos sont toujours autorisés à être commités
   if f.startswith('.hephaistos/'): continue
   # Bloquer tout code source/fichiers externes si on n'est pas en phase EXEC (tâche active)
   if phase != 'EXEC':
    print(f'[FAIL] Phase = {phase}. Code commits are BLOCKED.')
    print(f'       Staged file not allowed: {f}')
    print(f'       -> You must start a task (phase EXEC) to commit source code.')
    print(f'       -> Run: .\\hephaistos start TXXX')
    return 1
  
  # Scientific Output Verification
  if phase == 'EXEC':
   active_task_match = re.search(r'^active_task:\s*(T\d+)', state_file.read_text(encoding='utf-8'), re.M) if state_file.exists() else None
   if active_task_match:
    t_id = active_task_match.group(1)
    task_file = ROOT/'.hephaistos'/'tasks'/f'{t_id}.yaml'
    if task_file.exists():
     task_content = task_file.read_text(encoding='utf-8')
     if 'type: experiment' in task_content or 'scientific-experiment' in task_content:
      # Check if deliverables exist in staged files OR in the repo
      expected = [f'{t_id}_academic_paper.md', f'{t_id}_full_analysis.md', f'{t_id}_process_manual.md', f'{t_id}_commercial_benchmark.md']
      missing = []
      for exp in expected:
       if not any(f.endswith(exp) for f in staged_files) and not (ROOT/exp).exists():
        missing.append(exp)
      if missing:
       print(f'[FAIL] SCIENTIFIC PROTOCOL VIOLATION for {t_id}')
       print(f'       Missing required deliverables: {", ".join(missing)}')
       print(f'       You must generate these reports before committing.')
       return 1
  # --------------------------------

 for cmd in c.get('tests',{}).get(a.git_command,[]):
  print('[TEST]',cmd)
  if subprocess.run(cmd,cwd=ROOT,shell=True).returncode: print('[FAIL] test failed'); return 1
 print('[PASS] WATCHDOG: PASS'); return 0
if __name__=='__main__': raise SystemExit(main())
