from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas, crud, deps, auth
from models import Project

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[schemas.ProjectOut])
def list_projects(
    skip: int = 0,
    limit: int = 100,
    stage: str = None,
    priority: str = None,
    client: str = None,
    name: str = None,
    technology: str = None,
    db: Session = Depends(deps.get_db),
    current_user=Depends(auth.get_current_user)
):
    query = db.query(Project)
    if stage:
        query = query.filter(Project.stage == stage)
    if priority:
        query = query.filter(Project.priority == priority)
    if client:
        query = query.filter(Project.client.ilike(f"%{client}%"))
    if name:
        query = query.filter(Project.name.ilike(f"%{name}%"))
    if technology:
        query = query.filter(Project.technologies.ilike(f"%{technology}%"))
    return query.offset(skip).limit(limit).all()

@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(deps.get_db), current_user=Depends(auth.get_current_user)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project

@router.post("/", response_model=schemas.ProjectOut)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(deps.get_db), current_user=Depends(auth.get_current_user)):
    return crud.create_project(db, project)

@router.put("/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, updates: schemas.ProjectUpdate, db: Session = Depends(deps.get_db), current_user=Depends(auth.get_current_user)):
    project = crud.update_project(db, project_id, updates)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project

@router.delete("/{project_id}", response_model=schemas.ProjectOut)
def delete_project(project_id: int, db: Session = Depends(deps.get_db), current_user=Depends(auth.get_current_user)):
    project = crud.delete_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project

@router.get("/dashboard/metrics")
def get_dashboard_metrics(db: Session = Depends(deps.get_db), current_user=Depends(auth.get_current_user)):
    projects = crud.get_projects(db)
    total = len(projects)
    em_desenvolvimento = len([p for p in projects if p.stage == 'desenvolvimento'])
    em_producao = len([p for p in projects if p.stage == 'producao'])
    progresso_medio = round(sum(p.progress for p in projects) / total, 2) if total else 0
    atrasados = len([p for p in projects if p.deadline and p.stage != 'producao' and p.deadline < db.bind.dialect.type_descriptor(db.bind.dialect._get_default_schema_name(db.bind)).python_type()()])
    from datetime import datetime
    now = datetime.now().date()
    finalizados_mes = len([p for p in projects if p.stage == 'producao' and p.deadline and p.deadline.month == now.month and p.deadline.year == now.year])
    return {
        "total": total,
        "em_desenvolvimento": em_desenvolvimento,
        "em_producao": em_producao,
        "progresso_medio": progresso_medio,
        "atrasados": atrasados,
        "finalizados_mes": finalizados_mes
    }

@router.get("/dashboard/alerts")
def get_dashboard_alerts(db: Session = Depends(deps.get_db), current_user=Depends(auth.get_current_user)):
    from datetime import datetime, timedelta
    projects = crud.get_projects(db)
    today = datetime.now().date()
    alerts = []
    # Projetos próximos do prazo (até 7 dias)
    for p in projects:
        if p.deadline and p.stage != 'producao':
            diff = (p.deadline - today).days
            if 0 < diff <= 7:
                alerts.append({
                    "type": "warning",
                    "message": f"Projeto '{p.name}' do cliente '{p.client}' com prazo próximo ({p.deadline.strftime('%d/%m/%Y')})"
                })
            elif diff < 0:
                alerts.append({
                    "type": "error",
                    "message": f"Projeto '{p.name}' do cliente '{p.client}' está atrasado! (prazo: {p.deadline.strftime('%d/%m/%Y')})"
                })
    return alerts 