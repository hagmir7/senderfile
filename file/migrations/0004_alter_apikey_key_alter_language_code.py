# Generated by Django 4.2.7 on 2024-03-10 13:26

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('file', '0003_apikey_status_alter_apikey_key'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apikey',
            name='key',
            field=models.UUIDField(default=uuid.uuid4, unique=True),
        ),
        migrations.AlterField(
            model_name='language',
            name='code',
            field=models.CharField(max_length=5, unique=True),
        ),
    ]
