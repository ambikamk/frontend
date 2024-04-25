from .models import Notes
from rest_framework import serializers
from django.contrib.auth.models import User



class Userserializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields =['id','username','email','password']
        extra_kwargs = {"password": {"write_only": True}}
         
         
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


#creaate a file 


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notes
        fields=['id','title','file','create','user']
        extra_kwargs = {"user": {"read_only": True}}  # Set user__username field as read-only
