from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('index', views.index, name='index'),
    path('register', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile', views.profile, name='profile'),
    path('politicas', views.politicas, name='politicas'),
    path('sobre_nosotros', views.sobre_nosotros, name='sobre_nosotros'),
    path('all_products', views.all_products, name='all_products'),
    path('cat_herramientas', views.cat_herramientas, name='cat_herramientas'),
    path('palas', views.palas, name='palas'),
    path('tijeras', views.tijeras, name='tijeras'),
    path('otras_herramientas', views.otras_herramientas, name='otras_herramientas'),
    path('cat_plantas', views.cat_plantas, name='cat_plantas'),
    path('flores', views.flores, name='flores'),
    path('huerto', views.huerto, name='huerto'),
    path('plantas_arboles', views.plantas_arboles, name='plantas_arboles'),
    path('cat_insumos', views.cat_insumos, name='cat_insumos'),
    path('fertilizantes', views.fertilizantes, name='fertilizantes'),
    path('otros_insumos', views.otros_insumos, name='otros_insumos'),
    path('tierra', views.tierra, name='tierra'),
    path('admin/productos/', views.productos, name='productos'),
    path('admin/productos/agregar', views.producto_nuevo, name='agregar_producto'),
    path('admin/productos/editar/<int:id>', views.producto_editar, name='editar_producto'),
    path('admin/productos/eliminar/<int:id>', views.producto_eliminar, name='eliminar_producto'),
    path('get_subcategorias/<int:categoria_id>/', views.get_subcategorias, name='get_subcategorias'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
