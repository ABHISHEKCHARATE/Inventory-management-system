
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import RegularUser

class RegularUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number', 'address')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions', 'role')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )

    list_display = ('username', 'email', 'full_name', 'phone_number', 'role', 'is_staff', 'is_active', 'is_superuser')
    search_fields = ('email', 'username', 'full_name', 'role')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'role')

    model = RegularUser

admin.site.register(RegularUser, RegularUserAdmin)



from django.contrib import admin
from .models import InventoryItem

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('name', 'sku', 'quantity', 'price', 'supplier', 'expiration_date', 'username', 'threshold', 'created_at', 'updated_at')
    
    # Fields to make searchable in the admin panel
    search_fields = ('name', 'sku', 'supplier', 'username')
    
    # Fields to filter by in the admin panel
    list_filter = ('supplier', 'expiration_date', 'created_at', 'updated_at')
    
    # Fields to make editable directly in the list view
    list_editable = ('quantity', 'price', 'threshold')
    
    # Fields to use for ordering the entries in the admin panel
    ordering = ('-created_at',)
    
    # Read-only fields (non-editable in the admin form)
    readonly_fields = ('created_at', 'updated_at', 'username')
    
    # Configure fieldsets to organize the fields in the admin form
    fieldsets = (
        ('Item Details', {
            'fields': ('name', 'sku', 'quantity', 'price', 'supplier', 'threshold')
        }),
        ('Additional Information', {
            'fields': ('user', 'username', 'expiration_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

0
