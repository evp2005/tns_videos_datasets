import json
from django.shortcuts import render
from django.http import JsonResponse
from .agent_tools import extract_title_urls
from django.views.decorators.csrf import csrf_exempt

