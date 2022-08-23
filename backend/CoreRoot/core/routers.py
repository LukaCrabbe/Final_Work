from rest_framework.routers import SimpleRouter
from core.user.viewsets import UserViewSet
from core.auth.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet
from .viewsets import (
    CanvasViewSet,
    NoteViewSet,
    CombatTrackerViewSet,
    CharacterViewSet,
    UserWorkspaceViewset,
    WorkspaceCanvasViewSet,
    NoteCanvasViewSet,
    CombatTrackerCanvasViewSet,
    CombatTrackerCharacterViewSet,
    WorkspaceViewset,
)


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r"auth/login", LoginViewSet, basename="auth-login")
routes.register(r"auth/register", RegistrationViewSet, basename="auth-register")
routes.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")


routes.register(r"canvas", CanvasViewSet, basename="add-canvas")
routes.register(r"note", NoteViewSet, basename="add-note")
routes.register(r"combatTracker", CombatTrackerViewSet, basename="add-combatTracker")
routes.register(r"character", CharacterViewSet, basename="add-character")

routes.register(r"user/workspace", UserWorkspaceViewset, basename="user-workspace")
routes.register(r"workspace", WorkspaceViewset, basename="workspace")
routes.register(
    r"workspace/canvas", WorkspaceCanvasViewSet, basename="workspace-canvas"
)
routes.register(r"canvas/note", NoteCanvasViewSet, basename="canvas-note")
routes.register(
    r"canvas/combat_tracker",
    CombatTrackerCanvasViewSet,
    basename="canvas-combat_tracker",
)
routes.register(
    r"combat_tracker/character",
    CombatTrackerCharacterViewSet,
    basename="combat_tracker-character",
)

# USER
routes.register(r"user", UserViewSet, basename="user")


urlpatterns = [*routes.urls]
