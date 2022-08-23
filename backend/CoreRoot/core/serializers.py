from rest_framework import serializers
from .models import Workspace, Canvas, Note, CombatTracker, Character, CONDITIONS, User


class WorkspaceSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(many=True, slug_field="id", read_only=True)

    class Meta:
        model = Workspace
        fields = ["id", "title", "user", "created", "updated"]
        read_only_field = ["created", "updated", "user"]

    def create(self, validated_data):
        print(validated_data)
        return Workspace.objects.create(**validated_data)


class GetWorkspaceByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "title", "user_id", "created", "updated"]
        read_only_field = ["created", "updated", "user_id"]


class GetWorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "title", "created", "updated"]
        read_only_field = ["created", "updated"]


class CanvasSerializer(serializers.ModelSerializer):
    workspace = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="id",
    )

    class Meta:
        model = Canvas
        fields = ["id", "title", "workspace", "created", "updated"]
        read_only_field = ["created", "updated"]

    def create(self, validated_data):
        return Canvas.objects.create(**validated_data)


class GetCanvasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canvas
        fields = ["id", "title", "workspace_id", "created", "updated"]
        read_only_field = ["created", "updated", "workspace_id"]


class NoteSerializer(serializers.ModelSerializer):
    canvas = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="id",
    )

    class Meta:
        model = Note
        fields = ["id", "title", "text", "canvas", "created", "updated"]
        read_only_field = ["created", "updated"]

    def create(self, validated_data):
        return Note.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     instance.title = validated_data.get("title", instance.title)
    #     instance.text = validated_data.get("text", instance.title)
    #     instance.updated = validated_data.get("updated", instance.updated)
    #     instance.save()
    #     return instance


class GetNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "text", "canvas_id", "created", "updated"]
        read_only_field = ["created", "updated", "canvas_id"]


class CombatTrackerSerializer(serializers.ModelSerializer):
    canvas = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="id",
    )

    class Meta:
        model = CombatTracker
        fields = ["id", "title", "round", "canvas", "created", "updated"]
        read_only_field = ["created", "updated"]

    def create(self, validated_data):
        return CombatTracker.objects.create(**validated_data)


class GetCombatTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CombatTracker
        fields = ["id", "title", "round", "canvas_id", "created", "updated"]
        read_only_field = ["created", "updated", "canvas_id"]


class CharacterSerializer(serializers.ModelSerializer):
    combat_tracker = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="id",
    )

    class Meta:
        model = Character
        fields = [
            "id",
            "name",
            "initiative",
            "armor_class",
            "concentration",
            "hitpoints",
            "max_hitpoints",
            "conditions",
            "statblock",
            "combat_tracker",
            "created",
            "updated",
        ]
        read_only_field = ["created", "updated"]

    def create(self, validated_data):
        return Character.objects.create(**validated_data)


class GetCharacterSerializer(serializers.ModelSerializer):
    conditions = serializers.ChoiceField(choices=CONDITIONS)

    class Meta:
        model = Character
        fields = [
            "id",
            "name",
            "initiative",
            "armor_class",
            "concentration",
            "hitpoints",
            "max_hitpoints",
            "conditions",
            "statblock",
            "combat_tracker_id",
            "created",
            "updated",
        ]
        read_only_field = ["created", "updated", "combat_tracker_id"]
