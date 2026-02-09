import { useMutation, useQuery } from "@tanstack/react-query";
import { FaGithubAlt, FaUserMinus, FaUserPlus } from "react-icons/fa";
import {
  checkIfFollowingUser,
  followGithubUser,
  unfollowGithubUser,
} from "../api/github";
import type { GithubUser } from "../type";

export const UserCard = ({ user }: { user: GithubUser }) => {
  // Query to check if user is following
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ["follow-status", user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  // Mutation to follow the user
  const followMutation = useMutation({
    mutationFn: () => followGithubUser(user.login),
    onSuccess: () => {
      console.log(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowGithubUser(user.login),
    onSuccess: () => {
      console.log(`You have unfollowed ${user.login}`);
      refetch();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });
  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className="user-card">
      <img src={user.avatar_url} alt={user.name} className="avatar" />
      <h2>{user.name || user.login}</h2>
      <p className="bio">{user.bio}</p>

      <div className="user-card-buttons">
        <button
          className={`follow-btn ${isFollowing ? "following" : ""}`}
          onClick={handleFollow}
          disabled={followMutation.isPending || unfollowMutation.isPending}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className="follow-icon" />
              Following
            </>
          ) : (
            <>
              <FaUserPlus className="follow-icon" />
              Follow User
            </>
          )}
        </button>

        <a
          href={user.html_url}
          className="profile-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubAlt /> View Github Profile
        </a>
      </div>
    </div>
  );
};
