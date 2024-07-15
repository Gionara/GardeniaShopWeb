from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.Categoria)
admin.site.register(models.SubCategoria)
admin.site.register(models.Producto)
admin.site.register(models.User_direccion)
admin.site.register(models.Cupon)
admin.site.register(models.Suscripcion)
admin.site.register(models.Pedido)
admin.site.register(models.PedidoProducto)

