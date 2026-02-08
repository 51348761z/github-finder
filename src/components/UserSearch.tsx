import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { fetchGithubUser } from "../api/github";
import { RecentSearches } from "./RecentSearches";
import { UserCard } from "./UserCard";

export const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      return;
    }

    setSubmittedUsername(trimmed);
    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return updated.slice(0, 5);
    });
    setUsername("");
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter Github Username"
          value={username}
          name="username"
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}

      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUsername(username);
            setSubmittedUsername(username);
          }}
        />
      )}
    </React.Fragment>
  );
};
