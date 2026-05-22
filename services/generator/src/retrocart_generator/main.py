from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="RetroCart Generator", version="0.0.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


class GenerateRequest(BaseModel):
    catalog_id: str


@app.post("/internal/generate")
def generate(_body: GenerateRequest) -> JSONResponse:
    return JSONResponse(
        status_code=501,
        content={"detail": "not implemented"},
    )
