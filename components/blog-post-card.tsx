'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  description: string
  slug: string
  date: string
  author: string
  published: boolean
}

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/20 group-hover:border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="w-fit">
              Published
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(post.date).toLocaleDateString()}
            </div>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base line-clamp-3 mb-3">
            {post.description}
          </CardDescription>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            {post.author}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}