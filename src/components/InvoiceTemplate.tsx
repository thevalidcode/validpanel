import { formatDate } from "@/utils/subscription.utils";
import type { Payment } from "@/types";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import logoPng from "../assets/images/Valid2.png";

interface InvoiceTemplateProps {
  payment: Payment;
  invoiceNumber: string;
}

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-SemiBold.ttf",
      fontWeight: 600,
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 36,
    paddingVertical: 30,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Poppins",
    backgroundColor: "#F9FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E7E9EF",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  logoWrap: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: 180,
  },
  logo: {
    height: 54,
  },
  brandBox: {
    width: 180,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#121826",
    letterSpacing: 0.2,
  },
  subTitle: {
    marginTop: 3,
    fontSize: 9,
    color: "#70798B",
  },
  brandTagline: {
    marginTop: 4,
    fontSize: 8,
    color: "#70798B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "right",
    width: 176,
  },
  brandEmail: {
    marginTop: 5,
    fontSize: 9,
    color: "#5A6272",
    textAlign: "right",
    width: 176,
    alignSelf: "flex-end",
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E7E9EF",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  infoCardLeft: {
    marginRight: 10,
  },
  sectionHeading: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#7C8598",
    marginBottom: 8,
    fontWeight: 600,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 700,
    color: "#121826",
  },
  customerEmail: {
    marginTop: 4,
    color: "#5A6272",
    fontSize: 9,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  detailLabel: {
    color: "#70798B",
    fontSize: 9,
  },
  detailValue: {
    fontWeight: 600,
    color: "#121826",
    fontSize: 9,
  },
  statusSuccess: {
    color: "#0F766E",
    backgroundColor: "#ECFDF5",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusPending: {
    color: "#B45309",
    backgroundColor: "#FFFBEB",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusFailed: {
    color: "#B91C1C",
    backgroundColor: "#FEF2F2",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: "#E7E9EF",
    borderRadius: 4,
    marginBottom: 12,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#F3F4F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E7E9EF",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  th: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#6C7587",
    fontWeight: 600,
    letterSpacing: 0.4,
  },
  colDescription: { flex: 1.8 },
  colPeriod: { flex: 0.8, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  itemName: {
    fontWeight: 700,
    fontSize: 10,
    color: "#121826",
  },
  itemDesc: {
    marginTop: 4,
    color: "#6C7587",
    fontSize: 9,
  },
  period: {
    textAlign: "right",
    fontSize: 9,
    color: "#3B4456",
  },
  amount: {
    textAlign: "right",
    fontWeight: 700,
    color: "#121826",
  },
  totalsWrap: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  totalsBox: {
    width: 255,
    borderWidth: 1,
    borderColor: "#E7E9EF",
    borderRadius: 4,
    padding: 11,
    backgroundColor: "#FFFFFF",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  totalLabel: {
    color: "#70798B",
    fontSize: 9,
  },
  totalValue: {
    color: "#1F2937",
    fontSize: 9,
    fontWeight: 600,
  },
  discountValue: {
    color: "#0F766E",
    fontWeight: 600,
    fontSize: 9,
  },
  grandTotalRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#D4D8E3",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grandTotalLabel: {
    fontWeight: 700,
    fontSize: 10,
    color: "#121826",
  },
  grandTotalValue: {
    fontWeight: 700,
    fontSize: 10,
    color: "#7D1EFE",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E7E9EF",
    paddingTop: 11,
  },
  footerGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerItem: {
    flex: 1,
  },
  footerItemLeft: {
    marginRight: 10,
  },
  footerHeading: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    color: "#7C8598",
    fontWeight: 600,
  },
  footerValue: {
    marginTop: 4,
    fontSize: 9,
    color: "#1F2937",
    fontWeight: 600,
  },
  noteBox: {
    marginTop: 11,
    borderWidth: 1,
    borderColor: "#E7E9EF",
    borderRadius: 4,
    backgroundColor: "#F8F8FC",
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  noteText: {
    textAlign: "center",
    color: "#626C80",
    fontSize: 9,
    lineHeight: 1.45,
  },
});

function InvoiceTemplate({ payment, invoiceNumber }: InvoiceTemplateProps) {
  const currentDate = formatDate(payment.createdAt);
  const subtotal = Number(payment.amount);
  const discount = Number(payment.discountAmount || 0);
  const tax = payment.taxAmount ? Number(payment.taxAmount) : 0;
  const total = Number(payment.finalAmount || subtotal - discount + tax);

  const planPrice = payment.plan?.prices?.find(
    (p) =>
      p.currency === payment.currency &&
      Number(p.price) === Number(payment.amount),
  );
  const interval = planPrice?.interval || "MONTHLY";
  const statusToneStyle =
    payment.status === "SUCCESS"
      ? styles.statusSuccess
      : payment.status === "FAILED"
        ? styles.statusFailed
        : styles.statusPending;
  const formattedMethod = payment.method?.replace(/_/g, " ") || "Credit Card";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subTitle}>Invoice #{invoiceNumber}</Text>
          </View>
          <View style={styles.brandBox}>
            <View style={styles.logoWrap}>
              <Image src={logoPng} style={styles.logo} />
              <Text style={styles.brandTagline}>
                Sell smarter. Scale faster.
              </Text>
            </View>
            <Text style={styles.brandEmail}>support@validpanel.com</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, styles.infoCardLeft]}>
            <Text style={styles.sectionHeading}>Bill To</Text>
            <Text style={styles.customerName}>
              {payment.user?.fullName || "Valued Customer"}
            </Text>
            <Text style={styles.customerEmail}>
              {payment.user?.email || "-"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionHeading}>Invoice Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice Date</Text>
              <Text style={styles.detailValue}>{currentDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice Number</Text>
              <Text style={styles.detailValue}>#{invoiceNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <Text style={[styles.detailValue, statusToneStyle]}>
                {payment.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.th, styles.colDescription]}>Description</Text>
            <Text style={[styles.th, styles.colPeriod]}>Period</Text>
            <Text style={[styles.th, styles.colAmount]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.colDescription}>
              <Text style={styles.itemName}>
                {payment.plan?.name || "Subscription"} Subscription
              </Text>
              <Text style={styles.itemDesc}>
                {payment.plan?.description?.toUpperCase() ||
                  "Premium subscription plan"}
              </Text>
            </View>
            <Text style={[styles.period, styles.colPeriod]}>{interval}</Text>
            <Text style={[styles.amount, styles.colAmount]}>
              {subtotal.toFixed(2)} {payment.currency}
            </Text>
          </View>
        </View>

        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {subtotal.toFixed(2)} {payment.currency}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.discountValue}>
                  -{discount.toFixed(2)} {payment.currency}
                </Text>
              </View>
            )}
            {tax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>
                  {tax.toFixed(2)} {payment.currency}
                </Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {total.toFixed(2)} {payment.currency}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerGrid}>
            <View style={[styles.footerItem, styles.footerItemLeft]}>
              <Text style={styles.footerHeading}>Payment Method</Text>
              <Text style={styles.footerValue}>{formattedMethod}</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={styles.footerHeading}>Payment ID</Text>
              <Text style={styles.footerValue}>#{payment.id}</Text>
            </View>
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Thank you for your business. For any questions regarding this
              invoice, please contact support@validpanel.com
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoiceTemplate;
