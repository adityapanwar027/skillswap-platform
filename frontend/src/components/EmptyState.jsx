import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon: Icon = FiInbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 px-6 text-center dark:border-gray-800">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
    {action}
  </div>
);

export default EmptyState;
