# Generated by Django 5.0.6 on 2024-07-14 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shopWeb', '0015_remove_pedido_direccion_remove_pedido_estado_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pedidoproducto',
            name='precio',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
