from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth import login, authenticate, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.decorators import login_required,user_passes_test
from .models import Cupon, Suscripcion, Producto, Categoria, SubCategoria, User_direccion, Suscripcion
from .forms import ProductoForm, DireccionForm, SuscripcionForm, CuponForm
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import transaction
from django.utils import timezone


# List of URLs that require authentication
protected_urls = [
    '/shopWeb/profile',  # Añade aquí todas las URLs que requieran autenticación
    '/shopWeb/admin/productos/',
    '/shopWeb/admin/productos/agregar',
    '/shopWeb/admin/productos/editar/<int:id>',
    '/shopWeb/productos/eliminar/<int:id>',
    '/shopWeb/profile/direcciones/',
    '/shopWeb/profile/agregar',
    '/shopWeb/profile/editar/<int:direccion_id>',
    '/shopWeb/profile/eliminar_direccion/<int:direccion_id>',
    '/shopWeb/profile/suscripcion/',
    '/shopWeb/profile/cancelar_suscripcion/',
    '/shopWeb/admin/gestion_cupones/',
    '/shopWeb/admin/cupones/agregar',
    '/shopWeb/admin/cupones/editar/<int:id>',
    '/shopWeb/admin/cupones/eliminar/<int:id>',
]

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
        if user is not None:
            if user.is_superuser:
                login(request, user)
                return JsonResponse({'error': False, 'message': "Inicio de sesión exitoso."})
            else:
                login(request, user)
                return JsonResponse({'error': False, 'redirect_url': '/shopWeb/index'})
    return JsonResponse({'error': True, 'message': "Método no permitido."})
 
# LOGOUT
def logout_view(request):
    referer = request.META.get('HTTP_REFERER', '')

    logout(request)
    
    if any(url in referer for url in protected_urls):
        return redirect('/shopWeb/index')
    else:
        return redirect(referer or '/shopWeb/index')

# DETERMINAR ADMINISTRADORES
def es_admin(user):
    return user.is_staff

# INFO 
def politicas(request):
    return render(request, 'shopWeb/info/politicas.html')

def sobre_nosotros(request):
    return render(request,'shopWeb/info/sobre_nosotros.html')


#PERFIL 
def profile(request):
    user = request.user
    direcciones = User_direccion.objects.filter(user=request.user)
    suscripcion = Suscripcion.objects.filter(user=request.user).first() 



    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Mantiene al usuario logueado después del cambio de contraseña
            return JsonResponse({'error': False, 'message': '¡Tu contraseña ha sido actualizada correctamente!'})
        else:
            errors = {}
            for field in form.errors:
                errors[field] = form.errors[field][0]
            return JsonResponse({'error': True, 'errors': errors})
    else:
        form = PasswordChangeForm(request.user)

    context = {
        'user': user,
        'form': form,
        'direcciones': direcciones,
        'suscripcion': suscripcion
    }
    
    return render(request, 'shopWeb/perfil_cliente/profile.html', context)

# PERFIL - CRUD DIRECCIONES

@login_required
def direcciones(request):
    direcciones = User_direccion.objects.filter(user=request.user)
    return render(request, 'shopWeb/perfil_cliente/direcciones.html', {'direcciones': direcciones})

@login_required
def agregar_direccion(request):
    form=DireccionForm(request.POST)
    if form.is_valid():
        direccion = form.save(commit=False)
        direccion.user = request.user
        direccion.save()
        return redirect('direcciones')
    else:
        form = DireccionForm()
    return render(request, 'shopWeb/perfil_cliente/agregar_direccion.html', {'form': form})

@login_required
def editar_direccion(request, direccion_id):
    direccion = get_object_or_404(User_direccion, id_direccion=direccion_id, user=request.user)
    if request.method == 'POST':
        form = DireccionForm(request.POST, instance=direccion)
        if form.is_valid():
            form.save()
            return redirect('direcciones')
    else:
        form = DireccionForm(instance=direccion)
    return render(request, 'shopWeb/perfil_cliente/editar_direccion.html', {'form': form})

@login_required
def eliminar_direccion(request, direccion_id):
    direccion = User_direccion.objects.get(id_direccion=direccion_id, user=request.user)
    if request.method == 'POST':
        direccion.delete()
        return redirect('direcciones')
    
# PERFIL - SUSCRIPCIÓN
@login_required
def suscripcion(request):
    usuario = request.user
    suscripcion_actual = Suscripcion.objects.filter(user=usuario).first()
    
    # Verificar si existe una suscripción activa
    if suscripcion_actual:
        print("ACTIVA:", suscripcion_actual.activa)
    else:
        print("No hay suscripción activa")

    if request.method == 'POST':
        form = SuscripcionForm(request.POST)
        if form.is_valid():
            monto_donacion = form.cleaned_data.get('monto_elegido')
            duracion_suscripcion = form.cleaned_data.get('duracion')
            monto_otro = form.cleaned_data.get('monto_otro')

            if monto_donacion == 'otro':
                monto_donacion = monto_otro

            if suscripcion_actual :
                suscripcion_actual.monto = monto_donacion
                suscripcion_actual.duracion = duracion_suscripcion
                suscripcion_actual.activa = True  # Asegurarse de establecer el valor activa
                suscripcion_actual.fecha_inicio = timezone.now()  # Actualiza la fecha de inicio
                suscripcion_actual.save()
            else:
                suscripcion_nueva = Suscripcion(
                    user=usuario,
                    monto=monto_donacion,
                    duracion=duracion_suscripcion,
                    activa=True
                )
                suscripcion_nueva.save()

            messages.success(request, 'Suscripción actualizada correctamente.')
            return redirect('suscripcion')
    else:
        form = SuscripcionForm()

    context = {
        'suscripcion': suscripcion_actual,
        'form': form
    }
    return render(request, 'shopWeb/perfil_cliente/suscripcion.html', context)

@csrf_exempt
def rest_simulado_suscripcion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        accion = data.get('accion')
        usuario_id = data.get('usuario_id')

        if accion == 'ingresar_suscriptores':
            # Simular ingreso de suscriptores
            usuario = get_object_or_404(User, pk=usuario_id)
            suscripcion_nueva = Suscripcion(user=usuario)
            suscripcion_nueva.save()
            return JsonResponse({'message': 'Suscriptor ingresado correctamente.'})

        elif accion == 'eliminar_suscriptores':
            # Simular eliminación de suscriptores
            usuario = get_object_or_404(User, pk=usuario_id)
            suscripcion = Suscripcion.objects.filter(user=usuario).first()
            if suscripcion:
                suscripcion.delete()
                return JsonResponse({'message': 'Suscripción eliminada correctamente.'})
            else:
                return JsonResponse({'message': 'El usuario no tiene suscripción activa.'})

        elif accion == 'consultar_vigencia':
            # Simular consulta de vigencia de suscripción
            usuario = get_object_or_404(User, pk=usuario_id)
            suscripcion = Suscripcion.objects.filter(user=usuario, activa=True).first()
            if suscripcion:
                return JsonResponse({'message': f'El usuario está suscrito hasta {suscripcion.fecha_fin}.'})
            else:
                return JsonResponse({'message': 'El usuario no tiene suscripción activa.'})

    return JsonResponse({'error': True, 'message': 'Método no permitido.'})

@login_required
def cancelar_suscripcion(request):
    user = request.user
    suscripcion = Suscripcion.objects.filter(user=user, activa=True).first()

    if suscripcion:
        suscripcion.activa = False  # Marcar como inactiva
        suscripcion.save()
        messages.success(request, "Suscripción cancelada exitosamente.")
    else:
        messages.error(request, "No se encontró una suscripción activa para cancelar.")

    return redirect('profile')

#CARRITO DE COMPRAS

@csrf_exempt
def guardar_carrito(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            carrito = data.get('carrito', [])
            request.session['carrito'] = carrito
            # Guardar el carrito también en las cookies si es necesario
            response = JsonResponse({'success': True})
            response.set_cookie('carrito', json.dumps(carrito))  # Ejemplo de cómo guardar en las cookies
            return response
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

@csrf_exempt
@login_required
def aplicar_cupon(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos: ", data)  # Añadir para depuración
            codigo_cupon = data.get('codigo_cupon', '')
            cupon = get_object_or_404(Cupon, codigo=codigo_cupon, fecha_inicio__lte=timezone.now(), fecha_fin__gte=timezone.now())
            cupon_descuento = cupon.descuento
            return JsonResponse({'success': True, 'descuento': cupon_descuento})
        except Cupon.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Cupón no válido o ya usado'})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

def carro_compras(request):
    carrito_cookie = request.COOKIES.get('carrito', '[]')
    carrito = json.loads(carrito_cookie)
    usuario = request.user
    descuento_suscripcion = 0
    if usuario.is_authenticated:
        suscripcion = Suscripcion.objects.filter(user=usuario, activa=True).first()
        if suscripcion:
            descuento_suscripcion = 5  # Ajusta el valor según sea necesario
    
    context = {
        'productos_carrito': carrito,
        'descuento_suscripcion': descuento_suscripcion
    }
    return render(request, 'shopWeb/perfil_cliente/carro_compras.html', context)

@csrf_exempt
@login_required
@require_POST
def procesar_pago(request):
    if request.method == 'POST':
        try:
            carrito = request.session.get('carrito', [])
            cupon_codigo = request.POST.get('cupon_codigo', '')
            cupon_descuento = 0

            if cupon_codigo:
                cupon = get_object_or_404(Cupon, codigo=cupon_codigo, usado=False, fecha_expiracion__gte=timezone.now())
                cupon_descuento = cupon.descuento
                cupon.usado = True
                cupon.save()

            suscripcion = Suscripcion.objects.filter(user=request.user, activa=True).first()
            descuento_suscripcion = 5 if suscripcion else 0

            with transaction.atomic():
                for item in carrito:
                    producto_id = item['producto']['id']
                    cantidad = item['cantidad']
                    producto = get_object_or_404(Producto, id_producto=int(producto_id))

                    if producto.stock >= cantidad:
                        producto.stock -= cantidad
                        producto.save()
                    else:
                        return JsonResponse({'error': True, 'message': f"No hay suficiente stock para {producto.nombre}."})

                total = sum(item['producto']['precio'] * item['cantidad'] for item in carrito)
                total_descuento = total * (1 - (descuento_suscripcion + cupon_descuento) / 100)
                request.session['carrito'] = []

                return JsonResponse({'error': False, 'message': 'Pago procesado correctamente.', 'total': total_descuento})

        except Exception as e:
            return JsonResponse({'error': True, 'message': str(e)}, status=500)

    return JsonResponse({'error': True, 'message': 'Método no permitido.'})
#PRODUCTOS

def productos_view(request, categoria_nombre, subcategoria_nombre):
    categoria = get_object_or_404(Categoria, categoria_nombre=categoria_nombre)
    subcategoria = get_object_or_404(SubCategoria, subcategoria_nombre=subcategoria_nombre, categoria=categoria)
    productos = Producto.objects.filter(id_categoria=categoria, id_subcategoria=subcategoria)



    context = {
        'productos': productos,
        'categoria_nombre': categoria_nombre,
        'subcategoria_nombre': subcategoria_nombre,
    }

    return render(request, 'shopWeb/productos/productos.html', context)

def all_productos_view(request):
    
    productos = Producto.objects.all()
  

    context = {
        'productos': productos,
    }
    return render(request, 'shopWeb/productos/productos.html', context)


#CATEGORIA PRODUCTOS
def cat_herramientas(request):
    return render(request, 'shopWeb/productos/cat_herramientas.html')

def cat_plantas(request):
    return render(request, 'shopWeb/productos/cat_plantas.html')

def cat_insumos(request):
    return render(request, 'shopWeb/productos/cat_insumos.html')


# CRUD PRODUCTOS

def get_subcategorias(request, categoria_id):
    subcategorias = list(SubCategoria.objects.filter(categoria_id=categoria_id).values('subcategoria_id', 'subcategoria_nombre'))
    return JsonResponse(subcategorias, safe=False)

@login_required
@user_passes_test(es_admin)
def productos(request):
    productos = Producto.objects.all()
    return render(request, 'shopWeb/admin/productos.html', {'productos': productos})

@login_required
@user_passes_test(es_admin)
def producto_nuevo(request):
    if request.method == 'POST':
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('productos_admin')
        else:
            print(form.errors)
    else:
        form = ProductoForm()
    categorias = Categoria.objects.all()
    subcategorias = SubCategoria.objects.all() 
    return render(request, 'shopWeb/admin/producto_nuevo.html', {'form': form, 'categorias': categorias, 'subcategorias': subcategorias})

@login_required
@user_passes_test(es_admin)
def producto_editar(request, id):
    producto = get_object_or_404(Producto, id_producto=id)
    if request.method == 'POST':
        form = ProductoForm(request.POST, request.FILES, instance=producto)
        if form.is_valid():
            form.save()
            return redirect('productos')
    else:
        form = ProductoForm(instance=producto)
    categorias = Categoria.objects.all()
    subcategorias = SubCategoria.objects.filter(categoria=producto.id_categoria)
    return render(request, 'shopWeb/admin/producto_editar.html', {
        'form': form,
        'producto': producto,
        'categorias': categorias,
        'subcategorias': subcategorias
    })

@login_required
@user_passes_test(es_admin)
def producto_eliminar(request, id):
    producto = get_object_or_404(Producto, id_producto=id)
    producto.delete()
    return redirect('productos')

# CRUD DE CUPONES

@login_required
@user_passes_test(es_admin)
def gestion_cupones(request):
    cupones = Cupon.objects.all()  # Cambia el nombre de la variable aquí
    return render(request, 'shopWeb/admin/gestion_cupones.html', {'cupones': cupones})


@login_required
@user_passes_test(es_admin)
def cupon_nuevo(request):
    if request.method == 'POST':
        form = CuponForm(request.POST)
        if form.is_valid():
            form.save()  # Guarda el formulario, que es un ModelForm, por lo que puede llamar directamente a save()
            return redirect('gestion_cupones')
        else:
            print(form.errors)
    else:
        form = CuponForm()
    return render(request, 'shopWeb/admin/cupon_nuevo.html', {'form': form})

@login_required
@user_passes_test(es_admin)
def cupon_editar(request, id):
    cupon = get_object_or_404(Cupon, id_cupon=id)
    if request.method == 'POST':
        form = CuponForm(request.POST, request.FILES, instance=cupon)
        if form.is_valid():
            form.save()
            return redirect('gestion_cupones')
    else:
        form = CuponForm(instance=cupon)
    
    return render(request, 'shopWeb/admin/cupon_editar.html', {
        'form': form,
        'cupon': cupon
    })

@login_required
@user_passes_test(es_admin)
def cupon_eliminar(request, id):
    cupon = get_object_or_404(Cupon, id_cupon=id)  # Asegúrate de que busque en la clase Cupon
    cupon.delete()
    return redirect('gestion_cupones')


# CRUD DE PEDIDOS 
""" @login_required
@user_passes_test(es_admin)
def pedidos(request):
    return render(request, 'shopWeb/admin/pedidos.html')

@login_required
@user_passes_test(es_admin)
def pedido_nuevo(request):
    return render(request, 'shopWeb/admin/pedido_nuevo.html')

@login_required
@user_passes_test(es_admin)
def pedido_editar(request):
    return render(request, 'shopWeb/admin/pedido_editar.html')

@login_required
@user_passes_test(es_admin)
def pedido_eliminar(request):
    return render(request, 'shopWeb/admin/pedido_eliminar.html') """
