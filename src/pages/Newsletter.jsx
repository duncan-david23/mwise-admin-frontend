import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { supabase } from "../utils/supabase";


const Newsletter = () => {
  // const initialEmails = [
  //   { id: 1, email: "john.doe@example.com", name: "John Doe", status: "Subscribed", date: "2024-01-15" },
  //   { id: 2, email: "sarah.smith@example.com", name: "Sarah Smith", status: "Subscribed", date: "2024-01-14" },
  //   { id: 3, email: "mike.johnson@example.com", name: "Mike Johnson", status: "Unsubscribed", date: "2024-01-13" },
  //   { id: 4, email: "emily.wilson@example.com", name: "Emily Wilson", status: "Subscribed", date: "2024-01-12" },
  //   { id: 5, email: "alex.brown@example.com", name: "Alex Brown", status: "Pending", date: "2024-01-11" },
  //   { id: 6, email: "lisa.davis@example.com", name: "Lisa Davis", status: "Subscribed", date: "2024-01-10" },
  //   { id: 7, email: "david.miller@example.com", name: "David Miller", status: "Subscribed", date: "2024-01-09" },
  //   { id: 8, email: "jennifer.taylor@example.com", name: "Jennifer Taylor", status: "Unsubscribed", date: "2024-01-08" },
  // ];

  const [emails, setEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEmails, setSelectedEmails] = useState([]);


  useEffect(() => {
  const fetchEmails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const response = await axios.get("http://192.168.100.126:3001/api/newsletter/emails", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.newsletters && Array.isArray(response.data.newsletters)) {
        setEmails(response.data.newsletters);
      }
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
    }
  };

  fetchEmails();
}, []);








  const filteredEmails = useMemo(() => {
    return emails?.filter((email) => {
      const matchesSearch =
        email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "All" || email.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [emails, searchTerm, selectedStatus]);

  const handleEmailSelect = (id) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((emailId) => emailId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map((email) => email.id));
    }
  };

  const exportToCSV = () => {
    const emailsToExport =
      selectedEmails.length > 0
        ? emails.filter((email) => selectedEmails.includes(email.id))
        : filteredEmails;

    if (emailsToExport.length === 0) {
      alert("No emails to export");
      return;
    }

    const headers = ["Email", "Name", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...emailsToExport.map(
        (email) => `"${email.email}","${email.name}","${email.status}","${email.subscribed_date}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Subscribed":
        return "bg-green-100 text-green-700";
      case "Unsubscribed":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Newsletter Subscribers</h1>
        <p className="text-gray-500 mt-1">Manage, search, and export your subscribers list.</p>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search emails or names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-5.2-5.2M16 10.5A5.5 5.5 0 1110.5 5 5.5 5.5 0 0116 10.5z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Subscribed">Subscribed</option>
              <option value="Unsubscribed">Unsubscribed</option>
              <option value="Pending">Pending</option>
            </select>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedEmails?.length === filteredEmails.length && filteredEmails.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredEmails.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500 text-sm">
              No subscribers found.
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                className="grid grid-cols-1 sm:grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-all"
              >
                {/* Checkbox */}
                <div className="flex items-center sm:col-span-1 mb-2 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email.id)}
                    onChange={() => handleEmailSelect(email.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-4 font-medium text-gray-900 text-sm">
                  {email.email}
                </div>

                {/* Name */}
                <div className="sm:col-span-3 text-gray-600 text-sm">
                  {email.name}
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      email.status
                    )}`}
                  >
                    {email.status}
                  </span>
                </div>

                {/* Date */}
                <div className="sm:col-span-2 text-gray-500 text-xs sm:text-right mt-2 sm:mt-0">
                  {email.subscribed_date}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <span>
            {selectedEmails.length > 0
              ? `${selectedEmails.length} of ${filteredEmails.length} selected`
              : `Showing ${filteredEmails.length} subscribers`}
          </span>
          <span>Total: {emails.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
