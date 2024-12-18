"use client"

import { TwitterTweetEmbed } from 'react-twitter-embed';

interface TwitterEmbedProps {
  tweetId: string;
}

export function TwitterEmbed({ tweetId }: TwitterEmbedProps) {
  return (
    <div className="twitter-embed-container">
      <TwitterTweetEmbed tweetId={tweetId} />
    </div>
  );
}
