import json
from django.shortcuts import render
from django.http import JsonResponse
from .urls_extractor import extract_title_urls
from django.views.decorators.csrf import csrf_exempt

