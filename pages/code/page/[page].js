import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import ListSimple from '@/layouts/ListSimple'

export async function getStaticPaths() {
  const totalPosts = await getAllFilesFrontMatter('code')
  const totalPages = totalPosts.length
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const posts = await getAllFilesFrontMatter('code')

  return {
    props: {
      posts,
    },
  }
}

export default function PostPage({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListSimple posts={posts} title="手撕" type="code" />
    </>
  )
}
