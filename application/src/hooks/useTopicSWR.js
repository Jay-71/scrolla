import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTopicSWR = (topicId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadTopic = async () => {
      try {
        const topicCacheKey = `cache_topic_${topicId}`;
        const indexCacheKey = `cache_ml_index`;

        // 1. Instantly return Cached Topic Data if available (0ms perceived latency)
        const cachedTopicStr = await AsyncStorage.getItem(topicCacheKey);
        if (cachedTopicStr && isMounted) {
          setData(JSON.parse(cachedTopicStr));
          setIsLoading(false); 
        } else if (isMounted) {
          setIsLoading(true);
        }

        // 2. Fetch Index.json (to get the exact filename)
        const indexUrl = 'https://scrolla-content.vercel.app/ML/index.json';
        let indexData;
        const cachedIndexStr = await AsyncStorage.getItem(indexCacheKey);
        
        // Fire off a background fetch to always ensure our index cache is fresh
        const indexPromise = fetch(indexUrl)
          .then(res => res.json())
          .then(newData => {
             AsyncStorage.setItem(indexCacheKey, JSON.stringify(newData));
             return newData;
          })
          .catch(err => {
             if (__DEV__) console.error("Index fetch error:", err);
             return null;
          });

        if (cachedIndexStr) {
           indexData = JSON.parse(cachedIndexStr);
        } else {
           indexData = await indexPromise;
        }

        if (!indexData) throw new Error("Could not load CDN index metadata.");

        const topicMeta = indexData.topics.find(t => t.id === Number(topicId));
        if (!topicMeta) throw new Error("Topic not found in CDN index mapping.");

        // 3. Fetch exact topic payload or batched payload (Background Revalidation)
        const fetchFile = topicMeta.batch_file || topicMeta.file;
        let topicUrl = `https://scrolla-content.vercel.app/ML/${fetchFile}`;
        let topicRes = await fetch(topicUrl);
        
        // --- STALE CACHE RECOVERY ---
        if (topicRes.status === 404 && cachedIndexStr) {
           indexData = await indexPromise;
           if (indexData) {
              const freshMeta = indexData.topics.find(t => t.id === Number(topicId));
              if (freshMeta) {
                 const freshFetchFile = freshMeta.batch_file || freshMeta.file;
                 topicUrl = `https://scrolla-content.vercel.app/ML/${freshFetchFile}`;
                 topicRes = await fetch(topicUrl);
              }
           }
        }
        
        if (!topicRes.ok) throw new Error(`HTTP ${topicRes.status} from CDN`);
        
        const responseData = await topicRes.json();
        let textData = "";
        
        // If it's a batched payload, find the specific topic and proactively cache siblings
        if (responseData.topics) {
           const targetData = responseData.topics.find(t => t.topic === topicMeta.title);
           if (!targetData) throw new Error("Topic not found in batched payload.");
           
           textData = JSON.stringify(targetData);
           
           // Proactive Caching for siblings
           for (const sibling of responseData.topics) {
              const siblingMeta = indexData.topics.find(t => t.title === sibling.topic);
              if (siblingMeta && siblingMeta.id !== Number(topicId)) {
                 AsyncStorage.setItem(`cache_topic_${siblingMeta.id}`, JSON.stringify(sibling)).catch(()=>{});
              }
           }
        } else {
           // Fallback for legacy single-file payloads (e.g. Frontend/Backend)
           textData = JSON.stringify(responseData);
        }
        
        // 4. Stale-While-Revalidate compare
        // If the server data differs from our local cache, update state seamlessly!
        if (textData !== cachedTopicStr) {
          await AsyncStorage.setItem(topicCacheKey, textData);
          if (isMounted) {
            setData(JSON.parse(textData));
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (__DEV__) console.error("SWR Hook Error:", err);
        if (isMounted) {
          setError(err);
          if (!data) setIsLoading(false); // Only unset loading if we have no fallback data rendering
        }
      }
    };

    loadTopic();
    return () => { isMounted = false; };
  }, [topicId]);

  return { data, isLoading, error };
};
