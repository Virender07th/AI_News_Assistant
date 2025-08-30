# app/Service/TranslateService.py
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()

# Best for multilingual tasks
llm = ChatGroq(model="llama3-70b-8192", temperature=0.2)
parser = StrOutputParser()

translation_prompt = PromptTemplate.from_template(
    """
You are a professional multilingual translator.

Translate the following news article into **{language}**.

Guidelines:
- Use **clean, readable paragraphs**
- **Preserve proper names, places, figures, dates**
- Do NOT translate logs, warnings, code, or non-news content
- Output should be in **Markdown format**

Article:
{article}
"""
)

translation_chain = translation_prompt | llm | parser

def generate_translation(article: str, language: str) -> str:
    return translation_chain.invoke({
        "article": article,
        "language": language
    })
