import PaystackNodejs from 'paystack-node';

// Initialize Paystack
//@ts-ignore
const paystack = new PaystackNodejs(process.env.PAYSTACK_SECRET_KEY);

export interface InitializeTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
}

export interface CreatePlanResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    plan_code: string;
    description: string;
    amount: number;
    interval: string;
    currency: string;
  };
}

export interface CreateSubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    customer: number;
    plan: number;
    integration: number;
    start: string;
    status: string;
    subscription_code: string;
    email_token: string;
  };
}

export interface CreateCustomerResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    customer_code: string;
  };
}

/**
 * Initialize a transaction with Paystack
 * @param email Customer email
 * @param amount Amount in kobo (smallest currency unit)
 * @param reference Unique transaction reference
 * @param metadata Additional data to include
 * @returns Promise with transaction data
 */
export async function initializeTransaction(
  email: string,
  amount: number,
  reference: string,
  metadata?: Record<string, any>
): Promise<InitializeTransactionResponse> {
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount,
      reference,
      //@ts-ignore
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/payment/callback`,
    });

    return response;
  } catch (error) {
    console.error('Paystack transaction initialization error:', error);
    throw error;
  }
}

/**
 * Verify a transaction with Paystack
 * @param reference Transaction reference to verify
 * @returns Promise with verification data
 */
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
  try {

    //@ts-ignore
    const response = await paystack.transaction.verify({ reference });
    return response;
  } catch (error) {
    console.error('Paystack transaction verification error:', error);
    throw error;
  }
}

/**
 * Create a subscription plan in Paystack
 * @param name Plan name
 * @param amount Amount in kobo (smallest currency unit)
 * @param interval Billing interval (daily, weekly, monthly, quarterly, biannually, annually)
 * @param description Plan description
 * @returns Promise with plan data
 */
export async function createPlan(
  name: string,
  amount: number,
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually',
  description: string
): Promise<CreatePlanResponse> {
  try {
    const response = await paystack.plan.create({
      name,
      amount,
      interval,
      description
    });

    return response;
  } catch (error) {
    console.error('Paystack plan creation error:', error);
    throw error;
  }
}

/**
 * Create a subscription to a plan
 * @param customer_code Customer code
 * @param plan_code Plan code
 * @param start_date When subscription should start (ISO format)
 * @returns Promise with subscription data
 */
export async function createSubscription(
  customer_code: string,
  plan_code: string,
  start_date?: string
): Promise<CreateSubscriptionResponse> {
  try {
    const response = await paystack.subscription.create({
      customer: customer_code,
      plan: plan_code,
      start_date
    });

    return response;
  } catch (error) {
    console.error('Paystack subscription creation error:', error);
    throw error;
  }
}

/**
 * Create a customer in Paystack
 * @param email Customer email
 * @param first_name Customer first name
 * @param last_name Customer last name
 * @param phone Customer phone number
 * @returns Promise with customer data
 */
export async function createCustomer(
  email: string,
  first_name: string,
  last_name: string,
  phone?: string
): Promise<CreateCustomerResponse> {
  try {
    const response = await paystack.customer.create({
      email,
      first_name,
      last_name,
      phone
    });

    return response;
  } catch (error) {
    console.error('Paystack customer creation error:', error);
    throw error;
  }
}