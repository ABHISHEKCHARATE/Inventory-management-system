# Generated by Django 4.2.18 on 2025-01-18 05:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Inventory_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='regularuser',
            name='role',
            field=models.CharField(choices=[('admin', 'Admin'), ('viewer', 'Viewer')], default='viewer', max_length=10),
        ),
    ]
