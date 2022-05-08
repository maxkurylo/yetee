module.exports = {
    sessionExpireTime: 3600 * 24, // one day,
    emailVerificationNeeded: false,

    // permissions for roles
    groupMemberPermissions: ['GROUP_MEMBER', 'SCHEDULE_CALLS', 'START_GROUP_CALLS', 'START_PRIVATE_CALLS', 'WRITE_POSTS'],
    groupModeratorPermissions: ['GROUP_MODERATOR', 'SCHEDULE_CALLS', 'START_GROUP_CALLS', 'START_PRIVATE_CALLS', 'DELETE_ANY_SCHEDULED_CALL', 'WRITE_POSTS', 'DELETE_ANY_POST'],
    companyModeratorPermissions: ['COMPANY_MODERATOR'],
    absoluteAdminPermissions: ['ABSOLUTE_ADMIN']
};
