from fastapi import APIRouter
from app.api.v1.endpoints import (
    workspace,
    user,
    project,
    source,
    ingestion,
    transformation,
    review,
    delivery,
    brand,
    prompt,
    webhook,
    audit,
    usage,
    realtime
)

api_router = APIRouter()

api_router.include_router(workspace.router, prefix="/workspaces", tags=["workspaces"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(project.router, prefix="/projects", tags=["projects"])
api_router.include_router(source.router, prefix="/sources", tags=["sources"])
api_router.include_router(ingestion.router, prefix="/ingestion", tags=["ingestion"])
api_router.include_router(transformation.router, prefix="", tags=["transformations"])
api_router.include_router(review.router, prefix="", tags=["review"])
api_router.include_router(delivery.router, prefix="", tags=["delivery"])
api_router.include_router(brand.router, prefix="/brand-profiles", tags=["brands"])
api_router.include_router(prompt.router, prefix="/prompt-management", tags=["prompts"])
api_router.include_router(webhook.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(audit.router, prefix="/audit-events", tags=["audit"])
api_router.include_router(usage.router, prefix="/usage", tags=["usage"])
api_router.include_router(realtime.router, prefix="/realtime", tags=["realtime"])
