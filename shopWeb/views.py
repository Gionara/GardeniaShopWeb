from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout


# Create your views here.

#INDEX

def index(request):
    return render(request, 'shopWeb/index.html')

# REGISTER
def register(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        apellido = request.POST.get('apellido')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Verificar si el email ya está registrado
        if User.objects.filter(username=email).exists():
            messages.error(request, "El correo electrónico ya está registrado, por favor inicie sesión.")
            return render(request, 'shopWeb/register.html')
        else:
            # Si el email no está registrado, procede a crear el usuario
            user = User.objects.create_user(username=email, email=email, password=password, first_name=nombre, last_name=apellido)
            user.save()
            return JsonResponse({'error': False, 'redirect_url': '/shopWeb/index'})

    # Borra cualquier mensaje previo antes de renderizar la página de registro
    messages.used = True

    return render(request, 'shopWeb/register.html')

# LOGIN
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Verificar si el usuario existe
        user = User.objects.filter(username=email).first()
        if user is None:
            return JsonResponse({'error': True, 'field': 'email', 'message': "El correo electrónico no está registrado."})

        # Verificar si la contraseña es correcta
        if not user.check_password(password):
            return JsonResponse({'error': True, 'field': 'password', 'message': "La contraseña es incorrecta."})

        # Iniciar sesión si el usuario y contraseña son válidos
        login(request, user)
        return JsonResponse({'error': False, 'message': "Inicio de sesión exitoso."})

    return JsonResponse({'error': True, 'message': "Método no permitido."})
 
# LOGOUT
def logout_view(request):
    logout(request)
    return redirect(request.META.get('HTTP_REFERER', '/'))
# INFO 
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

