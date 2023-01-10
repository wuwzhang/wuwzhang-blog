import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'

export const NOTES_PER_PAGE = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('note')
  const initialDisplayPosts = posts.slice(0, NOTES_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / NOTES_PER_PAGE),
  }

  return { props: { initialDisplayPosts, posts, pagination } }
}

export default function Note({ posts, initialDisplayPosts, pagination }) {
  return (
    <>
      <PageSEO title={`Note - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="笔记"
        type="note"
      />
    </>
  )
}
