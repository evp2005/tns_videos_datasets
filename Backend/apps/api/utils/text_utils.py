from re import sub
import re

def flatten_text(input: str) -> str:
  patterns = [
    r"WEBVTT\n{1}",
    r"\d+\n\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}",
    r"\n{3}"r"\n{3}"
  ]

  output = sub(patterns[0], "", input)
  output = sub(patterns[1], "", output)
  output = sub(patterns[2], " ", output)
  return output.strip()

def flatten_text_yt(input: str) -> str:
    patterns = [
        r"\n{1}"
    ]
    output = sub(patterns[0], " ", input)
    return output.strip()


def get_youtube_video_id(url):
    """Extrae el ID de un video de YouTube desde su URL."""
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
        r"youtu\.be\/([0-9A-Za-z_-]{11})"
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None
