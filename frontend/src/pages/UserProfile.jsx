import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiHeart, FiMessageCircle, FiRepeat } from 'react-icons/fi';
import SEO from '../components/SEO';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import StarRating, { ReviewCard } from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { userAPI, swapAPI, reviewAPI } from '../services/api';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { isOnline } = useSocket();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swapOpen, setSwapOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [swapForm, setSwapForm] = useState({ offeredSkill: { name: '', level: 'intermediate' }, requestedSkill: { name: '', level: 'intermediate' }, message: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    userAPI.getUser(id)
      .then(({ data }) => { setProfile(data.user); setReviews(data.reviews); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    try {
      const { data } = await userAPI.toggleFavorite(id);
      setIsFavorite(data.isFavorite);
      toast.success(data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const handleSwapRequest = async () => {
    try {
      await swapAPI.createRequest({ receiver: id, ...swapForm });
      toast.success('Swap request sent!');
      setSwapOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleReview = async () => {
    try {
      await reviewAPI.createReview({ reviewee: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewOpen(false);
      const { data } = await userAPI.getUser(id);
      setProfile(data.user);
      setReviews(data.reviews);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!profile) return <div className="py-20 text-center">User not found</div>;

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <>
      <SEO title={profile.name} description={profile.bio} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <img
                src={profile.avatar?.url || `https://ui-avatars.com/api/?name=${profile.name}`}
                alt={profile.name}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900"
              />
              {isOnline(profile._id) && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.location && (
                <p className="mt-1 flex items-center justify-center gap-1 text-gray-500 sm:justify-start">
                  <FiMapPin className="h-4 w-4" /> {profile.location}
                </p>
              )}
              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <StarRating rating={Math.round(profile.averageRating)} size="sm" />
                <span className="text-sm text-gray-500">({profile.reviewCount} reviews)</span>
              </div>
              {profile.bio && (
  <p className="mt-4 text-gray-600 dark:text-gray-400 break-words leading-7">
    {profile.bio}
  </p>
)}
            </div>
            {!isOwnProfile && isAuthenticated && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setSwapOpen(true)}><FiRepeat /> Request Swap</Button>
                <Link to={`/chat/${profile._id}`}><Button variant="outline"><FiMessageCircle /> Message</Button></Link>
                <Button variant="ghost" onClick={handleFavorite}><FiHeart className={isFavorite ? 'fill-red-500 text-red-500' : ''} /></Button>
                <Button variant="ghost" onClick={() => setReviewOpen(true)}>Leave Review</Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold mb-4">Skills Offered</h2>
            <div className="space-y-3">
              {profile.skillsOffered?.map((s, i) => (
                <div key={i} className="rounded-xl bg-primary-50 p-3 dark:bg-primary-900/20">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{s.level}</p>
                  {s.description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{s.description}</p>}
                </div>
              ))}
              {!profile.skillsOffered?.length && <p className="text-sm text-gray-500">No skills listed</p>}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold mb-4">Skills Wanted</h2>
            <div className="space-y-3">
              {profile.skillsWanted?.map((s, i) => (
                <div key={i} className="rounded-xl bg-violet-50 p-3 dark:bg-violet-900/20">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{s.level}</p>
                  {s.description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{s.description}</p>}
                </div>
              ))}
              {!profile.skillsWanted?.length && <p className="text-sm text-gray-500">No skills listed</p>}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet</p>
            ) : (
              reviews.map((r) => <ReviewCard key={r._id} review={r} />)
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={swapOpen} onClose={() => setSwapOpen(false)} title="Send Swap Request">
        <div className="space-y-4">
          <Input label="Skill You Offer" value={swapForm.offeredSkill.name} onChange={(e) => setSwapForm({ ...swapForm, offeredSkill: { ...swapForm.offeredSkill, name: e.target.value } })} />
          <Input label="Skill You Want" value={swapForm.requestedSkill.name} onChange={(e) => setSwapForm({ ...swapForm, requestedSkill: { ...swapForm.requestedSkill, name: e.target.value } })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea value={swapForm.message} onChange={(e) => setSwapForm({ ...swapForm, message: e.target.value })} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <Button onClick={handleSwapRequest} className="w-full">Send Request</Button>
        </div>
      </Modal>

      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Leave a Review">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Rating</label>
            <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} interactive />
          </div>
          <Input label="Title" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Comment</label>
            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <Button onClick={handleReview} className="w-full">Submit Review</Button>
        </div>
      </Modal>
    </>
  );
};

export default UserProfile;
