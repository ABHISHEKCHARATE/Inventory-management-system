from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, InventoryItemViewSet, UpdateInventoryItemView, DeleteInventoryItemView, StockAlertView,DownloadInventoryReportView
from .views import DashboardAPIView
from .views import UserProfileView

router = DefaultRouter()
router.register(r'inventory-items', InventoryItemViewSet, basename='inventoryitem')

urlpatterns = [
   
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    

    
    path('inventory-items/<int:pk>/update/', UpdateInventoryItemView.as_view(), name='update-inventory-item'),
    path('inventory-items/<int:pk>/delete/', DeleteInventoryItemView.as_view(), name='delete-inventory-item'),
    path('stock-alert/', StockAlertView.as_view(), name='stock-alert'),
    path('inventory-report/', DownloadInventoryReportView.as_view(), name='download-inventory-report'),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),


    

   
    path('', include(router.urls)), 
]
