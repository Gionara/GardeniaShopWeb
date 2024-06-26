from django.db import models
from django.contrib.auth.models import User

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
    id_direccion=models.AutoField(primary_key=True)
    direccion = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.username

class Pedido(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_pedido = models.AutoField(primary_key=True)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    fecha_entrega = models.DateTimeField()
    direccion = models.ForeignKey(User_direccion, on_delete=models.CASCADE)
    total = models.IntegerField()
    estado = models.CharField(max_length=50)
    pagado = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    