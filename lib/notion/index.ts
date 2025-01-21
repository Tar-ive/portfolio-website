import { rpc, values } from './rpc'

export async function getBlogPosts() {
  if (!process.env.BLOG_INDEX_ID) {
    throw new Error('BLOG_INDEX_ID is not set in env')
  }

  try {
    const data = await rpc('loadPageChunk', {
      pageId: process.env.BLOG_INDEX_ID,
      limit: 100,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false,
    })

    const blocks = values(data.recordMap.block)
    const tableBlock = blocks.find(
      (block: any) => block.value.type === 'collection_view'
    )

    if (!tableBlock) {
      throw new Error('Could not find collection view')
    }

    const collectionId = tableBlock.value.collection_id
    
    const { recordMap } = await rpc('queryCollection', {
      collectionId,
      collectionViewId: tableBlock.value.view_ids[0],
      query: {
        sort: [{ property: 'Published', direction: 'desc' }],
      },
      loader: {
        type: 'table',
        limit: 999,
        searchQuery: '',
        loadContentCover: true,
      },
    })

    const posts = values(recordMap.block)
      .filter((block: any) => block.value.parent_id === collectionId)
      .map((block: any) => {
        const properties = block.value.properties
        return {
          id: block.value.id,
          title: properties?.title?.[0]?.[0] || 'Untitled',
          description: properties?.Description?.[0]?.[0] || '',
          date: properties?.Published?.[0]?.[1]?.[0]?.[1]?.start_date || '',
          slug: properties?.Slug?.[0]?.[0] || block.value.id,
        }
      })

    return posts
  } catch (err) {
    console.error('Failed to load blog posts', err)
    return []
  }
}

export async function getBlogPost(slug: string) {
  const posts = await getBlogPosts()
  const post = posts.find((p: { slug: string }) => p.slug === slug)
  
  if (!post) {
    throw new Error('Post not found')
  }

  try {
    const data = await rpc('loadPageChunk', {
      pageId: post.id,
      limit: 100,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false,
    })

    const blocks = values(data.recordMap.block)
    
    // Convert blocks to markdown-like format
    const content = blocks
      .filter((block: any) => block.value.type === 'text')
      .map((block: any) => block.value.properties?.title?.[0]?.[0] || '')
      .join('\n\n')

    return {
      ...post,
      content,
    }
  } catch (err) {
    console.error('Failed to load blog post', err)
    throw new Error('Failed to load blog post')
  }
}
