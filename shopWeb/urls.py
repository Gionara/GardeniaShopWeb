#from django.conf.urls import url

from django.urls import path
from . import views

app_name='shopWeb'

urlpatterns = [
    path('index', views.index, name='index'),
    path('register', views.register, name='register'),

    path('login/', views.login_view, name='login'),  
    path('logout/', views.logout_view, name='logout'),  

    path('politicas',views.politicas, name='politicas'),
    path('sobre_nosotros',views.sobre_nosotros, name='sobre_nosotros'),
    path('all_products',views.all_products, name='all_products'),
    path('cat_herramientas',views.cat_herramientas, name='cat_herramientas'),
    path('palas',views.palas, name='palas'),
    path('tijeras',views.tijeras, name='tijeras'),
    path('otras_herramientas',views.otras_herramientas, name='otras_herramientas'),
    path('cat_plantas',views.cat_plantas, name='cat_plantas'),
    path('flores',views.flores, name='flores'),
    path('huerto',views.huerto, name='huerto'),
    path('plantas_arboles',views.plantas_arboles, name='plantas_arboles'),
    path('cat_insumos',views.cat_insumos, name='cat_insumos'),
    path('fertilizantes',views.fertilizantes, name='fertilizantes'),
    path('otros_insumos',views.otros_insumos, name='otros_insumos'),
    path('tierra',views.tierra, name='tierra'),

]