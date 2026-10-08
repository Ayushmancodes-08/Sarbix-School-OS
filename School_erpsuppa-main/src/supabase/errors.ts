
export type SecurityRuleContext = {
  path: string;
  operation: 'list' | 'get' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class SupabasePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    super(`Permission denied for ${context.operation} on ${context.path}`);
    this.name = 'SupabasePermissionError';
    this.context = context;
  }
}
