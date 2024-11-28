"use client";

import { useParams } from "next/navigation";
import { DetailView } from "@/app/components/DetailView";
import { CollocationResult } from "@/app/lib/types";
import { useEffect, useState } from "react";

export default function DetailPage() {
  const params = useParams();
  const collocation = typeof params.collocation === "string" ? params.collocation : undefined;
  const [result, setResult] = useState<CollocationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collocation) {
      setLoading(false);
      return;
    }

    const fetchCollocationDetails = async () => {
      try {
        const response = await fetch(`/api/collocation?collocation=${encodeURIComponent(collocation)}`);
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Error fetching collocation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollocationDetails();
  }, [collocation]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!result) {
    return <p className="text-center text-red-600">Collocation details not found.</p>;
  }

  return <DetailView result={result} onClose={() => {}} />;
}
