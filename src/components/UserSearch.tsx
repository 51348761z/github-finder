import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { useDebounce } from "use-debounce";
import { fetchGithubUser, searchGithubUser } from "../api/github";
import { RecentSearches } from "./RecentSearches";
import { SuggestionDropdown } from "./SuggestionDropdown";
import { UserCard } from "./UserCard";

export const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers");
    return stored ? JSON.parse(stored) : [];
  });
  const [debouncedUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

  // Query to fetch specific user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  // Query to fetch suggestions for user fearch
  const { data: suggestions } = useQuery({
    queryKey: ["guthub-user-suggestions", debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
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
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter Github Username"
            value={username}
            name="username"
            onChange={(e) => {
              const val = e.currentTarget.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />

          {showSuggestions && suggestions && suggestions?.length > 0 && (
            <SuggestionDropdown
              suggestions={suggestions}
              show={showSuggestions}
              onSelect={(selectedUsername) => {
                setUsername(selectedUsername);
                setShowSuggestions(false);
                setRecentUsers((prev) =>
                  [
                    selectedUsername,
                    ...prev.filter((username) => username !== selectedUsername),
                  ].slice(0, 5),
                );

                if (submittedUsername !== selectedUsername) {
                  setSubmittedUsername(selectedUsername);
                } else {
                  refetch();
                }
              }}
            />
          )}
        </div>
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
