import os
import logging
from typing import List
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import DocumentChunk

logger = logging.getLogger(__name__)

# Initialize SentenceTransformer globally to avoid reloading
try:
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    logger.error(f"Failed to load sentence-transformers model: {e}")
    embedding_model = None

class RAGService:
    @staticmethod
    def extract_text_from_pdf(pdf_path: str) -> str:
        """
        Extracts raw text from a PDF file using PyPDF2.
        """
        reader = PdfReader(pdf_path)
        text_content: List[str] = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
        return "\n".join(text_content)

    @staticmethod
    def split_text(text: str) -> List[str]:
        """
        Splits text into chunks using RecursiveCharacterTextSplitter.
        """
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=150
        )
        return splitter.split_text(text)

    @staticmethod
    def get_embeddings(chunks: List[str]) -> List[List[float]]:
        """
        Converts text chunks to 384-dimension vector embeddings.
        """
        if not embedding_model:
            logger.warning("Embedding model not loaded. Yielding mock embeddings.")
            return [[0.0] * 384 for _ in chunks]
            
        embeddings = embedding_model.encode(chunks, show_progress_bar=False)
        return [emb.tolist() for emb in embeddings]

    @classmethod
    async def ingest_document(cls, db: AsyncSession, pdf_path: str, title: str) -> int:
        """
        Extracts, splits, embeds, and stores a document in the database.
        Returns the number of chunks ingested.
        """
        text = cls.extract_text_from_pdf(pdf_path)
        if not text.strip():
            logger.warning("No text extracted from document")
            return 0
            
        chunks = cls.split_text(text)
        if not chunks:
            logger.warning("No chunks generated from document")
            return 0
            
        embeddings = cls.get_embeddings(chunks)
        
        for chunk, emb in zip(chunks, embeddings):
            db_chunk = DocumentChunk(
                document_title=title,
                content=chunk,
                embedding=emb,
                metadata_info={"source": title}
            )
            db.add(db_chunk)
            
        await db.commit()
        logger.info(f"Ingested {len(chunks)} chunks for document: {title}")
        return len(chunks)
