import ffmpeg
from faster_whisper import WhisperModel
import os
from flask import send_file
from typing import Any


AUDIO_FOLDER = os.path.join("history", "audios")


def save_audio_using_m3u8_url(m3u8_url: str, filename: str):
  if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER, exist_ok=True)

  (
    ffmpeg
    .input(m3u8_url)
    .output(f"history/audios/{filename}.m4a", vn=None, acodec="copy")
    .run()
  )
  return f"{filename}.m4a"


def get_saved_audio(audio_path: str) -> Any:
  try:
    if not os.path.exists(audio_path):
      return None
    return send_file(audio_path, mimetype="audio/m4a")
  except Exception:
    return None


def generate_vtt_from_audio(file_path: str, model_size: str = "small") -> str | None:
  try:
    model = WhisperModel(model_size, device="auto", compute_type="int8")

    def format_time(secs: float) -> str:
      hrs = int(secs // 3600)
      mins = int((secs % 3600) // 60)
      seconds = int(secs % 60)
      ms = int((secs % 1) * 1000)
      return f"{hrs:02}:{mins:02}:{seconds:02}.{ms:03}"
    
    segments_srt = ["WEBVTT\n"]
    counter = 1

    segments, info = model.transcribe(file_path, beam_size=5)
    for segment in segments:
      start_time = format_time(segment.start)
      end_time = format_time(segment.end)
      text = segment.text.strip()

      segments_srt.append(
        f"{counter}\n{start_time} --> {end_time}\n{text}\n"
      )
      counter += 1

    return "\n".join(segments_srt)
  except:
    return None