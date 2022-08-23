from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework import status
from rest_framework import filters
from django.http import JsonResponse
from .serializers import (
    WorkspaceSerializer,
    CanvasSerializer,
    NoteSerializer,
    CombatTrackerSerializer,
    CharacterSerializer,
    GetWorkspaceSerializer,
    GetCanvasSerializer,
    GetNoteSerializer,
    GetCombatTrackerSerializer,
    GetCharacterSerializer,
    GetWorkspaceByUserSerializer,
)
from .models import Workspace, Canvas, CombatTracker, Note, Character
from core.user.models import User


class WorkspaceViewset(ModelViewSet):
    serializer_class = WorkspaceSerializer
    http_method_names = ["post", "get", "delete"]

    def retrieve(self, request, pk=None):

        lookup_field_value = self.kwargs[self.lookup_field]

        workspaces = Workspace.objects.filter(id=lookup_field_value).values(
            "id", "title"
        )
        # self.check_object_permissions(self.request, workspaces)

        serializer = GetWorkspaceSerializer(workspaces, many=True)

        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        print(request.data["user"])
        serializer.is_valid(raise_exception=True)
        qs = User.objects.filter(id=request.data["user"])
        serializer.save(user=qs[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    def get_queryset(self):
        workspaceId = self.request.data["workspaceId"]
        return Workspace.objects.filter(id=workspaceId)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)


class CanvasViewSet(ModelViewSet):
    serializer_class = CanvasSerializer
    permission_classes = (AllowAny,)
    htpp_method_names = ["post"]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qs = Workspace.objects.filter(id=request.data["workspace"])
        serializer.save(workspace=qs[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    def get_queryset(self):
        canvasId = self.request.data["canvasId"]
        return Canvas.objects.filter(id=canvasId)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)


class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = (AllowAny,)
    htpp_method_names = ["post", "patch"]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qs = Canvas.objects.filter(id=request.data["canvas"])
        serializer.save(canvas=qs[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    def get_queryset(self):
        componentId = self.request.data["componentId"]
        return Note.objects.filter(id=componentId)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CombatTrackerViewSet(ModelViewSet):
    serializer_class = CombatTrackerSerializer
    permission_classes = (AllowAny,)
    htpp_method_names = ["post", "patch", "delete"]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qs = Canvas.objects.filter(id=request.data["canvas"])
        serializer.save(canvas=qs[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    def get_queryset(self):
        componentId = self.request.data["componentId"]
        qs1 = CombatTracker.objects.filter(id=componentId)
        return qs1

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CharacterViewSet(ModelViewSet):
    serializer_class = CharacterSerializer
    permission_classes = (AllowAny,)
    htpp_method_names = ["post", "delete"]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qs = CombatTracker.objects.filter(id=request.data["combat_tracker"])
        serializer.save(combat_tracker=qs[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    def get_queryset(self):
        characterId = self.request.data["characterId"]
        return Character.objects.filter(id=characterId)

    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        print(request.data)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UserWorkspaceViewset(ModelViewSet):
    serializer_class = GetWorkspaceByUserSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["get"]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["updated"]
    ordering = ["-updated"]

    def retrieve(self, request, pk=None):

        lookup_field_value = self.kwargs[self.lookup_field]

        user = User.objects.get(id=lookup_field_value)

        workspaces = Workspace.objects.filter(user=user).values("id", "title")
        # self.check_object_permissions(self.request, workspaces)

        serializer = GetWorkspaceByUserSerializer(workspaces, many=True)

        return Response(serializer.data)


class WorkspaceCanvasViewSet(ModelViewSet):
    serializer_class = GetCanvasSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["get"]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["updated"]
    ordering = ["-updated"]

    def retrieve(self, request, pk=None):

        lookup_field_value = self.kwargs[self.lookup_field]

        workspace = Workspace.objects.get(id=lookup_field_value)

        canvases = Canvas.objects.filter(workspace=workspace).values("id", "title")
        # self.check_object_permissions(self.request, obj)

        serializer = GetCanvasSerializer(canvases, many=True)

        return Response(serializer.data)


class NoteCanvasViewSet(ModelViewSet):
    serializer_class = GetNoteSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["get"]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["updated"]
    ordering = ["-updated"]

    def retrieve(self, request, pk=None):

        lookup_field_value = self.kwargs[self.lookup_field]

        canvas = Canvas.objects.get(id=lookup_field_value)

        notes = Note.objects.filter(canvas=canvas).values("id", "title", "text")
        # self.check_object_permissions(self.request, obj)

        serializer = GetNoteSerializer(notes, many=True)

        return Response(serializer.data)


class CombatTrackerCanvasViewSet(ModelViewSet):
    serializer_class = GetCombatTrackerSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["get"]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["updated"]
    ordering = ["-updated"]

    def retrieve(self, request, pk=None):

        lookup_field_value = self.kwargs[self.lookup_field]

        canvas = Canvas.objects.get(id=lookup_field_value)

        combat_trackers = CombatTracker.objects.filter(canvas=canvas).values(
            "id", "title", "round"
        )
        # self.check_object_permissions(self.request, obj)

        serializer = GetCombatTrackerSerializer(combat_trackers, many=True)

        return Response(serializer.data)


class CombatTrackerCharacterViewSet(ModelViewSet):
    serializer_class = GetCharacterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["get"]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["updated"]
    ordering = ["-updated"]

    def retrieve(self, request, pk=None):

        lookup_field_value = self.kwargs[self.lookup_field]

        combat_tracker = CombatTracker.objects.get(id=lookup_field_value)

        characters = Character.objects.filter(combat_tracker=combat_tracker).values(
            "id",
            "name",
            "initiative",
            "armor_class",
            "concentration",
            "hitpoints",
            "max_hitpoints",
            "conditions",
            "statblock",
        )
        # self.check_object_permissions(self.request, obj)

        serializer = GetCharacterSerializer(characters, many=True)

        return Response(serializer.data)
