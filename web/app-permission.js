"use strict";

App.run(function (PermPermissionStore, PermissionService, UserService) {



    let permissions = ['WEBSITE', 'UPLOAD_REPORT', 'MANAGE_REPORT', 'VIEW_REPORT', 'REVIEW_REPORT', 'MANAGE_ACCOUNT'];

    PermPermissionStore.defineManyPermissions(permissions, function (permissionName) {
        // console.log(permissionName, PermissionService.hasPermission(permissionName));
        return UserService.hasPermission(permissionName);
    });
});