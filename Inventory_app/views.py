from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, LoginSerializer , InventoryItemSerializer
from .models import RegularUser, InventoryItem
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import InventoryItem

from django.db.models import F 




class IsAdminPermission(IsAuthenticated):
    def has_permission(self, request, view):
        if request.user.role == 'admin':
            return True
        return False


class RegisterView(views.APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


class LoginView(views.APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)  

            if user:
                refresh = RefreshToken.for_user(user) 
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "is_superuser": user.is_superuser  
                }, status=status.HTTP_200_OK)

            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)  

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  



from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import InventoryItem
from .serializers import InventoryItemSerializer
from .permissions import IsAdminOrOwner
from .pagination import InventoryItemPagination
import logging

logger = logging.getLogger(__name__)
from rest_framework.exceptions import NotAuthenticated

class InventoryItemViewSet(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAdminOrOwner]
    pagination_class = InventoryItemPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku']

    def get_queryset(self):
        # Check if the user is authenticated
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return InventoryItem.objects.all()
            return InventoryItem.objects.filter(user=self.request.user)
        raise NotAuthenticated('User is not authenticated')

    def perform_create(self, serializer):
        # Ensure the user is authenticated before saving the inventory item
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            raise NotAuthenticated('User is not authenticated')



class UpdateInventoryItemView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get_object(self, pk):
        try:
            return InventoryItem.objects.get(pk=pk)
        except InventoryItem.DoesNotExist:
            return None

    def put(self, request, pk):
        item = self.get_object(pk)
        if not item:
            return Response({"detail": "Inventory item not found."}, status=status.HTTP_404_NOT_FOUND)

    
        if not request.user.is_staff and item.user != request.user:
            return Response({"detail": "You do not have permission to update this item."}, status=status.HTTP_403_FORBIDDEN)

        serializer = InventoryItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        item = self.get_object(pk)
        if not item:
            return Response({"detail": "Inventory item not found."}, status=status.HTTP_404_NOT_FOUND)

        
        if not request.user.is_staff and item.user != request.user:
            return Response({"detail": "You do not have permission to update this item."}, status=status.HTTP_403_FORBIDDEN)

        serializer = InventoryItemSerializer(item, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DeleteInventoryItemView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get_object(self, pk):
        try:
            item = InventoryItem.objects.get(pk=pk)
            logger.info(f"Found item: {item.name} with ID: {pk}.")
            return item
        except InventoryItem.DoesNotExist:
            logger.warning(f"Item with ID: {pk} does not exist.")
            return None

    def delete(self, request, pk):
        item = self.get_object(pk)
        if not item:
            logger.error(f"Delete request failed: Item with ID {pk} not found.")
            return Response({"detail": "Inventory item not found."}, status=status.HTTP_404_NOT_FOUND)

        
        self.check_object_permissions(request, item)

        logger.info(f"User {request.user.username} is deleting item {item.name}.")
        item.delete()
        logger.info(f"Item with ID {pk} deleted successfully.")
        return Response({"detail": "Item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)






class StockAlertView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """Send stock alert emails for items below the threshold."""
        user = request.user
        
        low_stock_items = InventoryItem.objects.filter(user=user, quantity__lt=F('threshold'))

        if not low_stock_items.exists():
            return Response({"message": "All inventory levels are sufficient."})

        for item in low_stock_items:
            
            subject = f"Stock Alert: {item.name}"
            message = (
                f"Dear {user.username},\n\n"
                f"The stock for '{item.name}' (SKU: {item.sku}) is below the defined threshold.\n"
                f"Current quantity: {item.quantity}\n"
                f"Threshold: {item.threshold}\n\n"
                f"Please restock as soon as possible.\n"
            )
            recipient_list = [user.email]

            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                recipient_list,
                fail_silently=False,
            )

        return Response({
            "message": f"Alert emails sent for {low_stock_items.count()} items.",
            "items": [
                {"name": item.name, "quantity": item.quantity, "threshold": item.threshold}
                for item in low_stock_items
            ]
        })





import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import InventoryItem
from django.contrib.auth.models import User


class DownloadInventoryReportView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, *args, **kwargs):
        
        if request.user.is_staff:
            
            queryset = InventoryItem.objects.all()
        else:
            
            queryset = InventoryItem.objects.filter(user=request.user)
        
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inventory_report.csv"'
        
        
        writer = csv.writer(response)

        
        writer.writerow(['ID', 'Name', 'SKU', 'Quantity', 'Price', 'Supplier', 'Expiration Date', 'Username', 'Threshold'])

        
        for item in queryset:
            writer.writerow([
                item.id,
                item.name,
                item.sku,
                item.quantity,
                item.price,
                item.supplier,
                item.expiration_date,
                item.username,
                item.threshold
            ])

        return response



from django.db.models import Sum, Count, F
from asgiref.sync import sync_to_async

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
       
        queryset = InventoryItem.objects.all() if request.user.is_staff else InventoryItem.objects.filter(user=request.user)
        total_items = queryset.aggregate(total=Count("id"))
        low_stock_items = queryset.filter(quantity__lt=F("threshold")).count()
        total_stock_value = queryset.aggregate(stock_value=Sum(F("quantity") * F("price")))

        
        data = {
            "total_items": total_items.get("total", 0),
            "low_stock_items": low_stock_items,
            "total_stock_value": total_stock_value.get("stock_value", 0),
        }

        return Response(data)








class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = RegisterSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)