from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('index', views.index, name='index'),
   
# USUARIOS   
    path('register', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile', views.profile, name='profile'),
    path('carro_compras', views.carro_compras, name='carro_compras'),
    path('procesar_pago/', views.procesar_pago, name='procesar_pago'),

# INFO GARDENIA 
    path('politicas', views.politicas, name='politicas'),
    path('sobre_nosotros', views.sobre_nosotros, name='sobre_nosotros'),
   
   # PRODUCTOS VISTAS
    path('productos/<str:categoria_nombre>/<str:subcategoria_nombre>/', views.productos_view, name='productos'),
    path('productos/', views.all_productos_view, name='productos'),

    
    path('cat_herramientas', views.cat_herramientas, name='cat_herramientas'),   
    path('cat_plantas', views.cat_plantas, name='cat_plantas'),
    path('cat_insumos', views.cat_insumos, name='cat_insumos'),
   
   
  #CRUD DE PRODUCTOS 
    path('admin/productos/', views.productos, name='productos_admin'),
    path('admin/productos/agregar', views.producto_nuevo, name='agregar_producto'),
    path('admin/productos/editar/<int:id>', views.producto_editar, name='editar_producto'),
    path('admin/productos/eliminar/<int:id>', views.producto_eliminar, name='eliminar_producto'),
    path('get_subcategorias/<int:categoria_id>/', views.get_subcategorias, name='get_subcategorias'),
]


# SETTINGS MEDIA

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
