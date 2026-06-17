import os

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Feedback Board API",
    description="A simple feedback board API built with FastAPI and SQLAlchemy.",
    version="1.0.0",
)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


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
def list_feedbacks(db: Session = Depends(get_db)):
    return crud.get_feedbacks(db=db)


@app.patch("/feedback/{feedback_id}/status", response_model=schemas.FeedbackResponse)
def change_feedback_status(
    feedback_id: int,
    status_data: schemas.FeedbackStatusUpdate,
    db: Session = Depends(get_db),
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