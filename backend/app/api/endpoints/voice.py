import asyncio
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.ai_engine import AIEngineService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.websocket("/stream")
async def voice_stream_websocket(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    """
    WebSocket endpoint handling real-time binary audio PCM streaming.
    Streams input chunks to Deepgram, forwards transcripts to Groq,
    pipes text output to ElevenLabs, and sends final audio bytes back.
    """
    await websocket.accept()
    logger.info("Voice stream WebSocket connection accepted")

    ai_engine = AIEngineService()
    audio_queue = asyncio.Queue()

    async def read_from_ws():
        try:
            while True:
                message = await websocket.receive()
                if "bytes" in message:
                    await audio_queue.put(message["bytes"])
                elif "text" in message:
                    text_msg = message["text"]
                    if text_msg == "clear" or text_msg == "stop":
                        logger.info(f"Received control command: {text_msg}")
                    elif text_msg == "ping":
                        await websocket.send_text("pong")
                else:
                    # Connection closed or invalid type
                    break
        except WebSocketDisconnect:
            logger.info("Voice stream WebSocket disconnected by client")
        except Exception as e:
            logger.error(f"Error reading from voice WebSocket: {e}")
        finally:
            # None indicates end of stream to the generator
            await audio_queue.put(None)

    async def audio_chunk_generator():
        while True:
            chunk = await audio_queue.get()
            if chunk is None:
                break
            yield chunk

    # Start WebSocket reading task
    reader_task = asyncio.create_task(read_from_ws())

    try:
        async def run_pipeline():
            # Ingest binary chunks and process with Deepgram STT
            async for transcript in ai_engine.transcribe_stream(audio_chunk_generator()):
                logger.info(f"Speech transcript yielded: '{transcript}'")
                
                # Send transcript update message to frontend
                await websocket.send_json({"event": "transcript", "text": transcript})

                # Stream response from Groq
                llm_stream = ai_engine.get_llm_stream(transcript, db)

                # Track generated words/phrases to accumulate the full prompt response
                full_response = []
                async def text_accumulator():
                    async for text_chunk in llm_stream:
                        full_response.append(text_chunk)
                        yield text_chunk
                    
                    # Send complete text response to frontend once finished
                    full_text = "".join(full_response)
                    logger.info(f"Full LLM response: '{full_text}'")
                    try:
                        await websocket.send_json({"event": "response_text", "text": full_text})
                    except Exception as ex:
                        logger.error(f"Failed to send response text metadata: {ex}")

                # Pipe LLM tokens directly into ElevenLabs speech synthesis
                async for audio_chunk in ai_engine.synthesize_stream(text_accumulator()):
                    # Send synthesized raw audio bytes back to client
                    await websocket.send_bytes(audio_chunk)

        await run_pipeline()

    except Exception as e:
        logger.error(f"Error in voice stream pipeline: {e}")
    finally:
        reader_task.cancel()
        try:
            await websocket.close()
        except Exception:
            pass
        logger.info("Voice stream WebSocket session cleaned up")
