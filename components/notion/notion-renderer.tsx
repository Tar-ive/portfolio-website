'use client'

import React from 'react'
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { ParagraphBlock, HeadingBlock } from './text-blocks'
import { RichText } from './rich-text'
import { BlockWithChildren } from './types'

interface NotionRendererProps {
  blocks: BlockWithChildren[]
}

export function NotionRenderer({ blocks }: NotionRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: BlockWithChildren }) {
  const { type } = block

  switch (type) {
    case 'paragraph':
      return <ParagraphBlock block={block.paragraph} />
    
    case 'heading_1':
      return <HeadingBlock level={1} block={block.heading_1} />
    
    case 'heading_2':
      return <HeadingBlock level={2} block={block.heading_2} />
    
    case 'heading_3':
      return <HeadingBlock level={3} block={block.heading_3} />
    
    case 'bulleted_list_item':
      return (
        <div className="space-y-2">
          <div className="flex items-start space-x-3 ml-4">
            <span className="mt-2 h-1.5 w-1.5 bg-foreground rounded-full flex-shrink-0" />
            <div className="flex-1 text-base text-foreground">
              <RichText richText={block.bulleted_list_item?.rich_text || []} />
            </div>
          </div>
        </div>
      )
    
    case 'numbered_list_item':
      return (
        <div className="space-y-2">
          <div className="flex items-start space-x-3 ml-4">
            <span className="mt-0.5 text-base text-foreground font-medium min-w-[1.5rem]">1.</span>
            <div className="flex-1 text-base text-foreground">
              <RichText richText={block.numbered_list_item?.rich_text || []} />
            </div>
          </div>
        </div>
      )
    
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-6 py-3 my-6 bg-muted/30 rounded-r-lg">
          <div className="text-base text-foreground italic">
            <RichText richText={block.quote?.rich_text || []} />
          </div>
        </blockquote>
      )
    
    case 'code':
      const language = block.code?.language || 'text'
      const codeText = block.code?.rich_text?.map((text: any) => text.plain_text).join('') || ''
      return (
        <div className="my-6">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono text-foreground">
              {codeText}
            </code>
          </pre>
        </div>
      )
    
    case 'divider':
      return <hr className="my-8 border-t border-border" />
    
    case 'image':
      let imageUrl = ''
      if ('file' in block.image && block.image.file) {
        imageUrl = block.image.file.url
      } else if ('external' in block.image && block.image.external) {
        imageUrl = block.image.external.url
      }
      const caption = block.image.caption ? 
        block.image.caption.map((text: any) => text.plain_text).join('') : ''
      
      return (
        <figure className="my-8">
          <img 
            src={imageUrl} 
            alt={caption} 
            className="w-full rounded-lg shadow-md"
          />
          {caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    
    default:
      // For unsupported block types, show the type for debugging
      console.log('Unsupported block type:', type, block)
      return (
        <div className="text-muted-foreground text-sm p-2 bg-muted rounded">
          Unsupported block type: {type}
        </div>
      )
  }
}