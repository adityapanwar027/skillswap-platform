import { FiStar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const StarRating = ({ rating, onRate, interactive = false, size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onRate?.(star) : undefined}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <FiStar
            className={`${sizes[size]} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        </button>
      ))}
    </div>
  );
};

export const ReviewCard = ({ review }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start gap-3">
      <img
        src={review.reviewer?.avatar?.url || `https://ui-avatars.com/api/?name=${review.reviewer?.name}`}
        alt={review.reviewer?.name}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{review.reviewer?.name}</h4>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </span>
        </div>
        <StarRating rating={review.rating} size="sm" />
        {review.title && <p className="mt-2 font-medium">{review.title}</p>}
        {review.comment && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>}
      </div>
    </div>
  </div>
);

export default StarRating;
