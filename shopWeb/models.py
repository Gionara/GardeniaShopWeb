from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from dateutil.relativedelta import relativedelta  # Importa relativedelta

class Categoria(models.Model):
    categoria_id = models.AutoField(primary_key=True)
    categoria_nombre = models.CharField( max_length=50)

    def __str__(self):
        return self.categoria_nombre

class SubCategoria(models.Model):
    subcategoria_id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='categorias_productos')
    subcategoria_nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.subcategoria_nombre

class Producto(models.Model):
    id_categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='categoria_producto')
    id_subcategoria = models.ForeignKey(SubCategoria, on_delete=models.CASCADE, related_name='subcategoria_producto')
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80)
    precio = models.IntegerField()
    stock = models.IntegerField()
    descripcion = models.CharField(max_length=250, blank=True, null=True)
    img = models.ImageField(upload_to='productos/', null=True, blank=True)

    def __str__(self):
        return f'{self.nombre} - {self.id_categoria.categoria_nombre} - {self.id_subcategoria.subcategoria_nombre}'

class User_direccion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_direccion = models.AutoField(primary_key=True)
    nombre_dirreccion= models.CharField( max_length=100, default='Dirrección de envio')
    direccion = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.username


class Suscripcion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
    duracion = models.IntegerField()  # Duración en meses
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    activa = models.BooleanField(default=False)

    MONTOS_OPCIONES = (
        (5000, '5000 pesos'),
        (10000, '10000 pesos'),
        (15000, '15000 pesos'),
        ('otro', 'Otro monto'),
    )

    def __str__(self):
        return f"Suscripción de {self.user.username} - Monto: {self.monto} - Duración: {self.duracion} meses"

    def save(self, *args, **kwargs):
        # Asignar fecha de inicio actual si no está definida
        if not self.fecha_inicio:
            self.fecha_inicio = timezone.now()

        # Calcular la fecha de fin usando relativedelta
        if self.duracion:
            self.fecha_fin = self.fecha_inicio + relativedelta(months=self.duracion)

        # Llamar al método save original
        super(Suscripcion, self).save(*args, **kwargs)

class Cupon(models.Model):
    id_cupon = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=50, unique=True)
    descuento = models.DecimalField(max_digits=5, decimal_places=0)  # porcentaje de descuento
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    activo = models.BooleanField(default=True)
    def __str__(self):
        return self.codigo

    
class Pedido(models.Model):
    ESTADO_CHOICES = (
        ('pagado', 'Pagado'),
        ('preparacion', 'En Preparación'),
        ('enviado', 'Enviado'),
        ('transporte', 'En Transporte'),
        ('entregado', 'Entregado'),
    )
    id_pedido = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    direccion_envio = models.ForeignKey(User_direccion, on_delete=models.SET_NULL, null=True)
    total_pagado = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    estado_envio = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pagado')

class PedidoProducto(models.Model):
    id_pedido_producto = models.AutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2,default=0)  # Campo para el precio del producto en el momento del pedido
    cantidad = models.IntegerField(default=1)