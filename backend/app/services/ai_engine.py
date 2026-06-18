import asyncio
import json
import base64
import logging
import math
import struct
from typing import AsyncGenerator, Optional
import websockets
from groq import AsyncGroq  # type: ignore
from app.core.config import settings

logger = logging.getLogger(__name__)

# GCET Grounding Persona - strictly matching user requirements
GCET_SYSTEM_PROMPT = (
    "You are an elite, highly conversational admission assistant for Geethanjali College of Engineering and Technology (GCET). "
    "Ground answers in GCET facts. Keep responses concise, natural, and highly empathetic. Do not use markdown."
)

def generate_mock_pcm_audio(duration_seconds: float = 3.0, sample_rate: int = 16000) -> bytes:
    """
    Generates a 16-bit linear PCM audio tone (sine wave modulating frequency)
    for demonstration/mocking purposes.
    """
    num_samples = int(duration_seconds * sample_rate)
    audio_data = []
    for i in range(num_samples):
        freq = 440.0 + 100.0 * math.sin(2 * math.pi * 2.0 * i / sample_rate)
        sample = int(10000.0 * math.sin(2 * math.pi * freq * i / sample_rate))
        audio_data.append(struct.pack('<h', sample))
    return b"".join(audio_data)

async def sentence_clause_buffer(text_generator: AsyncGenerator[str, None]) -> AsyncGenerator[str, None]:
    """
    Asynchronously buffers incoming text tokens and yields complete sentences or clauses
    to ensure the downstream TTS receives coherent, naturally pronounced segments.
    """
    buffer = []
    # Clause terminators
    terminators = {'.', ',', '?', '!', ';', ':', '\n'}
    
    async for chunk in text_generator:
        buffer.append(chunk)
        full_text = "".join(buffer)
        
        # If any token matches a terminator, or if the accumulated text is long enough
        if any(term in chunk for term in terminators) or len(full_text) > 120:
            last_idx = -1
            for term in terminators:
                idx = full_text.rfind(term)
                if idx > last_idx:
                    last_idx = idx
            
            if last_idx != -1:
                clause = full_text[:last_idx+1]
                yield clause
                buffer = [full_text[last_idx+1:]]
            else:
                yield full_text
                buffer = []
                
    remaining = "".join(buffer).strip()
    if remaining:
        yield remaining

class AIEngineService:
    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.deepgram_api_key = settings.DEEPGRAM_API_KEY
        self.elevenlabs_api_key = settings.ELEVENLABS_API_KEY
        
        if self.groq_api_key:
            self.groq_client = AsyncGroq(api_key=self.groq_api_key)
        else:
            self.groq_client = None

    async def transcribe_stream(self, audio_generator: AsyncGenerator[bytes, None]) -> AsyncGenerator[str, None]:
        """
        Sends binary PCM audio chunks to Deepgram STT WebSocket and yields transcripts.
        """
        if not self.deepgram_api_key:
            logger.warning("Deepgram API Key is missing. Running mock STT.")
            audio_count = 0
            async for chunk in audio_generator:
                audio_count += len(chunk)
                await asyncio.sleep(0.01)
            
            logger.info(f"Mock STT: Received {audio_count} bytes of PCM audio. Yielding transcript.")
            yield "What branches are offered at Geethanjali College?"
            return

        dg_url = "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&model=nova-2&interim_results=false"
        headers = {"Authorization": f"Token {self.deepgram_api_key}"}

        try:
            async with websockets.connect(dg_url, extra_headers=headers) as ws:
                async def sender():
                    try:
                        async for chunk in audio_generator:
                            await ws.send(chunk)
                        await ws.send(json.dumps({"type": "CloseStream"}))
                    except Exception as e:
                        logger.error(f"Error sending audio to Deepgram: {e}")

                sender_task = asyncio.create_task(sender())

                try:
                    async for response in ws:
                        data = json.loads(response)
                        channel = data.get("channel", {})
                        alternatives = channel.get("alternatives", [{}])
                        transcript = alternatives[0].get("transcript", "")
                        if transcript.strip():
                            yield transcript
                except Exception as e:
                    logger.error(f"Error receiving from Deepgram: {e}")
                finally:
                    sender_task.cancel()
        except Exception as e:
            logger.error(f"Deepgram connection failed: {e}")
            yield "Hello, GCET admissions info please."

    async def get_llm_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        """
        Queries Groq LLM with GCET persona and yields text tokens.
        """
        if not self.groq_client:
            logger.warning("Groq client not initialized. Yielding mock response.")
            mock_resp = "Geethanjali College of Engineering and Technology offers CSE, ECE, EEE, and Mechanical Engineering. Our CSE branch is highly sought after with specialization in AI and Machine Learning. Admissions are open under both Convener and Management quotas."
            for word in mock_resp.split(" "):
                yield word + " "
                await asyncio.sleep(0.05)
            return

        try:
            completion = await self.groq_client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": GCET_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                stream=True
            )
            async for chunk in completion:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            logger.error(f"Groq completions failed: {e}")
            yield "I am sorry, I am having trouble connecting to my brain right now. How can I help you?"

    async def synthesize_stream(self, text_generator: AsyncGenerator[str, None]) -> AsyncGenerator[bytes, None]:
        """
        Pipes LLM text outputs (after clause/sentence buffering) into ElevenLabs TTS WebSocket and yields raw synthesized audio bytes.
        """
        # Buffer incoming raw words by sentence or clause before passing to TTS
        buffered_clause_generator = sentence_clause_buffer(text_generator)

        if not self.elevenlabs_api_key:
            logger.warning("ElevenLabs API Key is missing. Yielding mock PCM audio.")
            full_text = ""
            async for text in buffered_clause_generator:
                full_text += text
            logger.info(f"Mock TTS Synthesizing text: {full_text}")
            
            mock_audio = generate_mock_pcm_audio(duration_seconds=3.0)
            chunk_size = 4000
            for i in range(0, len(mock_audio), chunk_size):
                yield mock_audio[i:i+chunk_size]
                await asyncio.sleep(0.08)
            return

        voice_id = "21m00Tcm4TlvDq8ikWAM"
        el_url = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input?model_id=eleven_turbo_v2&output_format=pcm_16000"
        
        try:
            async with websockets.connect(el_url) as ws:
                setup_msg = {
                    "text": " ",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
                    "xi_api_key": self.elevenlabs_api_key
                }
                await ws.send(json.dumps(setup_msg))

                async def sender():
                    try:
                        async for text_chunk in buffered_clause_generator:
                            if text_chunk.strip():
                                payload = {
                                    "text": text_chunk,
                                    "try_trigger_generation": True
                                }
                                await ws.send(json.dumps(payload))
                        await ws.send(json.dumps({"text": ""}))
                    except Exception as e:
                        logger.error(f"Error sending text to ElevenLabs: {e}")

                sender_task = asyncio.create_task(sender())

                try:
                    async for response in ws:
                        data = json.loads(response)
                        audio_base64 = data.get("audio")
                        if audio_base64:
                            audio_bytes = base64.b64decode(audio_base64)
                            yield audio_bytes
                except Exception as e:
                    logger.error(f"Error receiving audio from ElevenLabs: {e}")
                finally:
                    sender_task.cancel()
        except Exception as e:
            logger.error(f"ElevenLabs connection failed: {e}")
            yield generate_mock_pcm_audio(1.0)
