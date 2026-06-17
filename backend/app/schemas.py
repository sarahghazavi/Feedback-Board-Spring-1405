from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class FeedbackStatus(str, Enum):
    submitted = "submitted"
    in_review = "in_review"
    resolved = "resolved"


class FeedbackCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=5, max_length=2000)


class FeedbackStatusUpdate(BaseModel):
    status: FeedbackStatus


class FeedbackResponse(BaseModel):
    id: int
    title: str
    message: str
    status: FeedbackStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)