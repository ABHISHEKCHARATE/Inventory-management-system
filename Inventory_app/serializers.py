from rest_framework import serializers
from .models import RegularUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = ['email', 'username', 'full_name', 'phone_number', 'address', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},  
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)  
        user = RegularUser.objects.create_user(**validated_data)  
        if password:  
            user.set_password(password)
        user.save()
        return user

    def validate_password(self, value):
        """Add any custom password validation logic here if required."""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True) 

    def validate(self, data):
        
        if not data.get('username') or not data.get('password'):
            raise serializers.ValidationError("Both username and password are required.")
        return data


from rest_framework import serializers
from .models import InventoryItem

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'sku', 'quantity', 'price', 'supplier', 'expiration_date' , 'threshold']
    
    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value
