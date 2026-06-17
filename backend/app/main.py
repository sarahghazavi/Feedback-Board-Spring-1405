import os
import secrets

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import Base, engine, get_db

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Feedback Board API",
    description="A simple feedback board API built with FastAPI and SQLAlchemy.",
    version="1.0.0",
)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

admin_username = os.getenv("ADMIN_USERNAME", "admin")
admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
admin_token = os.getenv("ADMIN_TOKEN", "change-this-local-admin-token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def require_admin(authorization: str | None = Header(default=None)) -> bool:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication is required.",
        )

    token = authorization.replace("Bearer ", "", 1).strip()

    if not secrets.compare_digest(token, admin_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token.",
        )

    return True


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/login", response_model=schemas.LoginResponse)
def login(login_data: schemas.LoginRequest):
    is_valid_username = secrets.compare_digest(login_data.username, admin_username)
    is_valid_password = secrets.compare_digest(login_data.password, admin_password)

    if not is_valid_username or not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    return {
        "access_token": admin_token,
        "token_type": "bearer",
    }


@app.post(
    "/feedback",
    response_model=schemas.FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_feedback(
    feedback_data: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
):
    return crud.create_feedback(db=db, feedback_data=feedback_data)


@app.get("/feedback", response_model=list[schemas.FeedbackResponse])
def list_feedbacks(
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    return crud.get_feedbacks(db=db)


@app.patch("/feedback/{feedback_id}/status", response_model=schemas.FeedbackResponse)
def change_feedback_status(
    feedback_id: int,
    status_data: schemas.FeedbackStatusUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    feedback = crud.get_feedback_by_id(db=db, feedback_id=feedback_id)

    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found.",
        )

    return crud.update_feedback_status(
        db=db,
        feedback=feedback,
        status=status_data.status,
    )