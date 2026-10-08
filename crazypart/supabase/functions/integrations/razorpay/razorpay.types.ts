export type CreatePaymentOrderInput = {
    amountPaise: number;
    currency: string;
    receipt: string;
};

export type PaymentOrder = {
    id: string;
    amountPaise: number;
    currency: string;
};

export type CapturedPayment = {
    id: string;
    orderId: string;
    amountPaise: number;
    currency: string;
    status: "captured";
};

export interface PaymentGateway {
    createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrder>;
    verifyCheckoutSignature(
        orderId: string,
        paymentId: string,
        signature: string,
    ): Promise<boolean>;
    capturePayment(
        paymentId: string,
        amountPaise: number,
        currency: string,
    ): Promise<CapturedPayment>;
}
