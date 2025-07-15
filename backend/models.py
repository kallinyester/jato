from sqlalchemy import Column, Integer, String, Date, Enum, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class StageEnum(str, enum.Enum):
    planejamento = "planejamento"
    desenvolvimento = "desenvolvimento"
    testes = "testes"
    homologacao = "homologacao"
    producao = "producao"
    manutencao = "manutencao"

class PriorityEnum(str, enum.Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String, nullable=False)
    description = Column(String)
    stage = Column(Enum(StageEnum), default=StageEnum.planejamento)
    progress = Column(Float, default=0)
    start_date = Column(Date)
    deadline = Column(Date)
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.media)
    technologies = Column(String)  # Lista serializada (ex: JSON ou CSV) 

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user") 