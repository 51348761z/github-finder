import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchGithubUser } from "../api/github";
import { UserCard } from "./UserCard";

export const UserSearch = () => {
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", "submittedUsername"],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setSubmittedUsername(username.trim());
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter Github Username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}

      {data && <UserCard user={data} />}
    </React.Fragment>
  );
};
