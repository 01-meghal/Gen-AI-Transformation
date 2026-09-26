import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.get("/stream")
async def realtime_stream():
    """
    SSE Realtime Event Stream for job progress updates
    """
    async def event_generator():
        yield "data: {\"type\": \"connected\", \"message\": \"SSE channel active\"}\n\n"
        while True:
            await asyncio.sleep(15)
            yield "data: {\"type\": \"ping\", \"timestamp\": \"now\"}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
