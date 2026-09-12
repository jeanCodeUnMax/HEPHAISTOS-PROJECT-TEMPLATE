from pathlib import Path
import argparse, re, json, datetime, subprocess
ROOT=Path(__file__).resolve().parents[3]; H=ROOT/'.hephaistos'; TD=H/'tasks'; PROJ=H/'project.yaml'; STATE=H/'state.yaml'; LEDGER=H/'ledger.jsonl'; MASTER=H/'master/PROJECT_MASTER.md'
def field(txt,k,d=''):
 m=re.search(rf'^\s*{re.escape(k)}:\s*(.*?)\s*$',txt,re.M); return m.group(1).strip().strip('"\'') if m else d
def pstatus(): return field(PROJ.read_text(encoding='utf-8'),'status','UNINITIALIZED').upper() if PROJ.exists() else 'UNINITIALIZED'
def req_init():
 if pstatus()!='ACTIVE': raise SystemExit('[ERROR] Project UNINITIALIZED. Run: .\\hephaistos init --name "My Project" --mission "..."')
def log(ev,task=None):
 H.mkdir(exist_ok=True); LEDGER.touch(exist_ok=True)
 with LEDGER.open('a',encoding='utf-8') as f:f.write(json.dumps({'ts':datetime.datetime.now(datetime.timezone.utc).isoformat(),'event':ev,'task':task})+'\n')
def parse(p):
 t=p.read_text(encoding='utf-8'); rb=re.search(r'^requires:\s*(.*?)(?=^[A-Za-z_]+:|\Z)',t,re.M|re.S); req=[]
 if rb:
  x=rb.group(1).strip(); req=[i.strip() for i in x.strip('[]').split(',') if i.strip()] if x.startswith('[') else re.findall(r'^\s*-\s*(T\d+)\s*$',rb.group(1),re.M)
 sb=re.search(r'^depends_on_skill:\s*(.*?)(?=^[A-Za-z_]+:|\Z)',t,re.M|re.S); skills=[]
 if sb:
  y=sb.group(1).strip(); skills=[i.strip() for i in y.strip('[]').split(',') if i.strip()] if y.startswith('[') else re.findall(r'^\s*-\s*(.+?)\s*$',sb.group(1),re.M)
 nxt=field(t,'next','NONE'); return {'path':p,'id':field(t,'id',p.stem),'title':field(t,'title',''),'status':field(t,'status','PENDING').upper(),'requires':req,'skills':skills,'checks':re.findall(r'^\s*- path:\s*(.+)$',t,re.M),'next':None if nxt.upper() in ('NONE','NULL','-','') else nxt}
def tasks(): return {x['id']:x for x in (parse(p) for p in sorted(TD.glob('T*.yaml')))}
def active(a):
  x=[t for t in a.values() if t['status']=='ACTIVE'];
  if len(x)>1: raise SystemExit('[!] Invalid state: multiple ACTIVE tasks')
  return x[0] if x else None
def bad(t,a): return [x for x in t['requires'] if x not in a or a[x]['status']!='DONE']
def save(t,s):
 x=t['path'].read_text(encoding='utf-8'); x=re.sub(r'^status:\s*.*$',f'status: {s}',x,count=1,flags=re.M) if re.search(r'^status:',x,re.M) else x+f'\nstatus: {s}\n'; t['path'].write_text(x,encoding='utf-8')
def resolve(i,a):
 if i:
  if i not in a: raise SystemExit(f'❌ Unknown task: {i}')
  return a[i]
 x=active(a)
 if not x: raise SystemExit('❌ No ACTIVE task')
 return x
def sync(tid='NONE',title='No active task.',nxt='Create/import PRD and task graph.'):
 pt=PROJ.read_text(encoding='utf-8'); pid=field(pt,'id','UNINITIALIZED'); mission=field(pt,'mission','Not defined'); MASTER.parent.mkdir(parents=True,exist_ok=True)
 MASTER.write_text(f'# PROJECT MASTER\n\n## MISSION\nID: {pid}\n{mission}\n\n## HYPOTHESIS_ACTIVE\nID: NONE\nNone.\n\n## EXPERIMENT_ACTIVE\nID: NONE\nNone.\n\n## TASK_ACTIVE\nID: {tid}\n{title}\n\n## SUCCESS_CRITERION\nDefined by PRD/task evidence rules.\n\n## LAST_CONCLUSION\nNo conclusion recorded yet.\n\n## NEXT_ACTION\n{nxt}\n\n## BACKLOG\n- Managed by project task graph / agent rules\n',encoding='utf-8')
def init(args):
 if pstatus()=='ACTIVE' and not args.force: raise SystemExit('[!] Project already initialized')
 H.mkdir(exist_ok=True); TD.mkdir(exist_ok=True); LEDGER.touch(exist_ok=True); pid=args.id or 'PROJECT-001'
 PROJ.write_text(f'project:\n  id: {pid}\n  name: "{args.name}"\n  mission: "{args.mission}"\n  status: ACTIVE\n',encoding='utf-8'); STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: project_initialized\ncurrent_phase: IDLE\n',encoding='utf-8'); sync(nxt='Create/import the PRD, then decompose it into verifiable tasks.'); log('PROJECT_INITIALIZED'); print(f'[PASS] {pid} initialized — {args.name}')
def list_tasks(_):
 req_init(); a=tasks(); print('HEPHAISTOS TASKS\n');
 if not a: print('(no tasks yet — decompose the PRD first)'); return
 for t in a.values():
  b=bad(t,a); e='BLOCKED' if t['status']=='PENDING' and b else t['status']; icon={'DONE':'[PASS]','ACTIVE':'->','PENDING':'( )','BLOCKED':'[!]'}.get(e,'?'); print(f"{icon} {t['id']:<5} {e:<8} {t['title']}")
  if b: print('   blocked by: '+', '.join(b))
def status(args):
 req_init(); a=tasks(); t=resolve(args.task,a); print(f"{t['id']} — {t['title']}\nSTATUS: {t['status']}\nREQUIRES: {', '.join(t['requires']) if t['requires'] else 'none'}\nEVIDENCE:"); rows=[(r,(ROOT/r).exists()) for r in t['checks']];
 if not rows: print('  (none declared)')
 for r,o in rows: print(f"  {'[PASS]' if o else '[FAIL]'} {r}")
def check(args):
 req_init(); a=tasks(); t=resolve(args.task,a); b=bad(t,a)
 if b: print(f"[!] {t['id']} blocked by: {', '.join(b)}"); return 1
 rows=[(r,(ROOT/r).exists()) for r in t['checks']]; miss=[r for r,o in rows if not o]; print(f"CHECK {t['id']} — {t['title']}"); [print(f"{'[PASS]' if o else '[FAIL]'} {r}") for r,o in rows]
 if miss: print(f'\n⛔ INCOMPLETE — {len(miss)} evidence item(s) missing'); log('CHECK_FAILED',t['id']); return 1
 print('\n[PASS] VALID'); log('CHECK_PASSED',t['id']); return 0
def start(args):
 req_init(); a=tasks(); t=resolve(args.task,a); ac=active(a); b=bad(t,a)
 if b: raise SystemExit(f"[!] ORDER VIOLATION — {t['id']} blocked by: {', '.join(b)}")
 if ac and ac['id']!=t['id']: raise SystemExit(f"[!] ORDER VIOLATION — {ac['id']} is ACTIVE")
 try: subprocess.run(['git', 'checkout', '-B', f'task/{t["id"]}'], check=False)
 except: print('[!] Could not checkout branch')
 save(t,'ACTIVE'); STATE.write_text(f"active_task: {t['id']}\nactive_milestone: null\nlast_transition: task_started\ncurrent_phase: EXEC\n",encoding='utf-8'); sync(t['id'],t['title'],f"Execute {t['id']} and satisfy its evidence checks."); log('TASK_STARTED',t['id']); print(f"-> {t['id']} ACTIVE (Phase: EXEC)")
def finish(args):
 req_init(); a=tasks(); t=resolve(args.task,a); ac=active(a)
 if not ac or ac['id']!=t['id']: raise SystemExit(f"⛔ ORDER VIOLATION — requested {t['id']}, ACTIVE is {ac['id'] if ac else 'none'}")
 if check(argparse.Namespace(task=t['id'])): return 1
 save(t,'DONE'); log('TASK_DONE',t['id']); a=tasks(); n=t['next']
 STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: task_completed\ncurrent_phase: IDLE\n',encoding='utf-8')
 if n and n in a and not bad(a[n],a):
  sk = ', '.join(a[n]['skills']) if a[n]['skills'] else 'Aucune spécifique'
  sync(nxt=f"Task {n} is ready. Required skills: {sk}. Awaiting competent agent.")
  print(f'\n[PASS] {t["id"]} DONE (Phase: IDLE)\n-> Tâche suivante recommandée : {n}\n-> Compétences requises : {sk}\n-> En attente d\'un agent (Pull Model). Tapez `hephaistos start {n}` pour la prendre.')
 else:
  sync(nxt='Review roadmap and activate the next admissible task.')
  print(f'\n[PASS] {t["id"]} DONE (Phase: IDLE)')
def brainstorm(args):
 req_init(); b=MASTER.parent/'BRAINSTORM.md'
 if args.action == 'start':
  if b.exists() and not getattr(args, 'force', False): raise SystemExit('[!] Brainstorm already exists. Use --force to overwrite.')
  b.write_text('# BRAINSTORM (Maieutic Socratic Gate)\n\n## 1. Objectif (Purpose)\n- Quel est le but profond de ce projet ?\n- Quel est le sens ou la volonté derrière ce développement ?\n- Que cherchons-nous à obtenir in fine ?\n\n## 2. Utilisateurs (Users)\n- À qui s\'adresse ce projet ?\n\n## 3. Périmètre (Scope)\n- Quels sont les "must-have" (indispensables) ?\n- Quels sont les "nice-to-have" (bonus) ?\n\n## 4. Architecture & Contraintes\n- Y a-t-il des limites techniques ou des choix de stack spécifiques ?\n\n> **Action :** Remplissez ces points en discutant avec votre Agent IA, puis lancez `.\\hephaistos brainstorm stop` pour terminer.\n',encoding='utf-8'); STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: brainstorm_started\ncurrent_phase: BRAINSTORM\n',encoding='utf-8'); sync(nxt='Discuss and fill out BRAINSTORM.md with your AI agent, then run `.\\hephaistos brainstorm stop`'); log('BRAINSTORM_STARTED'); print('[PASS] BRAINSTORM.md created. Phase is now BRAINSTORM (Code commits are blocked).')
 else:
  if not b.exists(): raise SystemExit('[!] BRAINSTORM.md missing.')
  STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: brainstorm_completed\ncurrent_phase: IDLE\n',encoding='utf-8'); sync(nxt='Run `.\\hephaistos prd start` to proceed.'); log('BRAINSTORM_STOPPED'); print('[PASS] BRAINSTORM complete. Phase is now IDLE.')
def prd(args):
 req_init(); b=MASTER.parent/'BRAINSTORM.md'; p=MASTER.parent/'PRD.md'
 if args.action == 'start':
  if not b.exists(): raise SystemExit('[!] No BRAINSTORM.md found. Run `.\\hephaistos brainstorm` first.')
  if p.exists() and not getattr(args, 'force', False): raise SystemExit('[!] PRD already exists. Use --force to overwrite.')
  p.write_text('# PRODUCT REQUIREMENTS DOCUMENT\n\nBased on the brainstorm...\n',encoding='utf-8'); STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: prd_started\ncurrent_phase: PRD\n',encoding='utf-8'); sync(nxt='Flesh out the PRD with your AI agent based on the brainstorm, then run `.\\hephaistos prd stop`'); log('PRD_STARTED'); print('[PASS] PRD.md created. Phase is now PRD (Code commits are blocked).')
 else:
  if not p.exists(): raise SystemExit('[!] PRD.md missing.')
  STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: prd_completed\ncurrent_phase: IDLE\n',encoding='utf-8'); sync(nxt='Run `.\\hephaistos plan start` to proceed.'); log('PRD_STOPPED'); print('[PASS] PRD complete. Phase is now IDLE.')
def plan(args):
 req_init(); p=MASTER.parent/'PRD.md'
 if args.action == 'start':
  if not p.exists(): raise SystemExit('[!] No PRD.md found. Run `.\\hephaistos prd` first.')
  STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: plan_started\ncurrent_phase: PLAN\n',encoding='utf-8'); sync(nxt='Ask your AI agent to split the PRD into task YAML files, then run `.\\hephaistos plan stop`.'); log('PLANNING_STARTED'); print('[PASS] Ready for task planning. Phase is now PLAN (Only YAML and MD files allowed).')
 else:
  STATE.write_text('active_task: null\nactive_milestone: null\nlast_transition: plan_completed\ncurrent_phase: IDLE\n',encoding='utf-8'); sync(nxt='Run `.\\hephaistos start Txxx` to execute a task.'); log('PLANNING_STOPPED'); print('[PASS] PLAN complete. Phase is now IDLE.')
def help_cli(_):
 print('''\n=== HEPHAISTOS CLI - GUIDE D'UTILISATION ===
Ce CLI orchestre les phases du projet et bloque les commits non-autorisés.

1. INITIALISATION
   .\\hephaistos init --name "Nom" --mission "Description"
   (Initialise le projet, crée les dossiers .hephaistos)

2. PHASES DE CONCEPTION (Bloquent les commits de code)
   .\\hephaistos brainstorm start  -> Ouvre BRAINSTORM.md
   .\\hephaistos brainstorm stop
   .\\hephaistos prd start         -> Ouvre PRD.md
   .\\hephaistos prd stop
   .\\hephaistos plan start        -> Phase de découpage YAML (T001.yaml)
   .\\hephaistos plan stop

3. EXÉCUTION (Permet les commits)
   .\\hephaistos tasks             -> Liste toutes les tâches YAML
   .\\hephaistos start T001        -> Démarre l'exécution de T001
   .\\hephaistos check T001        -> Vérifie si l'évidence de T001 existe
   .\\hephaistos finish T001       -> Valide T001 et passe à la suivante
   .\\hephaistos status T001       -> Affiche l'état d'une tâche

Exemple de cycle complet :
1. .\\hephaistos brainstorm start (puis stop)
2. .\\hephaistos prd start (puis stop)
3. .\\hephaistos plan start (Création des YAML) puis stop
4. .\\hephaistos start T001 (Le code est écrit et commité)
5. .\\hephaistos finish T001
============================================\n''')

def main():
 p=argparse.ArgumentParser(prog='hephaistos'); s=p.add_subparsers(dest='cmd',required=True); q=s.add_parser('init'); q.add_argument('--name',required=True); q.add_argument('--mission',required=True); q.add_argument('--id'); q.add_argument('--force',action='store_true'); s.add_parser('tasks')
 for n in ['brainstorm','prd','plan']: q=s.add_parser(n); q.add_argument('action', choices=['start', 'stop'], nargs='?', default='start'); q.add_argument('--force',action='store_true')
 for n in ['status','check','start','finish']: q=s.add_parser(n); q.add_argument('task',nargs='?')
 s.add_parser('help')
 a=p.parse_args(); return {'init':init,'tasks':list_tasks,'status':status,'check':check,'start':start,'finish':finish,'brainstorm':brainstorm,'prd':prd,'plan':plan,'help':help_cli}[a.cmd](a) or 0
if __name__=='__main__': raise SystemExit(main())
