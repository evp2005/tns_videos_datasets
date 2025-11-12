import json
from django.shortcuts import render
from django.http import JsonResponse
from .urls_extractor import extract_title_urls
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def get_title_from_url(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            url = data.get("url")
            title = extract_title_urls(url)
            if not url:
                return JsonResponse({"error": "No URL provided"}, status=400)
            return JsonResponse({"title": title})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST allowed"}, status=405)