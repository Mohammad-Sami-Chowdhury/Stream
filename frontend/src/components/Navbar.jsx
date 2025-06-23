import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Dot, Menu } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { getFriendRequests } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isNotificationPage = location.pathname === "/notifications";

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 1000,
  });
  const incomingRequests = friendRequests?.incomingReqs || [];

  const hasSeenFriendRequests =
    localStorage.getItem("friendRequestsSeen") === "true";

  useEffect(() => {
    if (incomingRequests.length > 0) {
      localStorage.setItem("friendRequestsSeen", "false");
    }
  }, [incomingRequests]);

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {incomingRequests.length > 0 &&
                  !hasSeenFriendRequests &&
                  !isNotificationPage && (
                    <Dot
                      className="absolute -top-5 -right-5 text-red-700"
                      size={70}
                    />
                  )}
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <Link to={"/profile"} className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </Link>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
