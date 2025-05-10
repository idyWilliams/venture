declare module 'paystack-node' {
  interface PaystackConfig {
    api_key: string;
  }

  interface TransactionInitializeParams {
    amount: number;
    email: string;
    reference?: string;
    plan?: string;
    callback_url?: string;
    metadata?: {
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
      [key: string]: any;
    };
  }

  interface PlanCreateParams {
    name: string;
    amount: number;
    interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
    description?: string;
    send_invoices?: boolean;
    send_sms?: boolean;
    currency?: string;
  }

  interface SubscriptionCreateParams {
    customer: string;
    plan: string;
    authorization?: string;
    start_date?: string;
  }

  interface CustomerCreateParams {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: any;
  }

  class Paystack {
    constructor(config: PaystackConfig);

    transaction: {
      initialize(params: TransactionInitializeParams): Promise<any>;
      verify(reference: string): Promise<any>;
      list(params?: any): Promise<any>;
      fetch(id: number): Promise<any>;
      charge(params: any): Promise<any>;
    };

    plan: {
      create(params: PlanCreateParams): Promise<any>;
      list(params?: any): Promise<any>;
      fetch(id_or_code: string): Promise<any>;
      update(id_or_code: string, params: any): Promise<any>;
    };

    subscription: {
      create(params: SubscriptionCreateParams): Promise<any>;
      list(params?: any): Promise<any>;
      fetch(id_or_code: string): Promise<any>;
      enable(code: string, token: string): Promise<any>;
      disable(code: string, token: string): Promise<any>;
    };

    customer: {
      create(params: CustomerCreateParams): Promise<any>;
      list(params?: any): Promise<any>;
      fetch(id_or_code: string): Promise<any>;
      update(id_or_code: string, params: any): Promise<any>;
    };
  }

  export = Paystack;
}