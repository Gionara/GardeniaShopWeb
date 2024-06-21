from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Categoria(models.Model):
    id_categoria = models.AutoField(db_column='idCategoria', primary_key=True)
    categoria    = models.CharField(max_length=20, blank=False , null=False)   


    def __str__(self):
        return  str(self.id_categoria)
    
class SubCategoria(models.Model):
    id_categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE, db_column='idCategoria')
    id_subcategoria = models.AutoField(db_column='idSubCategoria', primary_key=True)
    subcategoria = models.CharField(max_length=20, blank=False , null=False)   


    def __str__(self):
        return str(self.id_categoria) +" "+ str(self.id_subcategoria) +" "+ str(self.subcategoria)


class Producto(models.Model):
    id_categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE, db_column='idCategoria', related_name='productos')
    id_subcategoria = models.ForeignKey('SubCategoria', on_delete=models.CASCADE, db_column='idSubCategoria', related_name='productos', default=1)  # Asegúrate de que '1' sea una subcategoría válida
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    precio = models.IntegerField()
    stock = models.IntegerField()
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    img = models.ImageField(upload_to='productos/')

    def __str__(self):
        return f'{self.nombre} - {self.id_categoria.categoria} - {self.id_subcategoria.subcategoria}'


# USER 

    
class User_direccion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    direccion = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.username