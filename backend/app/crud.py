from sqlalchemy import desc
from sqlalchemy.orm import Session

from app import models, schemas


def create_feedback(db: Session, feedback_data: schemas.FeedbackCreate) -> models.Feedback:
    feedback = models.Feedback(
        title=feedback_data.title.strip(),
        message=feedback_data.message.strip(),
        status=schemas.FeedbackStatus.submitted.value,
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback


def get_feedbacks(db: Session) -> list[models.Feedback]:
    return db.query(models.Feedback).order_by(desc(models.Feedback.created_at)).all()


def get_feedback_by_id(db: Session, feedback_id: int) -> models.Feedback | None:
    return db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()


def update_feedback_status(
    db: Session,
    feedback: models.Feedback,
    status: schemas.FeedbackStatus,
) -> models.Feedback:
    feedback.status = status.value

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback