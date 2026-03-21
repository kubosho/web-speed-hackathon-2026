import { type ReactNode, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  items: any[];
  fetchMore: () => void;
}

export const InfiniteScroll = ({ children, fetchMore, items }: Props) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const latestItem = items[items.length - 1];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      // Sentinel element that is visible at the bottom of the list triggers fetchMore
      if (entries[0]?.isIntersecting && latestItem !== undefined) {
        fetchMore();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [latestItem, fetchMore]);

  return (
    <>
      {children}
      <div ref={sentinelRef} />
    </>
  );
};
