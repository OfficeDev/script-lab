export var PlatformType;
(function (PlatformType) {
    PlatformType["PC"] = "PC";
    PlatformType["OfficeOnline"] = "OfficeOnline";
    PlatformType["Mac"] = "Mac";
    PlatformType["iOS"] = "iOS";
    PlatformType["Android"] = "Android";
    PlatformType["Universal"] = "Universal";
})(PlatformType || (PlatformType = {}));
export function getPlatform() {
    return ((window.Office &&
        window.Office.context &&
        window.Office.context.platform) ||
        PlatformType.OfficeOnline);
}
//# sourceMappingURL=platform.js.map