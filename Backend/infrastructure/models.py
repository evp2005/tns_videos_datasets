from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    rol= models.CharField(max_length=50, default='Editor')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.username

class Video(models.Model):
    title = models.CharField(max_length=200)
    video_path = models.FileField(upload_to="video/", null=True, blank=True)
    origin_video = models.CharField(max_length=100)
    duration = models.CharField(max_length=20)
    state = models.CharField(max_length=50, default='Pending')
    language = models.CharField(max_length=50, default='Español')
    url_video = models.URLField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lot = models.ForeignKey('Lots', on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.title

class Transcription(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    text = models.TextField()
    srt_vtt = models.FileField(upload_to="transcriptions/", null=True, blank=True)
    mardown = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_segments = models.IntegerField(default=0)
    def __str__(self):
        return f"Transcription for {self.video.title}"
    
class Segment(models.Model):
    tema = models.CharField(max_length=200)
    importence = models.CharField(max_length=200)
    text = models.TextField()
    start_time = models.DurationField()
    end_time = models.DurationField()
    segment_from_transcription = models.ForeignKey(Transcription, on_delete=models.CASCADE, related_name='segments')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Segment {self.start_time} - {self.end_time} for {self.transcription.video.title}"

class Lots(models.Model):
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100)
    url = models.URLField(null=True, blank=True)
    csv_file = models.FileField(upload_to="lots_csv/", null=True, blank=True)
    total_videos = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    
class Templates(models.Model):
    name = models.CharField(max_length=200)
    structure = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

