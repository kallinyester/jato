from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class ProjectBase(BaseModel):
    name: str
    client: str
    description: Optional[str] = None
    stage: Optional[str] = None
    progress: Optional[float] = 0
    start_date: Optional[date] = None
    deadline: Optional[date] = None
    priority: Optional[str] = None
    technologies: Optional[List[str]] = Field(default_factory=list)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str 