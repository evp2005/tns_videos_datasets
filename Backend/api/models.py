from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.username

class Video(models.Model):
    title = models.CharField(max_length=200)
    video_path = models.FileField(upload_to="video/")
    duration = models.DurationField()
    url = models.URLField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.title
    
# class Transcription(models.Model):
#     video = models.ForeignKey(Video, on_delete=models.CASCADE)
#     text = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     def __str__(self):
#         return f"Transcription for {self.video.title}"
    
