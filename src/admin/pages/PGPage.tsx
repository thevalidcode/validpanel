import { useMemo, useState } from "react";
import Layout from "@/admin/components/Layout";

import PGMobileView from "../components/payment_gateway/PGMobileView";
import PGDesktopView from "../components/payment_gateway/PGDesktopView";

import type { PGFiltersState } from "../components/payment_gateway/PGFilters";
import type { PGTableRow } from "../components/payment_gateway/RecentPGTable";
import type { PG } from "../components/payment_gateway/PGCard";

/* -------------------- MOCK DATA -------------------- */

const PG_DATA: PG[] = [
  {
    id: 1,
    uid: "PAY-2024-001",
    name: "Paystack",
    description: "Credit Cards, Bank Transfer",
    logo: "/images/paystack.png",
    fee: "1.5% + ₦100",
    status: "ACTIVE",
    lastUpdated: "Jan 15, 2024",
  },
  {
    id: 2,
    uid: "PAY-2024-002",
    name: "Flutterwave",
    description: "Cards, USSD, Mobile Money",
    logo: "/images/flutterwave.png",
    fee: "1.4% + ₦50",
    status: "SANDBOX",
    lastUpdated: "Jan 14, 2024",
  },
  {
    id: 3,
    uid: "PAY-2024-003",
    name: "Stripe",
    description: "International Cards",
    logo: "/images/stripe.png",
    fee: "2.9% + $0.30",
    status: "INACTIVE",
    lastUpdated: "Jan 10, 2024",
  },
];

const PAGE_SIZE = 8;

/* -------------------- PAGE -------------------- */

const PGPage = () => {
  /* -------------------- STATE -------------------- */

  const [filters, setFilters] = useState<PGFiltersState>({
    status: "All",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  /* -------------------- FILTER HANDLER -------------------- */

  const updateFilters = (next: Partial<PGFiltersState>) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...next }));
  };

  /* -------------------- FILTERING -------------------- */

  const filteredPG = useMemo(() => {
    return PG_DATA.filter((pg) => {
      if (filters.status !== "All" && pg.status !== filters.status) {
        return false;
      }

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const text = `${pg.name} ${pg.description} ${pg.uid}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [filters]);

  /* -------------------- SUMMARY COUNTS -------------------- */

  const summaryCounts = useMemo(() => {
    const total = filteredPG.length;
    const active = filteredPG.filter((pg) => pg.status === "ACTIVE").length;
    const inactive = filteredPG.filter((pg) => pg.status === "INACTIVE").length;

    return {
      total,
      active,
      inactive,
      successRate: total ? `${Math.round((active / total) * 100)}%` : "0%",
    };
  }, [filteredPG]);

  /* -------------------- PAGINATION -------------------- */

  const totalPages = Math.max(1, Math.ceil(filteredPG.length / PAGE_SIZE));

  const paginatedPG = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPG.slice(start, start + PAGE_SIZE);
  }, [filteredPG, currentPage]);

  /* -------------------- DESKTOP TABLE ADAPTER -------------------- */

  const tableRows: PGTableRow[] = useMemo(() => {
    return paginatedPG.map((pg) => ({
      id: pg.id,
      name: pg.name,
      providerUrl: pg.uid,
      logo: pg.logo,
      type: pg.description,
      fee: pg.fee,
      status: pg.status,
      lastUpdated: pg.lastUpdated,
    }));
  }, [paginatedPG]);

  /* -------------------- RENDER -------------------- */

  return (
    <Layout
      title="Payment Gateways"
      description="Manage and configure all payment gateways."
    >
      {/* MOBILE */}
      <PGMobileView
        pgs={paginatedPG}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* DESKTOP */}
      <PGDesktopView
        pgs={tableRows}
        filters={filters}
        onFiltersChange={updateFilters}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        summaryCounts={summaryCounts}
      />
    </Layout>
  );
};

export default PGPage;
