from django.contrib import admin
from .models import Categoria,SubCategoria,Producto, Pedido, User_direccion

# Register your models here.

admin.site.register(Categoria)
admin.site.register(SubCategoria)
admin.site.register(Producto)
admin.site.register(Pedido)
admin.site.register(User_direccion)

