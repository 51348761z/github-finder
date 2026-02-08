import type { GithubUser } from "../type";

type SuggestionDropdownProps = {
  suggestions: GithubUser[];
  show: boolean;
  onSelect: (username: string) => void;
};

export const SuggestionDropdown = ({
  suggestions,
  show,
  onSelect,
}: SuggestionDropdownProps) => {
  if (!show || suggestions.length === 0) {
    return null;
  }

  return (
    <ul className="suggestions">
      {suggestions.slice(0, 5).map((user) => (
        <li key={user.login} onClick={() => onSelect(user.login)}>
          <img src={user.avatar_url} alt={user.login} className="avatar-xs" />
          {user.login}
        </li>
      ))}
    </ul>
  );
};
