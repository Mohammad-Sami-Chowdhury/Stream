import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Chaters = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: activeId } = useParams(); // currently active friend
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get("/users/friends");
        setFriends(res.data);
      } catch (err) {
        console.error("Friend fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleClick = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  if (loading) return <div className="p-4">Loading friends...</div>;

  return (
    <div className="p-4 overflow-y-auto h-full space-y-2">
      <h2 className="text-xl font-bold mb-3">Friends</h2>
      {friends.map((friend) => (
        <div
          key={friend._id}
          onClick={() => handleClick(friend._id)}
          className={`flex items-center gap-3 p-2 rounded cursor-pointer 
          border border-transparent 
          hover:bg-gray-100 dark:hover:bg-gray-700 
          ${friend._id === activeId ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : ""}`}
        >
          <img
            src={friend.profilePic}
            alt={friend.fullName}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{friend.fullName}</span>
        </div>
      ))}
    </div>
  );
};

export default Chaters;
