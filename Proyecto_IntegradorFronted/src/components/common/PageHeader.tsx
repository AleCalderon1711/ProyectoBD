interface PageHeaderProps {
  title: string
  actionLabel?: string
  onActionClick?: () => void
}

export default function PageHeader({ title, actionLabel, onActionClick }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-700">{title}</h1>

      {actionLabel ? (
        <button
          type="button"
          onClick={onActionClick}
          className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
