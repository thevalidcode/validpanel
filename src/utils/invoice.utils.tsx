import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import type { Payment } from "@/types";

/**
 * Generate and download invoice PDF for a payment
 */
export async function downloadInvoice(payment: Payment): Promise<void> {
  // Create a temporary container
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // A4 width in pixels at 96 DPI
  document.body.appendChild(container);

  try {
    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(payment.uid, payment.createdAt);

    // Render the invoice template
    const root = createRoot(container);
    root.render(
      <InvoiceTemplate payment={payment} invoiceNumber={invoiceNumber} />
    );

    // Wait for rendering with polling to ensure element exists
    let invoiceElement: HTMLElement | null = null;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!invoiceElement && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      invoiceElement = container.querySelector("#invoice-content") as HTMLElement;
      attempts++;
    }

    if (!invoiceElement) {
      throw new Error("Invoice content not found");
    }

    // Convert to canvas
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Download the PDF
    pdf.save(`invoice-${invoiceNumber}.pdf`);

    // Cleanup
    root.unmount();
  } finally {
    // Remove the temporary container
    document.body.removeChild(container);
  }
}

/**
 * Generate a unique invoice number based on payment ID and date
 */
function generateInvoiceNumber(paymentUid: string, createdAt: Date): string {
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
