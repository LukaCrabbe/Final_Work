from django.db import models
from core.user.models import User

CONDITIONS = (
    ("GR", "Grappled"),
    ("PA", "Paralyzed"),
    ("RE", "Restrained"),
    ("PR", "Prone"),
    ("PO", "Poisoned"),
)


class Workspace(models.Model):
    title = models.CharField(max_length=32)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Canvas(models.Model):
    title = models.CharField(max_length=32)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)


class Note(models.Model):
    title = models.CharField(max_length=32)
    text = models.TextField(default="")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    canvas = models.ForeignKey(Canvas, on_delete=models.CASCADE)


class CombatTracker(models.Model):
    title = models.CharField(max_length=32)
    round = models.IntegerField(default=1)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    canvas = models.ForeignKey(Canvas, on_delete=models.CASCADE)


class Character(models.Model):
    name = models.CharField(max_length=32)
    initiative = models.IntegerField()
    armor_class = models.IntegerField()
    concentration = models.BooleanField(default=False)
    hitpoints = models.IntegerField()
    max_hitpoints = models.IntegerField()
    statblock = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    combat_tracker = models.ForeignKey(CombatTracker, on_delete=models.CASCADE)


# Create your models here.
