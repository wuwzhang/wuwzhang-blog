import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import Card from '@/components/Card'
import Link from 'next/link'
import ListSimple from '@/layouts/ListSimple'

export const POSTS_PER_PAGE = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('code')

  return { props: { posts } }
}

export default function Code({ posts }) {
  return (
    <>
      <PageSEO title={`Code - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListSimple title="手撕" posts={posts} type="code" />
    </>
  )
}
