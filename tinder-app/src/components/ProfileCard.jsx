export default function ProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <div className="card-avatar" style={{ backgroundColor: profile.color }}>
        <span>{profile.avatar}</span>
      </div>
      <div className="card-body">
        <div className="card-header">
          <h2 className="card-name">{profile.name}</h2>
          <span className="card-age">{profile.age}</span>
        </div>
        <p className="card-location">📍 {profile.location}</p>
        <p className="card-bio">{profile.bio}</p>
        <div className="card-interests">
          {profile.interests.map((interest) => (
            <span key={interest} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
