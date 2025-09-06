# app/Service/Translate.py
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
parser = StrOutputParser()

# Translation Prompt
translation_prompt = PromptTemplate.from_template(
    """
You are a professional multilingual translator.

Translate the following article into **{language}**.

Rules:
- Use clean, natural, and professional language
- Preserve names, places, dates, and numbers
- Do NOT translate technical logs or code
- Return only the translated text, no explanations

Article:
{article}
"""
)
translation_chain = translation_prompt | llm | parser


def generate_translation(article: str, language: str) -> str:
    return translation_chain.invoke({
        "article": article,
        "language": language
    }).strip()


# Language Detection Prompt
detection_prompt = PromptTemplate.from_template(
    """
Detect the original language of the following text.
Return only the full language name (e.g., English, Hindi, Spanish, French).

Text:
{article}
"""
)
detection_chain = detection_prompt | llm | parser


def detect_language(article: str) -> str:
    try:
        return detection_chain.invoke({"article": article}).strip()
    except Exception:
        return "Unknown"
