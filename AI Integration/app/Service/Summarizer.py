from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

# Load environment variables (for Groq API key, if needed)
load_dotenv()

llm = ChatGroq(model="llama3-8b-8192", temperature=0.1)
parser = StrOutputParser()


# Paragraph Summary
paragraph_prompt = PromptTemplate.from_template(
    """
You are a professional news summarizer.

TASK:
- Write a concise and factually accurate summary of the news article below.
- Format the summary as a **single coherent paragraph** (5 to 8 lines max).
- Use formal language, maintain a **neutral tone**, and avoid exaggeration or subjective phrasing.

REQUIREMENTS:
- Include critical details: names, dates, places, events, numbers, and outcomes.
- Preserve the chronological and logical flow of the article.
- Do NOT add opinions, assumptions, or emotional language.
- Output only the final summary paragraph.

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



# Bullet Point Summary
bullet_prompt = PromptTemplate.from_template(
    """
You are an experienced news analyst.

TASK:
- Extract **5 to 10 key factual bullet points** from the news article below.
- Each bullet point must be a **clear, complete sentence**.
- Focus on verified facts, concrete outcomes, and meaningful details.

INSTRUCTIONS:
- Avoid vague language like “reportedly”, “may”, or “it is said”.
- Do NOT include opinions, speculation, or unsupported claims.
- Do NOT start bullets with symbols like -, *, or ●.
- Ensure each point is **independent and self-explanatory**.

NEWS ARTICLE:
{article}
"""
)


bullet_chain = bullet_prompt | llm | parser

def generate_bullets(text: str) -> list:
    try:
        content = bullet_chain.invoke({"article": text})
        return [line.strip("-•●* ").strip() for line in content.split("\n") if line.strip()]
    except Exception as e:
        return [f"Error generating bullets: {str(e)}"]



highlight_prompt = PromptTemplate.from_template(
    """
You are an assistant tasked with extracting concise highlights from a news article.

TASK:
- Identify and output **5 to 10 brief highlights** from the news.
- Each highlight should be a **short, impactful phrase** (6–12 words).
- Do NOT use full sentences or bullet points.
- Maintain a **factual and objective** tone.

GUIDELINES:
- Focus on key developments, facts, data points, actions, or consequences.
- Avoid filler phrases, opinions, adjectives, or vague terms like “important news” or “it seems”.
- Each highlight must be on a **separate line** with no symbols or numbering.

NEWS ARTICLE:
{article}
"""
)

highlight_chain = highlight_prompt | llm | parser


def generate_highlights(text: str) -> list:
    try:
        content = highlight_chain.invoke({"article": text})
        return [line.strip("-•●* ").strip() for line in content.split("\n") if line.strip()]
    except Exception as e:
        return [f"Error generating highlights: {str(e)}"]
