import json
import re

def extract_json(raw_output: str) -> dict:
    """Extract JSON from AI output and fix nested quotes for safe parsing."""
    # Grab JSON code block if present
    match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
    json_str = match.group(1).strip() if match else raw_output

    # Grab content between first { and last }
    start = json_str.find("{")
    end = json_str.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON found in AI output.")
    json_str = json_str[start:end+1]

    # Remove trailing commas
    json_str = re.sub(r",\s*}", "}", json_str)
    json_str = re.sub(r",\s*]", "]", json_str)

    # Escape unescaped quotes inside strings
    def escape_inner_quotes(match):
        content = match.group(1)
        content = content.replace('"', '\\"')  # escape internal quotes
        return f'"{content}"'

    json_str = re.sub(r'"([^"]*?)"', escape_inner_quotes, json_str)

    # Normalize whitespace
    json_str = re.sub(r'\s+', ' ', json_str).strip()

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print("Raw AI output:", raw_output)
        print("Cleaned JSON string:", json_str)
        raise ValueError(f"Failed to parse JSON: {e}")
