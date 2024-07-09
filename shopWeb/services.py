import json
import random  # Para simular respuestas aleatorias

# Simulación de URL de API (puedes ajustar según necesites)
FUNDACION_URL = "https://api.fundacion.com"

# Simulación de funciones de API
def registrar_suscriptor(user, monto, duracion):
    # Simular respuesta exitosa o error ocasionalmente
    if random.random() < 0.9:  # 90% de éxito
        return {"success": True, "message": "Simulación: Suscriptor registrado correctamente."}
    else:
        return {"success": False, "message": "Simulación: Error al registrar suscriptor."}

def eliminar_suscriptor(user):
    # Simular respuesta exitosa o error ocasionalmente
    if random.random() < 0.9:  # 90% de éxito
        return {"success": True, "message": "Simulación: Suscriptor eliminado correctamente."}
    else:
        return {"success": False, "message": "Simulación: Error al eliminar suscriptor."}

def consultar_vigencia(user):
    # Simular respuesta exitosa o error ocasionalmente
    if random.random() < 0.9:  # 90% de éxito
        return {"success": True, "vigencia": "Activa hasta DD/MM/AAAA"}  # Simular fecha de vigencia
    else:
        return {"success": False, "message": "Simulación: Error al consultar vigencia."}
