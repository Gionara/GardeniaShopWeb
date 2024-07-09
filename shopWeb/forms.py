from django import forms
from .models import Producto, User_direccion, Suscripcion

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = '__all__'
        exclude = ['id_producto']
        labels = {
            'nombre': 'Nombre',
            'precio': 'Precio',
            'stock': 'Stock',
            'descripcion': 'Descripción',
            'img': 'Imagen',
            'id_categoria': 'Categoría',   # Asegúrate de usar el nombre correcto de los campos de clave foránea
            'id_subcategoria': 'Subcategoría',
        }
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control'}),
            'precio': forms.NumberInput(attrs={'class': 'form-control'}),
            'stock': forms.NumberInput(attrs={'class': 'form-control'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control'}),
            'img': forms.FileInput(attrs={'class': 'form-control'}),
            'id_categoria': forms.Select(attrs={'class': 'form-control'}),
            'id_subcategoria': forms.Select(attrs={'class': 'form-control'}),
        }

class DireccionForm(forms.ModelForm):
    class Meta:
        model = User_direccion
        fields = '__all__'
        exclude = ['id_direccion', 'user']
        labels = {
            'nombre_dirreccion': 'Nombre de la dirección',
            'direccion': 'Dirección',
            'ciudad': 'Ciudad',
            'region': 'Región',
            'codigo_postal': 'Código postal',
            'pais': 'País',
            'telefono': 'Teléfono',
        }
        widgets = {
            'nombre_dirreccion': forms.TextInput(attrs={'class': 'form-control'}),
            'direccion': forms.TextInput(attrs={'class': 'form-control'}),
            'ciudad': forms.TextInput(attrs={'class': 'form-control'}),
            'region': forms.TextInput(attrs={'class': 'form-control'}),
            'codigo_postal': forms.TextInput(attrs={'class': 'form-control'}),
            'pais': forms.TextInput(attrs={'class': 'form-control'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control'}),
        }



class SuscripcionForm(forms.ModelForm):
    monto_otro = forms.DecimalField(label='Escribe el monto', required=False, min_value=5000, max_digits=10, decimal_places=0)

    class Meta:
        model = Suscripcion
        fields = ['monto_elegido', 'duracion', 'monto_otro']
        labels = {
            'monto_elegido': 'Monto de la suscripción',
            'duracion': 'Duración en meses',
        }
        widgets = {
            'monto_elegido': forms.Select(choices=Suscripcion.MONTOS_OPCIONES),
        }