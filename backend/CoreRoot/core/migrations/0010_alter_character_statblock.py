# Generated by Django 4.0.4 on 2022-08-19 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_alter_character_conditions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='statblock',
            field=models.BooleanField(default=True),
        ),
    ]
