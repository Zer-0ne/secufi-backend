/**
 * @fileoverview TypeScript interfaces and types for the application
 * @description This file contains all TypeScript interfaces, types, and enums used throughout
 * the application. It defines the structure of data models, API requests/responses,
 * and extends Prisma-generated types with additional properties.
 *
 * @module config/interfaces
 * @requires @prisma/client - Prisma-generated database types
 *
 * @author Secufi Team
 * @version 1.0.0
 */
// ============================================================================
// Family Invitation Types
// ============================================================================
/**
 * Enumeration of possible invitation statuses
 *
 * @enum {string}
 * @description Represents the current state of a family invitation.
 *
 * @property {string} PENDING - Invitation sent but not yet responded to
 * @property {string} ACCEPTED - Invitation accepted by recipient
 * @property {string} REJECTED - Invitation rejected by recipient
 * @property {string} EXPIRED - Invitation expired (time limit exceeded)
 */
export var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "pending";
    InvitationStatus["ACCEPTED"] = "accepted";
    InvitationStatus["REJECTED"] = "rejected";
    InvitationStatus["EXPIRED"] = "expired";
})(InvitationStatus || (InvitationStatus = {}));
// ============================================================================
// Family Access Types
// ============================================================================
/**
 * Enumeration of access permission levels
 *
 * @enum {string}
 * @description Defines the level of access a family member can have.
 *
 * @property {string} VIEW - Read-only access to view data
 * @property {string} EDIT - Ability to view and modify data
 * @property {string} FULL - Complete access including delete permissions
 */
export var AccessType;
(function (AccessType) {
    AccessType["VIEW"] = "view";
    AccessType["EDIT"] = "edit";
    AccessType["FULL"] = "full";
})(AccessType || (AccessType = {}));
//# sourceMappingURL=interfaces.js.map