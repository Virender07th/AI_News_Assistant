from pydantic import BaseModel
from typing import Literal




# app/Service/AINewsProjectService/FactChecker.py

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pydantic import BaseModel, HttpUrl
from typing import List
import os, json, re

load_dotenv()

# Load Groq LLaMA3 model
llm = ChatGroq(model="llama3-70b-8192", temperature=0.2)
parser = StrOutputParser()

# Define output structure
class BiasDetectionReport(BaseModel):
    bias_progress: int  # completion percentage, 0–100
    bias_score: Literal["Low", "Moderate", "High" , "Postive" , "Negative" , "Neutral"]   # classified bias level
    insights: str  # summary of insights about tone, language, framing
    reasoning: str  # explanation of how the bias was detected
    verdict: str  # final editorial verdict
    cleaned_markdown: str
    is_simulated: bool = True  # flag for demo mode vs real API



# Prompt that forces JSON output


bias_Detect_prompt = PromptTemplate.from_template(
    """
You are an expert AI assistant trained in journalistic standards, editorial analysis, and bias detection.

Your task is to analyze the following **news article** and return a structured **JSON report** summarizing bias-related insights. Focus on the tone, framing, fact selection, and language.

---

## Analysis Guidelines:

1. **Tone**: Is the article neutral, emotional, optimistic, or pessimistic?
2. **Framing**: Are both sides of the issue presented fairly, or is one side favored?
3. **Fact Selection**: Are facts selectively presented to influence opinion?
4. **Language**: Does the article use emotionally charged or persuasive language?

---

## Classification Instructions:

Use **only one** of the following values for `"bias_score"`:
- `"Low"` – Largely neutral and fact-based
- `"Moderate"` – Mildly biased or slanted
- `"High"` – Strongly biased, emotionally or one-sided
- `"Positive"` – Overly optimistic, uncritically supportive
- `"Negative"` – Pessimistic or hostile toward a subject
- `"Neutral"` – Fully factual, balanced and unbiased

---

## bias_progress Calculation:

- `"High"` / `"Negative"` → `100`
- `"Moderate"` → `70`
- `"Positive"` → `50`
- `"Low"` / `"Neutral"` → `40`

---

## Output Instructions:

1. Rewrite the article in **Markdown** format using clean headings (`#`, `##`, `**`).
2. Keep the summary under **600 words**.
3. Return output as **valid JSON** using the format below.

---

## Input Article:
{article}

---

## Output Format:
```json
{{
  "bias_progress": int (0 to 100),
  "bias_score": "Low" | "Moderate" | "High" | "Positive" | "Negative" | "Neutral",
  "insights": "Short summary of tone, bias or neutrality in the article",
  "reasoning": "Explanation of why the bias_score was assigned, based on tone, framing, language, facts",
  "verdict": "Final editorial judgment (e.g., Suitable for balanced reading, Biased but factual, etc.)",
  "cleaned_markdown": "details Rewritten article in Markdown format",
  "is_simulated": true
}}
"""
)
# LangChain chain
bias_detection_chain = bias_Detect_prompt | llm | parser

# Function to process article
def generate_bias_detection(article: str) -> BiasDetectionReport:
    raw_output = bias_detection_chain.invoke({"article": article})

    # Clean LLM output if it's wrapped in markdown-style code block
    match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
    else:
        json_str = raw_output.strip()

    try:
        data = json.loads(json_str)
        return BiasDetectionReport(**data)
    except Exception as e:
        raise ValueError(f"Invalid JSON from LLM: {e}")
