
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

