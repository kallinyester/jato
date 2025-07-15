from fastapi import FastAPI
import api
import api_auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Jato Hub API")

app.include_router(api.router)
app.include_router(api_auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou especifique ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Jato Hub API rodando!"} 