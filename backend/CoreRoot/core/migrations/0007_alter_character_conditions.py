# Generated by Django 4.0.4 on 2022-08-18 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_character_conditions_alter_character_statblock'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='conditions',
            field=models.CharField(choices=[('GR', 'Grappled'), ('PA', 'Paralyzed'), ('RE', 'Restrained'), ('PR', 'Prone'), ('PO', 'Poisoned')], max_length=2, null=True),
        ),
    ]
