# app/Service/Summarizer.py
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.1)
parser = StrOutputParser()

# -----------------------------
# Paragraph Summary
# -----------------------------
paragraph_prompt = PromptTemplate.from_template(
    """
You are a professional news summarizer.

TASK:
- Summarize the news article into a **single coherent paragraph** (5–8 sentences max).
- Focus only on verified facts from the article.
- Maintain a neutral, formal journalistic tone.
- Avoid filler phrases like "In conclusion" or "This article states".

OUTPUT:
Return only the paragraph, no titles or extra labels.

NEWS ARTICLE:
{article}
"""
)
highlight_prompt = PromptTemplate.from_template(
    """
You are an assistant tasked with extracting highlights from a news article.

TASK:
- Identify and list **5–10 highlights** from the article.
- Each highlight must be a **short, standalone phrase (6–12 words)**.
- No numbering, no intro text, no explanations.

OUTPUT:
Return highlights as a plain list, one per line.

NEWS ARTICLE:
{article}
"""
)
bullet_prompt = PromptTemplate.from_template(
    """
You are an experienced news analyst.

TASK:
- Extract **5–10 key factual bullet points** from the article.
- Each point must be a **clear, complete sentence** (not a fragment).
- Cover the most important facts without repetition.
- Do not add headers, numbering, or extra commentary.

OUTPUT:
Return bullet points as a plain list, one per line.

NEWS ARTICLE:
{article}
"""
)



paragraph_chain = paragraph_prompt | llm | parser


def generate_paragraph(text: str) -> str:
    try:
        return paragraph_chain.invoke({"article": text}).strip()
    except Exception as e:
        return f"Error generating paragraph: {str(e)}"


# -----------------------------
# Bullet Point Summary
# -----------------------------

bullet_chain = bullet_prompt | llm | parser


def generate_bullets(text: str) -> list:
    try:
        content = bullet_chain.invoke({"article": text})
        return [line.strip("-•●* ").strip() for line in content.split("\n") if line.strip()]
    except Exception as e:
        return [f"Error generating bullets: {str(e)}"]


# -----------------------------
# Highlights Summary
# -----------------------------

highlight_chain = highlight_prompt | llm | parser


def generate_highlights(text: str) -> list:
    try:
        content = highlight_chain.invoke({"article": text})
        return [line.strip("-•●* ").strip() for line in content.split("\n") if line.strip()]
    except Exception as e:
        return [f"Error generating highlights: {str(e)}"]
