import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../utils/admin";

export default function useResource(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => {
    setRevision((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await loader();

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(errorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [loader, revision]);

  return { data, loading, error, reload };
}
