from django import forms
from .models import Producto, User_direccion,Cupon, Suscripcion

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

class CuponForm(forms.ModelForm):
    class Meta:
        model = Cupon
        fields = '__all__'
        exclude = ['id_cupon']  # Puedes excluir el campo 'id_cupon' si no deseas que se muestre en el formulario
        labels = {
            'codigo': 'Código',
            'descuento': 'Descuento (%)',
            'fecha_inicio': 'Fecha de inicio',
            'fecha_fin': 'Fecha de término',
            'activo': 'Cupon activo',
        }
        widgets = {
            'codigo': forms.TextInput(attrs={'class': 'form-control'}),
            'descuento': forms.NumberInput(attrs={'class': 'form-control'}),
            'fecha_inicio': forms.DateInput(attrs={'class': 'form-control'}),
            'fecha_fin': forms.DateInput(attrs={'class': 'form-control'}),
        }

class SuscripcionForm(forms.Form):
    MONTO_CHOICES = [
        (5000, '5000 CLP'),
        (10000, '10000 CLP'),
        (15000, '15000 CLP'),
        ('otro', 'Otro monto'),
    ]

    monto_elegido = forms.ChoiceField(choices=MONTO_CHOICES, required=True)
    monto_otro = forms.IntegerField(required=False, min_value=5000)
    duracion = forms.IntegerField(required=True, min_value=1, label="Duración (meses)")

    def clean(self):
        cleaned_data = super().clean()
        monto_elegido = cleaned_data.get('monto_elegido')
        monto_otro = cleaned_data.get('monto_otro')

        if monto_elegido == 'otro' and not monto_otro:
            self.add_error('monto_otro', 'Debe ingresar un monto personalizado')
        elif monto_elegido == 'otro' and monto_otro < 5000:
            self.add_error('monto_otro', 'El monto personalizado debe ser al menos 5000 CLP')
        return cleaned_data

