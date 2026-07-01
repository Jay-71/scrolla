import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, getDocFromCache, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Returns the current date in YYYY-MM-DD format (local time).
 */
export const getTodayStr = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Calculates the difference in days between two YYYY-MM-DD strings.
 */
const getDaysDifference = (dateStr1, dateStr2) => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Logs a completed topic for today and recalculates the streak using cached data to avoid server reads.
 */
export const logTopicCompletion = async (userId, topicId) => {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    
    // Attempt to read purely from local cache to save server costs
    let userSnap;
    try {
      userSnap = await getDocFromCache(userRef);
    } catch (e) {
      // If cache miss, fallback to standard getDoc
      userSnap = await getDoc(userRef);
    }

    const todayStr = getTodayStr();

    if (userSnap.exists()) {
      const data = userSnap.data();
      const completedDates = data.completed_dates || {};
      const alreadyCompletedToday = !!completedDates[todayStr];
      
      let newCurrentStreak = data.current_streak || 0;
      let newLongestStreak = data.longest_streak || 0;
      const lastActiveDate = data.last_active_date;

      if (!alreadyCompletedToday) {
        if (!lastActiveDate) {
          newCurrentStreak = 1;
        } else {
          const diffDays = getDaysDifference(lastActiveDate, todayStr);
          if (diffDays === 1) {
            newCurrentStreak += 1;
          } else if (diffDays > 1) {
            newCurrentStreak = 1;
          }
        }
        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak;
        }
      }

      const todaysTopics = completedDates[todayStr] || [];
      if (!todaysTopics.includes(topicId)) {
        todaysTopics.push(topicId);
      }

      // Blind write!
      await setDoc(userRef, {
        completed_dates: {
          [todayStr]: todaysTopics
        },
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_active_date: todayStr
      }, { merge: true });

      return {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: todayStr,
        isNewStreakDay: !alreadyCompletedToday
      };
      
    } else {
      const newData = {
        completed_dates: {
          [todayStr]: [topicId]
        },
        current_streak: 1,
        longest_streak: 1,
        last_active_date: todayStr
      };
      
      await setDoc(userRef, newData, { merge: true });
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: todayStr,
        isNewStreakDay: true
      };
    }
  } catch (error) {
    console.error("Error logging topic completion:", error);
    throw error;
  }
};

/**
 * Fetches the user's entire streak data from cache (or server if cache is empty).
 */
export const getStreakData = async (userId) => {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    let userSnap;
    try {
      userSnap = await getDocFromCache(userRef);
    } catch (e) {
      userSnap = await getDoc(userRef);
    }

    if (userSnap.exists()) {
      const data = userSnap.data();
      let displayStreak = data.current_streak || 0;
      const todayStr = getTodayStr();
      const lastActiveDate = data.last_active_date;
      
      if (lastActiveDate) {
        const diffDays = getDaysDifference(lastActiveDate, todayStr);
        if (diffDays > 1) {
          displayStreak = 0;
        }
      }

      return {
        currentStreak: displayStreak,
        longestStreak: data.longest_streak || 0,
        completedDates: data.completed_dates || {},
        lastActiveDate: data.last_active_date || null
      };
    }
    
    return {
      currentStreak: 0,
      longestStreak: 0,
      completedDates: {},
      lastActiveDate: null
    };

  } catch (error) {
    console.error("Error fetching streak data:", error);
    throw error;
  }
};
