import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-card">
        <div className="skeleton-avatar" />
        <div className="skeleton-line skeleton-line--wide" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--narrow" />
      </div>
    </div>
  );
}
