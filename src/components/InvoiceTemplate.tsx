import { formatDate } from "@/utils/subscription.utils";
import type { Payment } from "@/types";
import "@/styles/InvoiceTemplate.css";

interface InvoiceTemplateProps {
  payment: Payment;
  invoiceNumber: string;
}

function InvoiceTemplate({ payment, invoiceNumber }: InvoiceTemplateProps) {
  const currentDate = formatDate(payment.createdAt);
  const subtotal = Number(payment.amount);
  const tax = payment.plan?.tax ? Number(payment.plan.tax) : 0;
  const total = subtotal + tax;

  return (
    <div className="invoice-container" id="invoice-content">
      {/* Header */}
      <div className="invoice-header">
        <div className="invoice-title-section">
          <h1>INVOICE</h1>
          <p className="invoice-number">Invoice #{invoiceNumber}</p>
        </div>
        <div className="company-info">
          <img
            src="/Valid2.svg"
            alt="ValidPanel Logo"
            className="company-logo"
          />
          <p className="company-details">support@validpanel.com</p>
        </div>
      </div>

      {/* Bill To & Invoice Details */}
      <div className="invoice-info-grid">
        <div>
          <h3 className="section-heading">Bill To</h3>
          <div>
            <p className="customer-name">
              {payment.user?.fullName || "Valued Customer"}
            </p>
            <p className="customer-email">{payment.user?.email}</p>
          </div>
        </div>
        <div>
          <h3 className="section-heading">Invoice Details</h3>
          <div className="invoice-details-list">
            <div className="detail-row">
              <span className="detail-label">Invoice Date:</span>
              <span className="detail-value">{currentDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Status:</span>
              <span className="status-badge">{payment.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="invoice-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Period</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p className="item-description">
                  {payment.plan.name} Subscription
                </p>
                <p className="item-details">
                  {payment.plan.description?.toUpperCase() ||
                    "Premium subscription plan"}
                </p>
              </td>
              <td className="item-period">{payment.plan.interval}</td>
              <td className="item-amount">
                ${subtotal.toFixed(2)} {payment.currency}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="totals-wrapper">
        <div className="totals-container">
          <div className="totals-list">
            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-value">
                ${subtotal.toFixed(2)} {payment.currency}
              </span>
            </div>
            {tax > 0 && (
              <div className="total-row">
                <span className="total-label">Tax:</span>
                <span className="total-value">
                  ${tax.toFixed(2)} {payment.currency}
                </span>
              </div>
            )}
            <div className="grand-total-row">
              <span className="grand-total-label">Total:</span>
              <span className="grand-total-value">
                ${total.toFixed(2)} {payment.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <div className="footer-grid">
          <div>
            <h4 className="footer-heading">Payment Method</h4>
            <p className="footer-value">{payment.method || "Credit Card"}</p>
          </div>
          <div>
            <h4 className="footer-heading">Payment ID</h4>
            <p className="footer-value">{payment.id}</p>
          </div>
        </div>
        <div className="invoice-note">
          <span>
            Thank you for your business! For any questions regarding this
            invoice, please contact us at support@validpanel.com
          </span>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTemplate;
