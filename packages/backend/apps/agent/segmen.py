from moviepy.editor import VideoFileClip
import json
import os

class Segmentacion:
    def __init__(self):
        pass

    def extract_time_info(self, minutes_json):
        """
        Extrae la información de tiempos de un JSON o diccionario.
        Retorna una tupla (total_segundos_inicio, total_segundos_fin).
        """
        # Manejar entrada tanto si es string (JSON) como si ya es diccionario
        clips_number= len(minutes_json)*2
        if isinstance(minutes_json, str):
            data_loaded = json.loads(minutes_json)
        else:
            data_loaded = minutes_json

        minutos_i = int(minuto_i)
        minutos_f = int(minuto_f)
        
        segundos_i = int(round((minuto_i - minutos_i) * 100))
        segundos_f = int(round((minuto_f - minutos_f) * 100))
        
        total_segundos_i = minutos_i * 60 + segundos_i
        # Se agregan 2 segundos extra al final como en la lógica original
        total_segundos_f = minutos_f * 60 + segundos_f + 2
        
        print(f"Tiempos calculados: Inicio={total_segundos_i}s, Fin={total_segundos_f}s")
        return total_segundos_i, total_segundos_f

    def cut_and_save_video(self, video_path: str, output_name: str, start_seconds: int, end_seconds: int):
        """
        Corta el video usando los segundos de inicio y fin, y lo guarda con el nombre especificado.
        """
        try:
            if not os.path.exists(video_path):
                print(f"Error: El archivo de video no existe en {video_path}")
                return

            video = VideoFileClip(video_path)
            
            # Asegurarse de que los tiempos estén dentro de la duración del video
            if start_seconds < 0: start_seconds = 0
            if end_seconds > video.duration: end_seconds = video.duration
            
            video_recortado = video.subclip(start_seconds, end_seconds)
            
            output_filename = f"{output_name}.mp4"
            video_recortado.write_videofile(output_filename, codec="libx264", audio_codec="aac")
            
            video_recortado.close()
            video.close()
            print(f"Video guardado exitosamente como {output_filename}")
            
        except Exception as e:
            print(f"Ocurrió un error al procesar el video: {str(e)}")

    def generate_clips(self, minutes_json, video_path: str, output_name: str):
        """
        Genera clips basados en una lista de segmentos de tiempo.
        time_segments: Lista de diccionarios o tuplas [{'start': 10, 'end': 20}, ...]
        """
        clip_numbers= len(minutes_json)
        if isinstance(minutes_json, str):
            data_loaded = json.loads(minutes_json)
        else:
            data_loaded = minutes_json

        for i in range(clip_numbers):
            minuto_i = float(data_loaded[f"clip{i+1}"]['minuto_inicio'])
            minuto_f = float(data_loaded[f"clip{i+1}"]['minuto_fin'])

            minutos_i = int(minuto_i)
            minutos_f = int(minuto_f)
            segundos_i = int(round((minuto_i - minutos_i) * 100))
            segundos_f = int(round((minuto_f - minutos_f) * 100))
            
            total_segundos_i = minutos_i * 60 + segundos_i
            # Se agregan 2 segundos extra al final como en la lógica original
            total_segundos_f = minutos_f * 60 + segundos_f + 2

            try:
                if not os.path.exists(video_path):
                    print(f"Error: El archivo de video no existe en {video_path}")

                video = VideoFileClip(video_path)
                    
                # Asegurarse de que los tiempos estén dentro de la duración del video
                if total_segundos_i < 0: total_segundos_i = 0
                if total_segundos_f > video.duration: total_segundos_f = video.duration
                    
                video_recortado = video.subclip(total_segundos_i, total_segundos_f)
                    
                output_filename = f"{output_name}_{i+1}.mp4"
                video_recortado.write_videofile(output_filename, codec="libx264", audio_codec="aac")
                    
                video_recortado.close()
                video.close()
                print(f"Video guardado exitosamente como {output_filename}\n-------------------------------------------------------") 
            except Exception as e:
                print(f"Ocurrió un error al procesar el video: {str(e)}")
                


data = {
    "clip1": {
        "minuto_inicio": "1.00",
        "minuto_fin": "2.00"
    },

    "clip2": {
        "minuto_inicio": "5.00",
        "minuto_fin": "6.00"
    },
    
    "clip3": {
        "minuto_inicio": "8.00",
        "minuto_fin": "10.00"
    }
}

segmentador = Segmentacion()

    # Ejemplo de uso original
    # 1. Extraer información
#t_inicio, t_fin = segmentador.extract_time_info(data)
    
    # 2. Cortar video (Asegúrate de tener un video de prueba o ajustar la ruta)
#segmentador.cut_and_save_video("dross.mp4", "video_recortado", t_inicio, t_fin)

    # Ejemplo de nueva funcionalidad: Definir tiempos manualmente
#tiempos_clips = [
    #{'start': 10, 'end': 15},
   # {'start': 30, 'end': 45},
    #{'start': 60, 'end': 70}
    #]

segmentador.generate_clips(data,"dross.mp4", "clips")

