# Generated by Django 4.0.4 on 2022-08-18 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_alter_character_conditions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='conditions',
            field=models.CharField(blank=True, default='', max_length=2),
        ),
    ]
