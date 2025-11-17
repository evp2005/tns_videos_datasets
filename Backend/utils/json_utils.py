from json import load, dump
from os.path import exists
from typing import Any


def get_json(file_path: str) -> None | Any:
  if not exists(file_path):
    return None
  try:
    with open(file_path, "r", encoding="utf-8") as f:
      return load(f)
  except Exception:
    return None


def ovewrite_json(file_path: str, new_data) -> bool:
  try:
    with open(file_path, "w", encoding="utf-8") as f:
      dump(new_data, f, ensure_ascii=False, indent=2)
    return True
  except Exception:
    return False