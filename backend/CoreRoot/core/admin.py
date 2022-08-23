from django.contrib import admin

from .models import Workspace,Canvas,Note,CombatTracker,Character

class WorkspaceAdmin(admin.ModelAdmin):
    readonly_fields = ('id'),

class CanvasAdmin(admin.ModelAdmin):
    readonly_fields = ('id'),

class NoteAdmin(admin.ModelAdmin):
    readonly_fields = ('id'),

class CombatTrackerAdmin(admin.ModelAdmin):
    readonly_fields = ('id'),

class CharacterAdmin(admin.ModelAdmin):
    readonly_fields = ('id'),

admin.site.register(Workspace,WorkspaceAdmin)
admin.site.register(Canvas,CanvasAdmin)
admin.site.register(Note,NoteAdmin)
admin.site.register(CombatTracker,CombatTrackerAdmin)
admin.site.register(Character,CharacterAdmin)

# Register your models here.
