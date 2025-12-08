import { useState } from "react";
import UsersMobileView from "../components/users/UsersMobileView";
import UsersDesktopView from "../components/users/UsersDesktopView";
import Layout from "@/admin/components/Layout";

const initialUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    stores: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    stores: 1,
    status: "Active",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@email.com",
    stores: 5,
    status: "Banned",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@email.com",
    stores: 2,
    status: "Active",
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleLoadMore = () => {
    const moreUsers = [
      {
        id: Date.now(),
        name: "New User",
        email: "new.user@email.com",
        stores: 1,
        status: "Active",
      },
    ];
    setUsers((prev) => [...prev, ...moreUsers]);
  };
  return (
    <Layout
      title="Users Management"
      description="View and manage all created users."
    >
      <div className="md:hidden w-full space-y-5">
        <UsersMobileView
          search={search}
          onSetSearch={setSearch}
          filter={filter}
          onSetFilter={setFilter}
          users={filteredUsers}
          onHandleLoadMore={handleLoadMore}
        />
      </div>
      <div className="hidden md:block">
        <UsersDesktopView />
      </div>
    </Layout>
  );
};

export default UsersPage;
