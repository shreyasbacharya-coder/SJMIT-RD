export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    public context: SecurityRuleContext;
    public digest: string;

    constructor(context: SecurityRuleContext) {
        // Construct a detailed error message that mimics a contextual error format.
        const errorInfo = {
            "error": {
                "code": 403,
                "message": "Missing or insufficient permissions.",
                "status": "PERMISSION_DENIED"
            },
            "securityRuleContext": {
                ...context,
                // In a real app, auth context would be dynamically added.
                "auth": {
                    "uid": "AUTHENTICATED_USER_UID",
                    "token": { "email": "user@example.com" }
                }
            }
        };

        const message = `FirestoreError: The following request was denied by Firestore Security Rules:\n\n${JSON.stringify(errorInfo, null, 2)}`;
        
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;
        
        // The 'digest' property is used by Next.js to show the error in the development overlay.
        this.digest = `FIRESTORE_PERMISSION_DENIED: ${context.operation} on ${context.path}`;
    }
}
