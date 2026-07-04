import { useEffect, useState } from "react";
import api from "../services/api";

function useUnreadNotifications(user) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.role || !user?.profileId) {
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const response = await api.get(
          `/notifications/${user.role}/${user.profileId}/unread`
        );

        setUnreadCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch (error) {
        console.log(error);
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
  }, [user]);

  return unreadCount;
}

export default useUnreadNotifications;
