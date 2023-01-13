import Link from './Link'

const Card = ({ title, description, href }) => (
  <div className="md p-4 md:w-1/3" style={{ maxWidth: '544px' }}>
    <Link href={href} aria-label={`Link to ${title}`}>
      <div
        className={`overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 hover:border-blue-400 dark:border-gray-700`}
        style={{ height: 160 }}
      >
        <div className="p-6">
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">{title}</h2>
          <p className="prose mb-3 max-w-none text-gray-500 line-clamp-2 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  </div>
)

export default Card
