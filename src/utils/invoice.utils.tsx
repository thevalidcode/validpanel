import { pdf } from "@react-pdf/renderer";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import type { Payment } from "@/types";

/**
 * Generate and download invoice PDF for a payment
 */
export async function downloadInvoice(payment: Payment): Promise<void> {
  const invoiceNumber = generateInvoiceNumber(payment.uid, payment.createdAt);

  const blob = await pdf(
    <InvoiceTemplate payment={payment} invoiceNumber={invoiceNumber} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a unique invoice number based on payment ID and date
 */
function generateInvoiceNumber(paymentUid: string, createdAt: string | Date): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const uid = paymentUid.slice(0, 6).toUpperCase();

  return `INV-${year}${month}-${uid}`;
}

/**
 * Check if payment is eligible for invoice download (successful payments only)
 */
export function canDownloadInvoice(paymentStatus: string): boolean {
  const successStatuses = ["SUCCESS", "COMPLETED", "PAID", "SUCCESSFUL"];
  return successStatuses.includes(paymentStatus.toUpperCase());
}
