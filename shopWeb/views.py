from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.

#INDEX

def index(request):
    return render(request, 'shopWeb/index.html')


#INFO 
def politicas(request):
    return render(request, 'shopWeb/info/politicas.html')

def sobre_nosotros(request):
    return render(request,'shopWeb/info/sobre_nosotros.html')

#PRODUCTOS

def all_products(request):
    return render(request, 'shopWeb/productos/all_products.html')

#CATEGORIA HERRAMIENTAS
def cat_herramientas(request):
    return render(request, 'shopWeb/productos/cat_herramientas/cat_herramientas.html')

def palas(request):
    return render(request, 'shopWeb/productos/cat_herramientas/palas.html')

def tijeras(request):
    return render(request, 'shopWeb/productos/cat_herramientas/tijeras.html')

def otras_herramientas(request):
    return render(request, 'shopWeb/productos/cat_herramientas/otras_herramientas.html')

#CATEGORIA PLANTAS Y SEMILLAS

def cat_plantas(request):
    return render(request, 'shopWeb/productos/cat_plantas/cat_plantas.html')

def flores(request):
    return render(request, 'shopWeb/productos/cat_plantas/flores.html')

def huerto(request):
    return render(request, 'shopWeb/productos/cat_plantas/huerto.html')

def plantas_arboles(request):
    return render(request, 'shopWeb/productos/cat_plantas/plantas_arboles.html')

#CATEGORIA INSUMOS

def cat_insumos(request):
    return render(request, 'shopWeb/productos/cat_insumos/cat_insumos.html')

def fertilizantes(request):
    return render(request, 'shopWeb/productos/cat_insumos/fertilizantes.html')

def otros_insumos(request):
    return render(request, 'shopWeb/productos/cat_insumos/otros_insumos.html')

def tierra(request):
    return render(request, 'shopWeb/productos/cat_insumos/tierra.html')

