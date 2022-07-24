import {IUserAuthorities} from "../typings/authorities";

export default function(userAuthorities: IUserAuthorities[], resourceId: string, permission: string): boolean {
    const filteredAuth = userAuthorities.filter(a => a.resourceId === resourceId);
    return !!filteredAuth.find(a => a.permissions?.includes(permission));
}