from re import sub

def flatten_text(input: str) -> str:
  patterns = [
    r"WEBVTT\n{1}",
    r"\d+\n\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}",
    r"\n{3}"
  ]

  output = sub(patterns[0], "", input)
  output = sub(patterns[1], "", output)
  output = sub(patterns[2], " ", output)
  return output.strip()