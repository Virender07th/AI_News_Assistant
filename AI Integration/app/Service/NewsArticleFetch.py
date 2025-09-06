from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

# Load environment variables (for Groq API key, if needed)
load_dotenv()

# Initialize Groq LLM with LLaMA3
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.1)
parser = StrOutputParser()

# Prompt template for article cleanup and formatting
news_article_prompt = PromptTemplate.from_template(
    """
You are an expert news editor and journalist. Your job is to write a well-structured, informative, and unbiased news article based on the given topic or source content.

## Instructions:
- If the input is a **topic**, generate a full news article covering key facts, context, recent updates, and relevance.
- If the input is a **raw snippet or content from a URL**, extract key information and write a clean, complete article.
- Maintain a neutral and factual tone.
- Use clear and concise language suitable for general readers.
- Use **Markdown formatting**:
  - `#` for the article headline
  - `##` for subheadings (e.g., Background, Details, Reactions)
  - Bullet points or `**bold**` where appropriate

## Constraints:
- Do not add phrases like “Sure, here is your article.”
- Do not hallucinate or make up fake sources.
- Keep the article well-organized and under 600 words.
- Avoid repetition.

---

### Input (Topic or Raw Content):
{article}
"""
)


# Create the chain
news_article_chain = news_article_prompt | llm | parser

# Final callable function
def newsGeneration(article: str) -> str:
    return news_article_chain.invoke({"article": article})